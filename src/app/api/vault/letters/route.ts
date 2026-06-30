import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { db } from '@/db';
import { accounts } from '@/db/schema/accounts';
import { letters } from '@/db/schema/vault';
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

  const rows = await db.select().from(letters)
    .where(eq(letters.accountId, accountId))
    .orderBy(letters.createdAt);

  return NextResponse.json({ items: rows });
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const accountId = await getAccountId(userId);
  if (!accountId) return NextResponse.json({ error: 'No account' }, { status: 400 });

  const body = await req.json();
  const { recipientName, recipientEmail, body: letterBody, releaseTiming } = body;

  if (!recipientName?.trim() || !letterBody?.trim()) {
    return NextResponse.json({ error: 'recipientName and body required' }, { status: 400 });
  }

  const [row] = await db.insert(letters).values({
    accountId,
    recipientName: recipientName.trim(),
    recipientEmail: recipientEmail?.trim() || null,
    body: letterBody.trim(),
    releaseTiming: releaseTiming ?? 'immediate',
  }).returning();

  return NextResponse.json({ item: row }, { status: 201 });
}
