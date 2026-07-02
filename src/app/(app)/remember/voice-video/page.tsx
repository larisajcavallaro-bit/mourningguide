import { requirePlanningAccount } from '@/lib/account';
import AppShell from '@/components/AppShell';
import RememberSetupClient, { SETUPS } from '../RememberSetupClient';

export const metadata = { title: 'Voice & video messages — Mourning Guide' };

export default async function RememberVoiceVideoPage() {
  await requirePlanningAccount();
  return (
    <AppShell title="Voice & video" active="remember">
      <RememberSetupClient setup={SETUPS['voice-video']} />
    </AppShell>
  );
}
