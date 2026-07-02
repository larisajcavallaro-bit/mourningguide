import { NextResponse } from 'next/server';
import { db } from '@/db';
import { accounts } from '@/db/schema/accounts';
import { letters } from '@/db/schema/vault';
import { eq } from 'drizzle-orm';
import { authAccount } from '@/lib/account';

export async function GET() {
  const authResult = await authAccount();
  if (!authResult.ok) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }
  const { accountId } = authResult;

  const rows = await db.select().from(letters)
    .where(eq(letters.accountId, accountId))
    .orderBy(letters.createdAt);

  return NextResponse.json({ items: rows });
}

export async function POST(req: Request) {
  const authResult = await authAccount();
  if (!authResult.ok) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }
  const { accountId } = authResult;

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
