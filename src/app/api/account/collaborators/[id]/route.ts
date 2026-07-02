import { NextResponse } from 'next/server';
import { db } from '@/db';
import { accountCollaborators } from '@/db/schema/collaborators';
import { accountMemberships } from '@/db/schema/memberships';
import { and, eq } from 'drizzle-orm';
import { authAccountOwner } from '@/lib/account';

export async function DELETE(
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

  if (collab.clerkUserId) {
    await db.delete(accountMemberships).where(
      and(
        eq(accountMemberships.accountId, authResult.accountId),
        eq(accountMemberships.clerkUserId, collab.clerkUserId),
        eq(accountMemberships.role, 'admin'),
      ),
    );
  }

  await db.delete(accountCollaborators).where(eq(accountCollaborators.id, id));
  return NextResponse.json({ ok: true });
}
