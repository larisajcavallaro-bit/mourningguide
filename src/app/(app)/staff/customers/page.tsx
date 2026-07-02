import AdminShell from '@/components/AdminShell';
import { requireAdminStaff, getCustomers } from '@/lib/admin';
import CustomersClient from './CustomersClient';

export const metadata = { title: 'Customers — Admin' };
export const dynamic = 'force-dynamic';

export default async function AdminCustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ path?: string; plan?: string; marketing?: string }>;
}) {
  await requireAdminStaff();
  const params = await searchParams;

  const path = (params.path === 'planning' || params.path === 'grief') ? params.path : 'all';
  const plan = (params.plan === 'free' || params.plan === 'guide' || params.plan === 'lapsed') ? params.plan : 'all';
  const marketingOnly = params.marketing === '1';

  const customers = await getCustomers({
    path: path === 'all' ? 'all' : path,
    planTier: plan === 'all' ? 'all' : plan,
    marketingOnly,
  });

  return (
    <AdminShell active="customers" title="Customers">
      <CustomersClient
        customers={customers}
        filters={{ path, plan, marketingOnly }}
      />
    </AdminShell>
  );
}
