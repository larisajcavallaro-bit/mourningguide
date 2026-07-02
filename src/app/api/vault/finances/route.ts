import { NextResponse } from 'next/server';
import { db } from '@/db';
import { financialAccounts } from '@/db/schema/vault';
import { eq } from 'drizzle-orm';
import { authAccount } from '@/lib/account';

export async function GET() {
  const authResult = await authAccount();
  if (!authResult.ok) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }
  const { accountId } = authResult;

  const rows = await db.select().from(financialAccounts)
    .where(eq(financialAccounts.accountId, accountId))
    .orderBy(financialAccounts.category, financialAccounts.createdAt);

  return NextResponse.json({ items: rows });
}

export async function POST(req: Request) {
  const authResult = await authAccount();
  if (!authResult.ok) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }
  const { accountId } = authResult;

  const body = await req.json();
  const { category, institutionName, accountType, lastFour, whoToCall, purposeNotes, paperworkLocation, notes } = body;

  if (!category || !institutionName?.trim()) {
    return NextResponse.json({ error: 'category and institutionName required' }, { status: 400 });
  }

  const [row] = await db.insert(financialAccounts).values({
    accountId,
    category,
    institutionName: institutionName.trim(),
    accountType: accountType?.trim() || null,
    lastFour: lastFour?.replace(/\D/g, '').slice(-4) || null,
    whoToCall: whoToCall?.trim() || null,
    purposeNotes: purposeNotes?.trim() || null,
    paperworkLocation: paperworkLocation?.trim() || null,
    notes: notes?.trim() || null,
  }).returning();

  return NextResponse.json({ item: row }, { status: 201 });
}
