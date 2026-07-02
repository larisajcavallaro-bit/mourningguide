import { requirePlanningAccount } from '@/lib/account';
import AppShell from '@/components/AppShell';
import RememberSetupClient from '../RememberSetupClient';
import { SETUPS } from '../rememberSetups';

export const metadata = { title: 'Music for your service — Mourning Guide' };

export default async function RememberMusicPage() {
  await requirePlanningAccount();
  return (
    <AppShell title="Music" active="remember">
      <RememberSetupClient setup={SETUPS.music} />
    </AppShell>
  );
}
