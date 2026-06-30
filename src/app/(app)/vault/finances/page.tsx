import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { db } from '@/db';
import { accounts } from '@/db/schema/accounts';
import { financialAccounts } from '@/db/schema/vault';
import { eq } from 'drizzle-orm';
import AppShell from '@/components/AppShell';
import FinancesClient from './FinancesClient';

export const metadata = { title: 'Finances — Mourning Guide' };

export default async function FinancesPage() {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const acctRows = await db.select({ id: accounts.id })
    .from(accounts).where(eq(accounts.clerkUserId, userId)).limit(1);
  const accountId = acctRows[0]?.id;
  if (!accountId) redirect('/onboarding');

  const items = await db.select().from(financialAccounts)
    .where(eq(financialAccounts.accountId, accountId))
    .orderBy(financialAccounts.category, financialAccounts.createdAt);

  return (
    <AppShell title="Finances" back={{ href: '/dashboard', label: 'Your plan' }}>
      <p style={{ color: 'var(--mg-light)', fontSize: '0.88rem', marginBottom: 24, lineHeight: 1.5 }}>
        Add every account, policy, and asset your family will need to find. You control how much detail to include.
      </p>
      <FinancesClient initial={items} />
    </AppShell>
  );
}
