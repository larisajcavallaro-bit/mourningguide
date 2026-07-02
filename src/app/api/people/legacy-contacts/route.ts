import { currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { db } from '@/db';
import { accounts } from '@/db/schema/accounts';
import { legacyContacts } from '@/db/schema/people';
import { eq } from 'drizzle-orm';
import { authAccount } from '@/lib/account';
import { sendLegacyContactInvitation } from '@/lib/emails';
import { randomBytes } from 'crypto';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://mourninguide.com';
const MAX_LEGACY_CONTACTS = 3;

// GET — list all legacy contacts for the account (up to 3). Any one of them
// can independently activate the guide — this is intentional redundancy, in
// case a contact is unreachable, has moved, or has passed away themselves.
export async function GET() {
  const authResult = await authAccount();
  if (!authResult.ok) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }
  const { accountId } = authResult;

  const rows = await db.select().from(legacyContacts)
    .where(eq(legacyContacts.accountId, accountId))
    .orderBy(legacyContacts.createdAt);
  return NextResponse.json({ items: rows });
}

// POST — add a new legacy contact (max 3 per account)
export async function POST(req: Request) {
  const authResult = await authAccount();
  if (!authResult.ok) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }
  const { accountId } = authResult;

  const existing = await db.select({ id: legacyContacts.id })
    .from(legacyContacts).where(eq(legacyContacts.accountId, accountId));
  if (existing.length >= MAX_LEGACY_CONTACTS) {
    return NextResponse.json({ error: `You can add up to ${MAX_LEGACY_CONTACTS} legacy contacts.` }, { status: 400 });
  }

  const body = await req.json();
  const { name, email, phone } = body;
  if (!name?.trim()) return NextResponse.json({ error: 'name required' }, { status: 400 });

  const activationToken = randomBytes(32).toString('hex');
  const newEmail = email?.trim() || null;

  const [row] = await db.insert(legacyContacts).values({
    accountId,
    name: name.trim(),
    email: newEmail,
    phone: phone?.trim() || null,
    activationToken,
  }).returning();

  if (newEmail) {
    const user = await currentUser();
    const [acct] = await db
      .select({ subjectName: accounts.subjectName, planFor: accounts.planFor })
      .from(accounts)
      .where(eq(accounts.id, accountId))
      .limit(1);
    const ownerName =
      acct?.planFor === 'other' && acct.subjectName?.trim()
        ? acct.subjectName.trim()
        : user?.firstName
          ? `${user.firstName}${user.lastName ? ` ${user.lastName}` : ''}`
          : 'Someone';
    sendLegacyContactInvitation({
      to: newEmail,
      contactName: row.name,
      ownerName,
      activationUrl: `${APP_URL}/activate/${activationToken}`,
    }).then(() => {
      db.update(legacyContacts).set({ inviteEmailedAt: new Date() }).where(eq(legacyContacts.id, row.id)).catch(() => {});
    }).catch(() => {});
  }

  return NextResponse.json({ item: row }, { status: 201 });
}
