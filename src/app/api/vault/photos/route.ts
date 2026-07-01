import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { db } from '@/db';
import { accounts } from '@/db/schema/accounts';
import { photos } from '@/db/schema/vault';
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

  const rows = await db.select().from(photos)
    .where(eq(photos.accountId, accountId))
    .orderBy(photos.createdAt);
  return NextResponse.json({ items: rows });
}

// POST { url, caption } — record a photo already uploaded to Vercel Blob
export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const accountId = await getAccountId(userId);
  if (!accountId) return NextResponse.json({ error: 'No account' }, { status: 400 });

  const { url, caption } = await req.json();
  if (!url?.trim()) return NextResponse.json({ error: 'url required' }, { status: 400 });

  const [row] = await db.insert(photos).values({
    accountId,
    storageKey: url.trim(),          // full Vercel Blob URL
    caption: caption?.trim() || null,
    forService: true,                // shown on the memorial page
    uploadedBy: 'planner',
  }).returning();

  return NextResponse.json({ item: row }, { status: 201 });
}
