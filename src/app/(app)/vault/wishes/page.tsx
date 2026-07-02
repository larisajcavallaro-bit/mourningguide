import { db } from '@/db';
import { serviceDetails } from '@/db/schema/vault';
import { eq } from 'drizzle-orm';
import { requirePlanningAccount } from '@/lib/account';
import AppShell from '@/components/AppShell';
import WishesClient from './WishesClient';

export const metadata = { title: 'Final wishes — Mourning Guide' };

export default async function WishesPage() {
  const { accountId } = await requirePlanningAccount();

  const [item] = await db.select().from(serviceDetails)
    .where(eq(serviceDetails.accountId, accountId))
    .limit(1);

  return (
    <AppShell title="Final wishes" active="vault">
      <WishesClient initial={item ?? null} />
    </AppShell>
  );
}
