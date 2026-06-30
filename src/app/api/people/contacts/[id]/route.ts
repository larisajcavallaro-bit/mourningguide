import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { db } from '@/db';
import { accounts } from '@/db/schema/accounts';
import { notificationContacts } from '@/db/schema/people';
import { eq, and } from 'drizzle-orm';

async function getAccountId(userId: string) {
  const rows = await db.select({ id: accounts.id })
    .from(accounts).where(eq(accounts.clerkUserId, userId)).limit(1);
  return rows[0]?.id ?? null;
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const accountId = await getAccountId(userId);
  if (!accountId) return NextResponse.json({ error: 'No account' }, { status: 400 });

  const { id } = await params;
  const { name, email, phone, relationship, notifyPhase } = await req.json();
  if (!name?.trim()) return NextResponse.json({ error: 'name required' }, { status: 400 });

  const [row] = await db.update(notificationContacts).set({
    name: name.trim(),
    email: email?.trim() || null,
    phone: phone?.trim() || null,
    relationship: relationship?.trim() || null,
    notifyPhase: notifyPhase ?? 'manual',
  })
  .where(and(eq(notificationContacts.id, id), eq(notificationContacts.accountId, accountId)))
  .returning();

  if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ item: row });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const accountId = await getAccountId(userId);
  if (!accountId) return NextResponse.json({ error: 'No account' }, { status: 400 });

  const { id } = await params;
  await db.delete(notificationContacts)
    .where(and(eq(notificationContacts.id, id), eq(notificationContacts.accountId, accountId)));
  return NextResponse.json({ ok: true });
}
