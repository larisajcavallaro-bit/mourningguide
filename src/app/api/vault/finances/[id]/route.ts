import { NextResponse } from 'next/server';
import { db } from '@/db';
import { accounts } from '@/db/schema/accounts';
import { financialAccounts } from '@/db/schema/vault';
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
  const { category, institutionName, accountType, lastFour, whoToCall, purposeNotes, paperworkLocation, notes, details } = body;

  const [row] = await db.update(financialAccounts).set({
    category,
    institutionName: institutionName?.trim(),
    accountType: accountType?.trim() || null,
    lastFour: lastFour?.replace(/\D/g, '').slice(-4) || null,
    whoToCall: whoToCall?.trim() || null,
    purposeNotes: purposeNotes?.trim() || null,
    paperworkLocation: paperworkLocation?.trim() || null,
    details: details && typeof details === 'object' ? details : null,
    notes: notes?.trim() || null,
    updatedAt: new Date(),
  })
  .where(and(eq(financialAccounts.id, id), eq(financialAccounts.accountId, accountId)))
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
  await db.delete(financialAccounts)
    .where(and(eq(financialAccounts.id, id), eq(financialAccounts.accountId, accountId)));

  return NextResponse.json({ ok: true });
}
