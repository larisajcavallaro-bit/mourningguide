import { db } from '@/db';
import { accounts } from '@/db/schema/accounts';
import { accountBilling } from '@/db/schema/billing';
import { eq } from 'drizzle-orm';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

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

/**
 * Guard for planning-only pages. Ensures the signed-in user has a planning
 * account; grief-path users are sent back to their dashboard. Returns the
 * account id for the caller to use.
 */
export async function requirePlanningAccount(): Promise<{ accountId: string }> {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const rows = await db.select({ id: accounts.id, path: accounts.path })
    .from(accounts).where(eq(accounts.clerkUserId, userId!)).limit(1);
  const account = rows[0];
  if (!account) redirect('/onboarding');
  if (account.path !== 'planning') redirect('/dashboard');

  return { accountId: account.id };
}
