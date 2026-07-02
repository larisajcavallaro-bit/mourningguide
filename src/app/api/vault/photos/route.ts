import { NextResponse } from 'next/server';
import { db } from '@/db';
import { accounts } from '@/db/schema/accounts';
import { photos } from '@/db/schema/vault';
import { eq } from 'drizzle-orm';
import { authAccount } from '@/lib/account';

export async function GET() {
  const authResult = await authAccount();
  if (!authResult.ok) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }
  const { accountId } = authResult;

  const rows = await db.select().from(photos)
    .where(eq(photos.accountId, accountId))
    .orderBy(photos.createdAt);
  return NextResponse.json({ items: rows });
}

// POST { url, caption } — record a photo already uploaded to Vercel Blob
export async function POST(req: Request) {
  const authResult = await authAccount();
  if (!authResult.ok) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }
  const { accountId } = authResult;

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
