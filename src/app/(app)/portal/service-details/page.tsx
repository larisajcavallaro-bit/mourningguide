import { db } from '@/db';
import { serviceDetails } from '@/db/schema/vault';
import { eq } from 'drizzle-orm';
import { requirePlanningAccount } from '@/lib/account';
import AppShell from '@/components/AppShell';
import { ServiceDetailsClient } from '../PortalOptionClients';

export const metadata = { title: 'Service & gifts — Mourning Guide' };

export default async function PortalServiceDetailsPage() {
  const { accountId } = await requirePlanningAccount();
  const [item] = await db.select().from(serviceDetails)
    .where(eq(serviceDetails.accountId, accountId))
    .limit(1);

  return (
    <AppShell title="Portal" active="portal">
      <ServiceDetailsClient initial={item ?? null} />
    </AppShell>
  );
}
