import { currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { db } from '@/db';
import { accounts } from '@/db/schema/accounts';
import { legacyContacts } from '@/db/schema/people';
import { eq, and } from 'drizzle-orm';
import { authAccount } from '@/lib/account';
import { sendLegacyContactInvitation } from '@/lib/emails';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://mourninguide.com';

// PUT — edit a legacy contact. Re-sends the invitation only if the email is
// new or has changed (the activation token is preserved either way, so any
// previously-sent link keeps working).
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const authResult = await authAccount();
  if (!authResult.ok) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }
  const { accountId } = authResult;

  const { id } = await params;
  const { name, email, phone } = await req.json();
  if (!name?.trim()) return NextResponse.json({ error: 'name required' }, { status: 400 });

  const existingRows = await db.select().from(legacyContacts)
    .where(and(eq(legacyContacts.id, id), eq(legacyContacts.accountId, accountId))).limit(1);
  const prev = existingRows[0];
  if (!prev) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const newEmail = email?.trim() || null;
  const emailChanged = newEmail !== (prev.email ?? null);

  const [row] = await db.update(legacyContacts).set({
    name: name.trim(),
    email: newEmail,
    phone: phone?.trim() || null,
    inviteEmailedAt: emailChanged ? null : prev.inviteEmailedAt,
  }).where(eq(legacyContacts.id, id)).returning();

  if (newEmail && emailChanged) {
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
      activationUrl: `${APP_URL}/activate/${row.activationToken}`,
    }).then(() => {
      db.update(legacyContacts).set({ inviteEmailedAt: new Date() }).where(eq(legacyContacts.id, row.id)).catch(() => {});
    }).catch(() => {});
  }

  return NextResponse.json({ item: row });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const authResult = await authAccount();
  if (!authResult.ok) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }
  const { accountId } = authResult;

  const { id } = await params;
  await db.delete(legacyContacts)
    .where(and(eq(legacyContacts.id, id), eq(legacyContacts.accountId, accountId)));
  return NextResponse.json({ ok: true });
}
