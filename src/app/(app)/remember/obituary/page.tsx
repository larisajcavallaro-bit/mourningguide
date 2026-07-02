import { requirePlanningAccount } from '@/lib/account';
import AppShell from '@/components/AppShell';
import RememberSetupClient, { SETUPS } from '../RememberSetupClient';

export const metadata = { title: 'Obituary & eulogy — Mourning Guide' };

export default async function RememberObituaryPage() {
  await requirePlanningAccount();
  return (
    <AppShell title="Obituary & eulogy" active="remember">
      <RememberSetupClient setup={SETUPS.obituary} />
    </AppShell>
  );
}
