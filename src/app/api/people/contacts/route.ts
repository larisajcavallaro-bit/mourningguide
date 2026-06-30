import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { db } from '@/db';
import { accounts } from '@/db/schema/accounts';
import { notificationContacts } from '@/db/schema/people';
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

  const rows = await db.select().from(notificationContacts)
    .where(eq(notificationContacts.accountId, accountId))
    .orderBy(notificationContacts.createdAt);
  return NextResponse.json({ items: rows });
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const accountId = await getAccountId(userId);
  if (!accountId) return NextResponse.json({ error: 'No account' }, { status: 400 });

  const body = await req.json();
  const { name, email, phone, relationship, notifyPhase } = body;
  if (!name?.trim()) return NextResponse.json({ error: 'name required' }, { status: 400 });

  const [row] = await db.insert(notificationContacts).values({
    accountId,
    name: name.trim(),
    email: email?.trim() || null,
    phone: phone?.trim() || null,
    relationship: relationship?.trim() || null,
    notifyPhase: notifyPhase ?? 'manual',
  }).returning();

  return NextResponse.json({ item: row }, { status: 201 });
}
