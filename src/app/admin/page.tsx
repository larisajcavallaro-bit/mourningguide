import AdminShell from '@/components/AdminShell';
import { requireAdminStaff, getBusinessMetrics } from '@/lib/admin';

export const metadata = { title: 'Admin — Mourning Guide' };
export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  await requireAdminStaff();
  const metrics = await getBusinessMetrics();

  return (
    <AdminShell active="dashboard">
      <p className="section-label-lg" style={{ marginTop: 0 }}>Business overview</p>
      <div className="metrics-grid">
        <MetricCard label="Total accounts" value={metrics.totalAccounts} />
        <MetricCard label="Planning path" value={metrics.planningAccounts} />
        <MetricCard label="Grief path" value={metrics.griefAccounts} />
        <MetricCard label="Guide Plan (paid)" value={metrics.guidePlans} />
        <MetricCard label="Active trials" value={metrics.activeTrials} />
        <MetricCard label="Lapsed plans" value={metrics.lapsedPlans} />
        <MetricCard label="Death activations" value={metrics.activatedAccounts} />
        <MetricCard label="New (30 days)" value={metrics.newAccountsLast30Days} />
        <MetricCard label="Est. ARR" value={`$${metrics.estimatedArr.toLocaleString()}`} />
        <MetricCard label="Marketing opt-in" value={metrics.marketingOptInCount} />
        <MetricCard label="Pending reviews" value={metrics.pendingReviews} />
        <MetricCard label="Published reviews" value={metrics.publishedReviews} />
      </div>

      <div className="admin-panel">
        <h2>Quick links</h2>
        <div className="admin-toolbar">
          <a className="admin-btn primary" href="/admin/customers">View customers</a>
          <a className="admin-btn" href="/api/admin/customers/export?marketingOnly=1">Export marketing emails (CSV)</a>
          <a className="admin-btn" href="/admin/reviews">Moderate reviews</a>
          <a className="admin-btn" href="/reviews" target="_blank" rel="noreferrer">Public reviews page</a>
        </div>
        <p style={{ margin: 0, fontSize: '0.84rem', color: '#9a7a6a', lineHeight: 1.6 }}>
          ARR is estimated from active Guide Plan subscriptions at $89/year. Grief-path accounts are always free.
          Use the customers page to filter by plan, path, or marketing opt-in before exporting email lists.
        </p>
      </div>
    </AdminShell>
  );
}

function MetricCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="metric-card">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}
