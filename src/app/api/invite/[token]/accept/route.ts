import { auth, currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { db } from '@/db';
import { accountCollaborators } from '@/db/schema/collaborators';
import { accountMemberships } from '@/db/schema/memberships';
import { and, eq } from 'drizzle-orm';
import { createAccountMembership, setActiveAccountCookie } from '@/lib/account';

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { token } = await params;
  const [collab] = await db
    .select()
    .from(accountCollaborators)
    .where(eq(accountCollaborators.inviteToken, token))
    .limit(1);

  if (!collab) return NextResponse.json({ error: 'Invalid invitation' }, { status: 404 });
  if (collab.status === 'active') {
    return NextResponse.json({ error: 'Already accepted' }, { status: 400 });
  }

  const user = await currentUser();
  const emails = (user?.emailAddresses ?? [])
    .map((e) => e.emailAddress?.toLowerCase())
    .filter(Boolean) as string[];

  if (!emails.includes(collab.email.toLowerCase())) {
    return NextResponse.json({
      error: `Please sign in as ${collab.email} to accept this invitation.`,
    }, { status: 403 });
  }

  const existingMembership = await db
    .select({ id: accountMemberships.id })
    .from(accountMemberships)
    .where(
      and(
        eq(accountMemberships.accountId, collab.accountId),
        eq(accountMemberships.clerkUserId, userId),
      ),
    )
    .limit(1);

  if (!existingMembership.length) {
    await createAccountMembership(userId, collab.accountId, 'admin');
  }

  await db.update(accountCollaborators)
    .set({
      status: 'active',
      clerkUserId: userId,
      acceptedAt: new Date(),
    })
    .where(eq(accountCollaborators.id, collab.id));

  await setActiveAccountCookie(collab.accountId);

  return NextResponse.json({ success: true, accountId: collab.accountId });
}
