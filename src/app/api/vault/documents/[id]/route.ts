import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { db } from '@/db';
import { accounts } from '@/db/schema/accounts';
import { documents } from '@/db/schema/vault';
import { eq, and } from 'drizzle-orm';
import { del } from '@vercel/blob';

async function getAccountId(userId: string) {
  const rows = await db.select({ id: accounts.id })
    .from(accounts).where(eq(accounts.clerkUserId, userId)).limit(1);
  return rows[0]?.id ?? null;
}

// PATCH { category, notes } — update a document's metadata
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const accountId = await getAccountId(userId);
  if (!accountId) return NextResponse.json({ error: 'No account' }, { status: 400 });

  const { id } = await params;
  const { category, notes } = await req.json();

  const [row] = await db.update(documents)
    .set({ category: category?.trim() || null, notes: notes?.trim() || null })
    .where(and(eq(documents.id, id), eq(documents.accountId, accountId)))
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

  const [row] = await db.select().from(documents)
    .where(and(eq(documents.id, id), eq(documents.accountId, accountId))).limit(1);
  if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  try { await del(row.storageKey, { token: process.env.DOCUMENTS_BLOB_READ_WRITE_TOKEN }); } catch { /* already gone */ }
  await db.delete(documents).where(and(eq(documents.id, id), eq(documents.accountId, accountId)));

  return NextResponse.json({ ok: true });
}
