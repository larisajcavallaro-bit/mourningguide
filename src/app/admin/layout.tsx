import { requireAdminStaff } from '@/lib/admin';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdminStaff();
  return children;
}
