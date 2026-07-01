import { requirePlanningAccount } from '@/lib/account';
import AppShell from '@/components/AppShell';
import { ServiceDetailsClient } from '../PortalOptionClients';

export const metadata = { title: 'Service & gifts — Mourning Guide' };

export default async function PortalServiceDetailsPage() {
  await requirePlanningAccount();
  return (
    <AppShell title="Portal" active="portal">
      <ServiceDetailsClient />
    </AppShell>
  );
}
