import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { db } from '@/db';
import { accounts } from '@/db/schema/accounts';
import { serviceDetails } from '@/db/schema/vault';
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

  const rows = await db.select().from(serviceDetails)
    .where(eq(serviceDetails.accountId, accountId)).limit(1);
  return NextResponse.json({ item: rows[0] ?? null });
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const accountId = await getAccountId(userId);
  if (!accountId) return NextResponse.json({ error: 'No account' }, { status: 400 });

  const body = await req.json();
  const existing = await db.select({ id: serviceDetails.id })
    .from(serviceDetails).where(eq(serviceDetails.accountId, accountId)).limit(1);

  const values = {
    type: body.type?.trim() || null,
    date: body.date?.trim() || null,
    time: body.time?.trim() || null,
    venue: body.venue?.trim() || null,
    address: body.address?.trim() || null,
    parking: body.parking?.trim() || null,
    dresscode: body.dresscode?.trim() || null,
    officiant: body.officiant?.trim() || null,
    reception: body.reception ?? false,
    receptionVenue: body.receptionVenue?.trim() || null,
    receptionAddress: body.receptionAddress?.trim() || null,
    receptionTime: body.receptionTime?.trim() || null,
    livestreamUrl: body.livestreamUrl?.trim() || null,
    notes: body.notes?.trim() || null,
    updatedAt: new Date(),
  };

  let row;
  if (existing.length) {
    [row] = await db.update(serviceDetails).set(values)
      .where(eq(serviceDetails.accountId, accountId)).returning();
  } else {
    [row] = await db.insert(serviceDetails).values({ accountId, ...values }).returning();
  }

  return NextResponse.json({ item: row });
}
