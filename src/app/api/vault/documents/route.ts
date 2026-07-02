import { NextResponse } from 'next/server';
import { db } from '@/db';
import { accounts } from '@/db/schema/accounts';
import { documents } from '@/db/schema/vault';
import { eq } from 'drizzle-orm';
import { authAccount } from '@/lib/account';

export async function GET() {
  const authResult = await authAccount();
  if (!authResult.ok) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }
  const { accountId } = authResult;

  const rows = await db.select().from(documents)
    .where(eq(documents.accountId, accountId))
    .orderBy(documents.createdAt);
  return NextResponse.json({ items: rows });
}

// POST { url, fileName, category, notes } — record a document already
// uploaded (privately) to Vercel Blob
export async function POST(req: Request) {
  const authResult = await authAccount();
  if (!authResult.ok) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }
  const { accountId } = authResult;

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
