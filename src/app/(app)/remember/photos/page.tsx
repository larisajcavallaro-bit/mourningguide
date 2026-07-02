import { requirePlanningAccount } from '@/lib/account';
import AppShell from '@/components/AppShell';
import RememberSetupClient from '../RememberSetupClient';
import { SETUPS } from '../rememberSetups';

export const metadata = { title: 'Photos & memories — Mourning Guide' };

export default async function RememberPhotosPage() {
  await requirePlanningAccount();
  return (
    <AppShell title="Photos & memories" active="remember">
      <RememberSetupClient setup={SETUPS.photos} />
    </AppShell>
  );
}
