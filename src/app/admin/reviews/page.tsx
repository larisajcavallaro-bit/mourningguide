import AdminShell from '@/components/AdminShell';
import { requireAdminStaff, getReviews } from '@/lib/admin';
import ReviewsClient from './ReviewsClient';

export const metadata = { title: 'Reviews — Admin' };
export const dynamic = 'force-dynamic';

export default async function AdminReviewsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  await requireAdminStaff();
  const params = await searchParams;
  const status = (params.status === 'pending' || params.status === 'published' || params.status === 'rejected')
    ? params.status
    : 'all';

  const reviews = await getReviews(status);

  return (
    <AdminShell active="reviews" title="Reviews">
      <ReviewsClient reviews={reviews} statusFilter={status} />
    </AdminShell>
  );
}
