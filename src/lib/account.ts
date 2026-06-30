import { db } from '@/db';
import { accounts } from '@/db/schema/accounts';
import { accountBilling } from '@/db/schema/billing';
import { eq } from 'drizzle-orm';

export async function getAccount(clerkUserId: string) {
  const rows = await db
    .select()
    .from(accounts)
    .leftJoin(accountBilling, eq(accountBilling.accountId, accounts.id))
    .where(eq(accounts.clerkUserId, clerkUserId))
    .limit(1);
  return rows[0] ?? null;
}

export type AccountRow = Awaited<ReturnType<typeof getAccount>>;
