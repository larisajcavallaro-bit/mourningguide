import { currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { db } from '@/db';
import { accounts } from '@/db/schema/accounts';
import { accountCollaborators } from '@/db/schema/collaborators';
import { eq } from 'drizzle-orm';
import { authAccountOwner } from '@/lib/account';
import { sendCollaboratorInvitation } from '@/lib/emails';
import { randomBytes } from 'crypto';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://mourninguide.com';
const MAX_COLLABORATORS = 3;

export async function GET() {
  const authResult = await authAccountOwner();
  if (!authResult.ok) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  const rows = await db
    .select()
    .from(accountCollaborators)
    .where(eq(accountCollaborators.accountId, authResult.accountId))
    .orderBy(accountCollaborators.createdAt);

  return NextResponse.json({ items: rows });
}

export async function POST(req: Request) {
  const authResult = await authAccountOwner();
  if (!authResult.ok) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }
  const { accountId, userId } = authResult;

  const [acct] = await db
    .select({ planFor: accounts.planFor, subjectName: accounts.subjectName })
    .from(accounts)
    .where(eq(accounts.id, accountId))
    .limit(1);

  if (!acct || acct.planFor !== 'other') {
    return NextResponse.json({
      error: 'You can only invite relatives to help on a plan you manage for a parent or loved one.',
    }, { status: 400 });
  }

  const existing = await db
    .select({ id: accountCollaborators.id })
    .from(accountCollaborators)
    .where(eq(accountCollaborators.accountId, accountId));

  if (existing.length >= MAX_COLLABORATORS) {
    return NextResponse.json({
      error: `You can invite up to ${MAX_COLLABORATORS} relatives to help manage this plan.`,
    }, { status: 400 });
  }

  const body = await req.json();
  const { name, email } = body as { name?: string; email?: string };
  if (!name?.trim()) return NextResponse.json({ error: 'Name is required' }, { status: 400 });
  if (!email?.trim() || !email.includes('@')) {
    return NextResponse.json({ error: 'A valid email is required' }, { status: 400 });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const user = await currentUser();
  const inviterEmail = user?.emailAddresses?.[0]?.emailAddress?.toLowerCase();
  if (inviterEmail && inviterEmail === normalizedEmail) {
    return NextResponse.json({ error: 'Invite a relative — use your own login for your personal plan.' }, { status: 400 });
  }

  const inviteToken = randomBytes(32).toString('hex');

  let row;
  try {
    [row] = await db.insert(accountCollaborators).values({
      accountId,
      name: name.trim(),
      email: normalizedEmail,
      inviteToken,
      invitedByClerkUserId: userId,
    }).returning();
  } catch {
    return NextResponse.json({ error: 'This person has already been invited to this plan.' }, { status: 400 });
  }

  const inviterName = user?.firstName
    ? `${user.firstName}${user.lastName ? ` ${user.lastName}` : ''}`
    : 'A family member';
  const subjectName = acct.subjectName?.trim() || 'your loved one';

  sendCollaboratorInvitation({
    to: normalizedEmail,
    inviteeName: row.name,
    subjectName,
    inviterName,
    acceptUrl: `${APP_URL}/invite/${inviteToken}`,
  }).then(() => {
    db.update(accountCollaborators)
      .set({ inviteEmailedAt: new Date() })
      .where(eq(accountCollaborators.id, row.id))
      .catch(() => {});
  }).catch(() => {});

  return NextResponse.json({ item: row }, { status: 201 });
}
