import { requirePlanningAccount } from '@/lib/account';
import AppShell from '@/components/AppShell';
import WishesClient from './WishesClient';

export const metadata = { title: 'Final wishes — Mourning Guide' };

export default async function WishesPage() {
  await requirePlanningAccount();
  return (
    <AppShell title="Final wishes" active="vault">
      <WishesClient />
    </AppShell>
  );
}
