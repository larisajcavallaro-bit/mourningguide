import { currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { db } from '@/db';
import { accounts } from '@/db/schema/accounts';
import { eq } from 'drizzle-orm';
import { authAccount } from '@/lib/account';
import { sendDeletionRequest } from '@/lib/emails';
import { resend } from '@/lib/resend';

// POST — record a self-service account deletion request. Confirms to the user
// and notifies support to process within 48 hours. Actual deletion is handled
// by support (or the Clerk user.deleted webhook if they delete via Clerk).
export async function POST() {
  const authResult = await authAccount();
  if (!authResult.ok) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }
  const { accountId, userId } = authResult;

  const rows = await db.select({ id: accounts.id, subjectName: accounts.subjectName })
    .from(accounts).where(eq(accounts.id, accountId)).limit(1);
  if (!rows[0]) return NextResponse.json({ error: 'No account' }, { status: 400 });

  await db.update(accounts)
    .set({ deletionRequestedAt: new Date(), updatedAt: new Date() })
    .where(eq(accounts.id, rows[0].id));

  const user = await currentUser();
  const email = user?.emailAddresses?.[0]?.emailAddress;
  const firstName = user?.firstName ?? rows[0].subjectName?.split(' ')[0] ?? 'there';

  if (email) {
    sendDeletionRequest({ to: email, firstName }).catch(() => {});
  }

  resend.emails.send({
    from: 'Mourning Guide <support@mourninguide.com>',
    to: 'support@mourninguide.com',
    subject: `Account deletion request — ${email ?? userId}`,
    html: `<p>Deletion requested.</p><p>User: ${email ?? '(no email)'}<br>Clerk ID: ${userId}<br>Account: ${rows[0].id}</p><p>Process within 48 hours.</p>`,
  }).catch(() => {});

  return NextResponse.json({ success: true });
}
