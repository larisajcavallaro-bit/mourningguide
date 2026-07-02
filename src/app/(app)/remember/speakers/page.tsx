import { requirePlanningAccount } from '@/lib/account';
import AppShell from '@/components/AppShell';
import RememberSetupClient from '../RememberSetupClient';
import { SETUPS } from '../rememberSetups';

export const metadata = { title: 'Speakers & readings — Mourning Guide' };

export default async function RememberSpeakersPage() {
  await requirePlanningAccount();
  return (
    <AppShell title="Speakers & readings" active="remember">
      <RememberSetupClient setup={SETUPS.speakers} />
    </AppShell>
  );
}
