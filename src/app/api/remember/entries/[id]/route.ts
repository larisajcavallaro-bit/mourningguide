import { NextResponse } from 'next/server';
import { db } from '@/db';
import { rememberEntries } from '@/db/schema/vault';
import { eq, and } from 'drizzle-orm';
import { authAccount } from '@/lib/account';
import { del } from '@vercel/blob';

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const authResult = await authAccount();
  if (!authResult.ok) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  const { id } = await params;
  const [row] = await db.select().from(rememberEntries)
    .where(and(eq(rememberEntries.id, id), eq(rememberEntries.accountId, authResult.accountId)))
    .limit(1);

  if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  if (row.storageKey) {
    await del(row.storageKey).catch(() => {});
  }

  await db.delete(rememberEntries)
    .where(and(eq(rememberEntries.id, id), eq(rememberEntries.accountId, authResult.accountId)));

  return NextResponse.json({ ok: true });
}
