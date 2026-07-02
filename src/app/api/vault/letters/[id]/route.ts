import { NextResponse } from 'next/server';
import { db } from '@/db';
import { accounts } from '@/db/schema/accounts';
import { letters } from '@/db/schema/vault';
import { eq, and } from 'drizzle-orm';
import { authAccount } from '@/lib/account';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const authResult = await authAccount();
  if (!authResult.ok) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }
  const { accountId } = authResult;

  const { id } = await params;
  const body = await req.json();
  const normalizedTiming = body.releaseTiming === 'date'
    ? 'date'
    : body.releaseTiming === 'delayed'
      ? 'delayed'
      : 'immediate';
  const normalizedScheduledAt = normalizedTiming === 'date' && body.scheduledReleaseAt
    ? new Date(body.scheduledReleaseAt)
    : null;

  const [row] = await db.update(letters).set({
    recipientName: body.recipientName?.trim(),
    recipientEmail: body.recipientEmail?.trim() || null,
    subject: body.subject?.trim() || null,
    body: body.body?.trim(),
    releaseTiming: normalizedTiming,
    scheduledReleaseAt: normalizedScheduledAt,
  })
  .where(and(eq(letters.id, id), eq(letters.accountId, accountId)))
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
  await db.delete(letters)
    .where(and(eq(letters.id, id), eq(letters.accountId, accountId)));

  return NextResponse.json({ ok: true });
}
