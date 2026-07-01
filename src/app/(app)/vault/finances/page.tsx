import { db } from '@/db';
import { financialAccounts } from '@/db/schema/vault';
import { eq } from 'drizzle-orm';
import AppShell from '@/components/AppShell';
import FinancesClient from './FinancesClient';
import { requirePlanningAccount } from '@/lib/account';

export const metadata = { title: 'Finances — Mourning Guide' };

export default async function FinancesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { accountId } = await requirePlanningAccount();
  const { category } = await searchParams;

  const items = await db.select().from(financialAccounts)
    .where(eq(financialAccounts.accountId, accountId))
    .orderBy(financialAccounts.category, financialAccounts.createdAt);

  return (
    <AppShell title="Finances" active="vault">
      <FinancesClient initial={items} initialCategory={category} />
    </AppShell>
  );
}
