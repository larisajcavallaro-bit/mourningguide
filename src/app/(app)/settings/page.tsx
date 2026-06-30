import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { SignOutButton } from '@clerk/nextjs';
import { getAccount } from '@/lib/account';
import AppShell from '@/components/AppShell';

export const metadata = { title: 'Settings — Mourning Guide' };

export default async function SettingsPage() {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const [account, user] = await Promise.all([getAccount(userId), currentUser()]);
  if (!account) redirect('/onboarding');

  const { accounts: acct, account_billing: billing } = account;
  const email = user?.emailAddresses?.[0]?.emailAddress ?? '—';

  return (
    <AppShell title="Settings" back={{ href: '/dashboard', label: 'Your plan' }}>

      {/* Account info */}
      <section style={sectionStyle}>
        <h2 style={sectionHead}>Account</h2>
        <Row label="Name" value={acct.subjectName ?? '—'} />
        <Row label="Email" value={email} />
        <Row label="State" value={acct.usState ?? '—'} />
        <Row label="Path" value={acct.path === 'planning' ? 'Planning ahead' : 'Supporting a loss'} />
      </section>

      {/* Billing */}
      <section style={sectionStyle}>
        <h2 style={sectionHead}>Plan</h2>
        <Row label="Current plan" value={
          billing?.planTier === 'guide' ? 'Guide Plan ($89/year)' :
          billing?.planTier === 'lapsed' ? 'Lapsed' : 'Free'
        } />
        {billing?.trialEndsAt && (
          <Row label="Trial ends" value={new Date(billing.trialEndsAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} />
        )}
        {acct.path === 'planning' && billing?.planTier !== 'guide' && (
          <a href="/api/checkout" style={linkBtnStyle}>Upgrade to Guide Plan →</a>
        )}
        {billing?.stripeCustomerId && (
          <a href="/api/billing-portal" style={{ ...linkBtnStyle, color: 'var(--mg-mid)' }}>
            Manage subscription →
          </a>
        )}
      </section>

      {/* Danger zone */}
      <section style={sectionStyle}>
        <h2 style={sectionHead}>Account actions</h2>
        <div style={rowStyle}>
          <SignOutButton>
            <button style={dangerBtnStyle}>Sign out</button>
          </SignOutButton>
        </div>
        <p style={{ fontSize: '0.78rem', color: 'var(--mg-light)', marginTop: 16, lineHeight: 1.5 }}>
          To delete your account and all data, email us at support@mourninguide.com. We'll process the request within 48 hours.
        </p>
      </section>

    </AppShell>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={rowStyle}>
      <span style={{ color: 'var(--mg-light)', fontSize: '0.85rem' }}>{label}</span>
      <span style={{ color: 'var(--mg-dark)', fontSize: '0.85rem', fontWeight: 500 }}>{value}</span>
    </div>
  );
}

const sectionStyle: React.CSSProperties = {
  background: '#fff', border: '1px solid var(--mg-border)',
  borderRadius: 12, padding: '4px 16px', marginBottom: 20,
};
const sectionHead: React.CSSProperties = {
  fontSize: '0.72rem', fontWeight: 700, color: 'var(--mg-light)',
  textTransform: 'uppercase', letterSpacing: '0.06em',
  padding: '14px 0 6px', borderBottom: '1px solid var(--mg-border)',
  marginBottom: 4,
};
const rowStyle: React.CSSProperties = {
  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  padding: '11px 0', borderBottom: '1px solid var(--mg-border)',
};
const linkBtnStyle: React.CSSProperties = {
  display: 'block', margin: '14px 0 6px', color: 'var(--mg-accent)',
  fontSize: '0.88rem', fontWeight: 600, textDecoration: 'none',
};
const dangerBtnStyle: React.CSSProperties = {
  background: 'none', border: 'none', color: '#c0392b',
  fontSize: '0.88rem', fontWeight: 600, cursor: 'pointer', padding: 0,
};
