import { NextResponse } from 'next/server';
import { db } from '@/db';
import { accounts } from '@/db/schema/accounts';
import { notificationContacts } from '@/db/schema/people';
import { eq } from 'drizzle-orm';
import { authAccount } from '@/lib/account';

export async function GET() {
  const authResult = await authAccount();
  if (!authResult.ok) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }
  const { accountId } = authResult;

  const rows = await db.select().from(notificationContacts)
    .where(eq(notificationContacts.accountId, accountId))
    .orderBy(notificationContacts.createdAt);
  return NextResponse.json({ items: rows });
}

export async function POST(req: Request) {
  const authResult = await authAccount();
  if (!authResult.ok) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }
  const { accountId } = authResult;

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
