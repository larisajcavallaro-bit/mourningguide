import { requirePlanningAccount } from '@/lib/account';
import AppShell from '@/components/AppShell';
import PortalClient from './PortalClient';

export const metadata = { title: 'Your portal — Mourning Guide' };

export default async function PortalPage() {
  await requirePlanningAccount();
  return (
    <AppShell title="Portal" active="portal">
      <PortalClient />
    </AppShell>
  );
}
