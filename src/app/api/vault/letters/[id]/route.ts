import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { db } from '@/db';
import { accounts } from '@/db/schema/accounts';
import { letters } from '@/db/schema/vault';
import { eq, and } from 'drizzle-orm';

async function getAccountId(userId: string) {
  const rows = await db.select({ id: accounts.id })
    .from(accounts).where(eq(accounts.clerkUserId, userId)).limit(1);
  return rows[0]?.id ?? null;
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const accountId = await getAccountId(userId);
  if (!accountId) return NextResponse.json({ error: 'No account' }, { status: 400 });

  const { id } = await params;
  const body = await req.json();

  const [row] = await db.update(letters).set({
    recipientName: body.recipientName?.trim(),
    recipientEmail: body.recipientEmail?.trim() || null,
    body: body.body?.trim(),
    releaseTiming: body.releaseTiming ?? 'immediate',
  })
  .where(and(eq(letters.id, id), eq(letters.accountId, accountId)))
  .returning();

  if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ item: row });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const accountId = await getAccountId(userId);
  if (!accountId) return NextResponse.json({ error: 'No account' }, { status: 400 });

  const { id } = await params;
  await db.delete(letters)
    .where(and(eq(letters.id, id), eq(letters.accountId, accountId)));

  return NextResponse.json({ ok: true });
}
