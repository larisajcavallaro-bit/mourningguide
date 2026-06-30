import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { db } from '@/db';
import { accounts } from '@/db/schema/accounts';
import { financialAccounts } from '@/db/schema/vault';
import { eq, and } from 'drizzle-orm';

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

  const rows = await db.select().from(financialAccounts)
    .where(eq(financialAccounts.accountId, accountId))
    .orderBy(financialAccounts.category, financialAccounts.createdAt);

  return NextResponse.json({ items: rows });
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const accountId = await getAccountId(userId);
  if (!accountId) return NextResponse.json({ error: 'No account' }, { status: 400 });

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
