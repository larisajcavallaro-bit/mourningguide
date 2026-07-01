import { requirePlanningAccount } from '@/lib/account';
import AppShell from '@/components/AppShell';
import { GallerySettingsClient } from '../PortalOptionClients';

export const metadata = { title: 'Photo gallery — Mourning Guide' };

export default async function PortalGalleryPage() {
  await requirePlanningAccount();
  return (
    <AppShell title="Portal" active="portal">
      <GallerySettingsClient />
    </AppShell>
  );
}
