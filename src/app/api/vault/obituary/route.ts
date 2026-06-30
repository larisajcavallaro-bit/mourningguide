import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { db } from '@/db';
import { accounts } from '@/db/schema/accounts';
import { obituary } from '@/db/schema/vault';
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

  const rows = await db.select().from(obituary)
    .where(eq(obituary.accountId, accountId)).limit(1);
  return NextResponse.json({ item: rows[0] ?? null });
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const accountId = await getAccountId(userId);
  if (!accountId) return NextResponse.json({ error: 'No account' }, { status: 400 });

  const body = await req.json();
  const existing = await db.select({ id: obituary.id })
    .from(obituary).where(eq(obituary.accountId, accountId)).limit(1);

  const values = {
    name: body.name?.trim() || null,
    born: body.born?.trim() || null,
    died: body.died?.trim() || null,
    city: body.city?.trim() || null,
    survived: body.survived?.trim() || null,
    predeceased: body.predeceased?.trim() || null,
    body: body.body?.trim() || null,
    updatedAt: new Date(),
  };

  let row;
  if (existing.length) {
    [row] = await db.update(obituary).set(values)
      .where(eq(obituary.accountId, accountId)).returning();
  } else {
    [row] = await db.insert(obituary).values({ accountId, ...values }).returning();
  }

  return NextResponse.json({ item: row });
}
