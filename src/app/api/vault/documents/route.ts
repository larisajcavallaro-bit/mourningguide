import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { db } from '@/db';
import { accounts } from '@/db/schema/accounts';
import { documents } from '@/db/schema/vault';
import { eq } from 'drizzle-orm';

async function getAccountId(userId: string) {
  const rows = await db.select({ id: accounts.id })
    .from(accounts).where(eq(accounts.clerkUserId, userId)).limit(1);
  return rows[0]?.id ?? null;
}

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const accountId = await getAccountId(userId);
  if (!accountId) return NextResponse.json({ error: 'No account' }, { status: 400 });

  const rows = await db.select().from(documents)
    .where(eq(documents.accountId, accountId))
    .orderBy(documents.createdAt);
  return NextResponse.json({ items: rows });
}

// POST { url, fileName, category, notes } — record a document already
// uploaded (privately) to Vercel Blob
export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const accountId = await getAccountId(userId);
  if (!accountId) return NextResponse.json({ error: 'No account' }, { status: 400 });

  const { url, fileName, category, notes } = await req.json();
  if (!url?.trim() || !fileName?.trim()) {
    return NextResponse.json({ error: 'url and fileName required' }, { status: 400 });
  }

  const [row] = await db.insert(documents).values({
    accountId,
    storageKey: url.trim(),
    fileName: fileName.trim(),
    category: category?.trim() || null,
    notes: notes?.trim() || null,
  }).returning();

  return NextResponse.json({ item: row }, { status: 201 });
}
