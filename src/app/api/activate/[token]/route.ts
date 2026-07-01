import { NextResponse } from 'next/server';
import { db } from '@/db';
import { accounts } from '@/db/schema/accounts';
import { legacyContacts, notificationContacts } from '@/db/schema/people';
import { letters } from '@/db/schema/vault';
import { activations } from '@/db/schema/activation';
import { eq, and } from 'drizzle-orm';
import { sendActivationPending } from '@/lib/emails';
import { cancelWindowExpiry, CANCEL_WINDOW_HOURS } from '@/lib/activation';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://mourninguide.com';

async function loadByToken(token: string) {
  const rows = await db.select().from(legacyContacts)
    .where(eq(legacyContacts.activationToken, token))
    .limit(1);
  if (!rows[0]) return null;
  const contact = rows[0];
  const accountRows = await db.select().from(accounts)
    .where(eq(accounts.id, contact.accountId)).limit(1);
  if (!accountRows[0]) return null;
  return { contact, account: accountRows[0] };
}

// GET — describe the guide + current activation state for the activate page
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const loaded = await loadByToken(token);
  if (!loaded) return NextResponse.json({ error: 'Invalid token' }, { status: 404 });
  const { contact, account } = loaded;

  // Counts to show on the confirmation screen
  const [allLetters, allContacts] = await Promise.all([
    db.select().from(letters).where(eq(letters.accountId, account.id)),
    db.select().from(notificationContacts).where(eq(notificationContacts.accountId, account.id)),
  ]);

  let cancelWindowExpiresAt: string | null = null;
  if (account.activationStatus === 'activation_pending') {
    const act = await db.select().from(activations)
      .where(and(eq(activations.accountId, account.id), eq(activations.status, 'pending')))
      .limit(1);
    cancelWindowExpiresAt = act[0]?.cancelWindowExpiresAt?.toISOString() ?? null;
  }

  return NextResponse.json({
    contactName: contact.name,
    subjectName: account.subjectName,
    status: account.activationStatus, // active | activation_pending | activated
    cancelWindowExpiresAt,
    cancelWindowHours: CANCEL_WINDOW_HOURS,
    lettersCount: allLetters.filter(l => l.recipientEmail).length,
    lettersWithoutEmail: allLetters.filter(l => !l.recipientEmail).length,
    contactsCount: allContacts.filter(c => c.email).length,
  });
}

// POST — begin activation: open the cancel window. Nothing is sent yet.
export async function POST(
  _req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const loaded = await loadByToken(token);
  if (!loaded) return NextResponse.json({ error: 'Invalid token' }, { status: 404 });
  const { contact, account } = loaded;

  if (account.activationStatus === 'activated') {
    return NextResponse.json({ status: 'activated' });
  }
  if (account.activationStatus === 'activation_pending') {
    const act = await db.select().from(activations)
      .where(and(eq(activations.accountId, account.id), eq(activations.status, 'pending')))
      .limit(1);
    return NextResponse.json({
      status: 'activation_pending',
      cancelWindowExpiresAt: act[0]?.cancelWindowExpiresAt?.toISOString() ?? null,
    });
  }

  const expiry = cancelWindowExpiry();

  // Open the cancel window — hold all sends until it closes
  await db.update(accounts)
    .set({ activationStatus: 'activation_pending', updatedAt: new Date() })
    .where(eq(accounts.id, account.id));

  await db.insert(activations).values({
    accountId: account.id,
    triggeredByUserId: contact.id,
    verificationMethod: 'legacy_contact_link',
    status: 'pending',
    cancelWindowExpiresAt: expiry,
  });

  // Counts for the pending email
  const [allLetters, allContacts] = await Promise.all([
    db.select().from(letters).where(eq(letters.accountId, account.id)),
    db.select().from(notificationContacts).where(eq(notificationContacts.accountId, account.id)),
  ]);
  const lettersCount = allLetters.filter(l => l.recipientEmail).length;
  const contactsCount = allContacts.filter(c => c.email).length;

  // Email the legacy contact a "we're holding it" note with a cancel link
  if (contact.email) {
    sendActivationPending({
      to: contact.email,
      contactName: contact.name,
      deceasedName: account.subjectName ?? 'your loved one',
      cancelUrl: `${APP_URL}/activate/${token}?cancel=1`,
      windowHours: CANCEL_WINDOW_HOURS,
      lettersCount,
      contactsCount,
    }).catch(() => {});
  }

  return NextResponse.json({
    status: 'activation_pending',
    cancelWindowExpiresAt: expiry.toISOString(),
    cancelWindowHours: CANCEL_WINDOW_HOURS,
    lettersCount,
    contactsCount,
  });
}
