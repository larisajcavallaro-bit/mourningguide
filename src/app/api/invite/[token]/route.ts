import { NextResponse } from 'next/server';
import { db } from '@/db';
import { accounts } from '@/db/schema/accounts';
import { accountCollaborators } from '@/db/schema/collaborators';
import { eq } from 'drizzle-orm';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;

  const rows = await db
    .select({
      inviteeName: accountCollaborators.name,
      inviteeEmail: accountCollaborators.email,
      status: accountCollaborators.status,
      subjectName: accounts.subjectName,
    })
    .from(accountCollaborators)
    .innerJoin(accounts, eq(accounts.id, accountCollaborators.accountId))
    .where(eq(accountCollaborators.inviteToken, token))
    .limit(1);

  const row = rows[0];
  if (!row) return NextResponse.json({ error: 'Invalid invitation' }, { status: 404 });
  if (row.status === 'active') {
    return NextResponse.json({ error: 'This invitation has already been accepted.' }, { status: 400 });
  }

  return NextResponse.json({
    inviteeName: row.inviteeName,
    inviteeEmail: row.inviteeEmail,
    subjectName: row.subjectName,
  });
}
