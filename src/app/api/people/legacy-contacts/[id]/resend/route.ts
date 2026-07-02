import { currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { db } from '@/db';
import { accounts } from '@/db/schema/accounts';
import { legacyContacts } from '@/db/schema/people';
import { eq, and } from 'drizzle-orm';
import { authAccount } from '@/lib/account';
import { sendLegacyContactInvitation } from '@/lib/emails';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://mourninguide.com';

// POST — re-send this specific legacy contact's invitation, reusing their
// existing activation token so any previously-sent link keeps working.
export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const authResult = await authAccount();
  if (!authResult.ok) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }
  const { accountId } = authResult;

  const { id } = await params;
  const rows = await db.select().from(legacyContacts)
    .where(and(eq(legacyContacts.id, id), eq(legacyContacts.accountId, accountId))).limit(1);
  const contact = rows[0];

  if (!contact) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if (!contact.email) {
    return NextResponse.json({ error: 'This legacy contact has no email address to send to.' }, { status: 400 });
  }

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

  try {
    await sendLegacyContactInvitation({
      to: contact.email,
      contactName: contact.name,
      ownerName,
      activationUrl: `${APP_URL}/activate/${contact.activationToken}`,
    });
    await db.update(legacyContacts)
      .set({ inviteEmailedAt: new Date() })
      .where(eq(legacyContacts.id, contact.id));
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Could not send the invitation. Please try again.' }, { status: 500 });
  }
}
