import { NextResponse } from 'next/server';
import { db } from '@/db';
import { accounts } from '@/db/schema/accounts';
import { accountCollaborators } from '@/db/schema/collaborators';
import { and, eq } from 'drizzle-orm';
import { authAccountOwner } from '@/lib/account';
import { sendCollaboratorInvitation } from '@/lib/emails';
import { clerkClient } from '@clerk/nextjs/server';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://mourninguide.com';

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const authResult = await authAccountOwner();
  if (!authResult.ok) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  const { id } = await params;
  const [collab] = await db
    .select()
    .from(accountCollaborators)
    .where(
      and(
        eq(accountCollaborators.id, id),
        eq(accountCollaborators.accountId, authResult.accountId),
      ),
    )
    .limit(1);

  if (!collab) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if (collab.status === 'active') {
    return NextResponse.json({ error: 'This person has already accepted.' }, { status: 400 });
  }

  const [acct] = await db
    .select({ subjectName: accounts.subjectName })
    .from(accounts)
    .where(eq(accounts.id, authResult.accountId))
    .limit(1);

  const clerk = await clerkClient();
  const inviter = await clerk.users.getUser(authResult.userId);
  const inviterName = inviter.firstName
    ? `${inviter.firstName}${inviter.lastName ? ` ${inviter.lastName}` : ''}`
    : 'A family member';

  try {
    await sendCollaboratorInvitation({
      to: collab.email,
      inviteeName: collab.name,
      subjectName: acct?.subjectName?.trim() || 'your loved one',
      inviterName,
      acceptUrl: `${APP_URL}/invite/${collab.inviteToken}`,
    });
    await db.update(accountCollaborators)
      .set({ inviteEmailedAt: new Date() })
      .where(eq(accountCollaborators.id, collab.id));
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Could not send the invitation.' }, { status: 500 });
  }
}
