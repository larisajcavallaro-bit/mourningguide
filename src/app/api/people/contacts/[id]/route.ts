import { NextResponse } from 'next/server';
import { db } from '@/db';
import { accounts } from '@/db/schema/accounts';
import { notificationContacts } from '@/db/schema/people';
import { eq, and } from 'drizzle-orm';
import { authAccount } from '@/lib/account';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const authResult = await authAccount();
  if (!authResult.ok) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }
  const { accountId } = authResult;

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
  const authResult = await authAccount();
  if (!authResult.ok) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }
  const { accountId } = authResult;

  const { id } = await params;
  await db.delete(notificationContacts)
    .where(and(eq(notificationContacts.id, id), eq(notificationContacts.accountId, accountId)));
  return NextResponse.json({ ok: true });
}
