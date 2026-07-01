import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { SignOutButton } from '@clerk/nextjs';
import { getAccount } from '@/lib/account';
import { isAdminEmail } from '@/lib/admin';
import AppShell from '@/components/AppShell';
import DeleteAccountButton from './DeleteAccountButton';
import MarketingOptInToggle from './MarketingOptInToggle';

export const metadata = { title: 'Settings — Mourning Guide' };

export default async function SettingsPage() {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const [account, user] = await Promise.all([getAccount(userId), currentUser()]);
  if (!account) redirect('/onboarding');

  const { accounts: acct, account_billing: billing } = account;
  const email = user?.emailAddresses?.[0]?.emailAddress ?? '—';
  const showAdmin = isAdminEmail(email);

  return (
    <AppShell title="Settings">
      <h1 className="page-heading">Settings</h1>

      <p className="section-label-lg" style={{ marginTop: 0 }}>Account</p>
      <div className="entry-card" style={{ marginBottom: 24 }}>
        <Row label="Name" value={acct.subjectName ?? '—'} />
        <Row label="Email" value={email} />
        <Row label="State" value={acct.usState ?? '—'} />
        <Row label="Path" value={acct.path === 'planning' ? 'Planning ahead' : 'Supporting a loss'} last />
      </div>

      <p className="section-label-lg">Plan</p>
      <div className="entry-card" style={{ marginBottom: 24 }}>
        <Row label="Current plan" value={
          billing?.planTier === 'guide' ? 'Guide Plan ($89/year)' :
          billing?.planTier === 'lapsed' ? 'Lapsed' : 'Free'
        } last={!billing?.trialEndsAt} />
        {billing?.trialEndsAt && (
          <Row label="Trial ends" value={new Date(billing.trialEndsAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} last />
        )}
        {acct.path === 'planning' && billing?.planTier !== 'guide' && (
          <a href="/api/checkout" style={{ display: 'block', marginTop: 14, color: '#c57b57', fontSize: '0.88rem', fontWeight: 600, textDecoration: 'none' }}>
            Upgrade to Guide Plan →
          </a>
        )}
        {billing?.stripeCustomerId && (
          <a href="/api/billing-portal" style={{ display: 'block', marginTop: 8, color: '#594b43', fontSize: '0.88rem', fontWeight: 600, textDecoration: 'none' }}>
            Manage subscription →
          </a>
        )}
      </div>

      <p className="section-label-lg">Communications</p>
      <div className="entry-card" style={{ marginBottom: 24 }}>
        <MarketingOptInToggle initial={acct.marketingOptIn} />
      </div>

      {showAdmin && (
        <>
          <p className="section-label-lg">Staff</p>
          <div className="entry-card" style={{ marginBottom: 24 }}>
            <a href="/admin" className="list-card" style={{ marginTop: 0 }}>
              <strong>Admin dashboard</strong>
              <p>Customers, metrics, reviews, and marketing email exports.</p>
            </a>
          </div>
        </>
      )}

      <p className="section-label-lg">Account actions</p>
      <div className="entry-card">
        <SignOutButton>
          <button style={{ background: 'none', border: 'none', color: '#c57b57', fontSize: '0.88rem', fontWeight: 600, cursor: 'pointer', padding: 0 }}>
            Sign out
          </button>
        </SignOutButton>
        <div style={{ marginTop: 18, paddingTop: 16, borderTop: '1px solid rgba(145,104,82,0.1)' }}>
          <DeleteAccountButton />
        </div>
      </div>
    </AppShell>
  );
}

function Row({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <div className="list-row" style={last ? { borderBottom: 'none', paddingBottom: 0 } : undefined}>
      <span className="list-row-label">{label}</span>
      <span className="list-row-value">{value}</span>
    </div>
  );
}
