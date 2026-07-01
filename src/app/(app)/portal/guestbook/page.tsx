import { requirePlanningAccount } from '@/lib/account';
import AppShell from '@/components/AppShell';
import { GuestbookSettingsClient } from '../PortalOptionClients';

export const metadata = { title: 'Guestbook — Mourning Guide' };

export default async function PortalGuestbookPage() {
  await requirePlanningAccount();
  return (
    <AppShell title="Portal" active="portal">
      <GuestbookSettingsClient />
    </AppShell>
  );
}
