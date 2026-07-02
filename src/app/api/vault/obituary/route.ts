import { NextResponse } from 'next/server';
import { db } from '@/db';
import { accounts } from '@/db/schema/accounts';
import { obituary } from '@/db/schema/vault';
import { eq } from 'drizzle-orm';
import { authAccount } from '@/lib/account';

export async function GET() {
  const authResult = await authAccount();
  if (!authResult.ok) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }
  const { accountId } = authResult;

  const rows = await db.select().from(obituary)
    .where(eq(obituary.accountId, accountId)).limit(1);
  return NextResponse.json({ item: rows[0] ?? null });
}

export async function POST(req: Request) {
  const authResult = await authAccount();
  if (!authResult.ok) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }
  const { accountId } = authResult;

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
