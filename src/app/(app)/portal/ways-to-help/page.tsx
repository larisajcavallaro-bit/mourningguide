import { requirePlanningAccount } from '@/lib/account';
import AppShell from '@/components/AppShell';
import { WaysToHelpClient } from '../PortalOptionClients';

export const metadata = { title: 'Ways to help — Mourning Guide' };

export default async function PortalWaysToHelpPage() {
  await requirePlanningAccount();
  return (
    <AppShell title="Portal" active="portal">
      <WaysToHelpClient />
    </AppShell>
  );
}
