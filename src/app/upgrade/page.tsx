import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getAccount } from '@/lib/account';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Continue your guide — Mourning Guide' };

export default async function UpgradePage() {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const [account, user] = await Promise.all([
    getAccount(userId),
    currentUser(),
  ]);

  if (!account) redirect('/onboarding');

  const { accounts: acct, account_billing: billing, membership } = account;

  if (membership.role === 'admin') redirect('/dashboard');

  // If they've already paid, send them back to the dashboard
  if (billing?.planTier === 'guide') redirect('/dashboard');

  // Grief path users don't hit this gate
  if (acct.path === 'grief') redirect('/dashboard');

  const firstName = user?.firstName ?? acct.subjectName?.split(' ')[0] ?? 'there';
  const lapsed = billing?.planTier === 'lapsed';
  const eyebrow = lapsed ? 'Your subscription has ended' : 'Your free trial has ended';
  const openingLine = lapsed
    ? 'Your subscription has ended. Everything you\'ve built — your vault, your letters, your final wishes — is still here, still safe. Nothing has been lost.'
    : 'Your 14-day trial is complete. Everything you\'ve built — your vault, your letters, your final wishes — is still here, still safe. Nothing has been lost.';

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(circle at 72% 8%,rgba(203,183,162,0.18),transparent 28%),linear-gradient(180deg,#fffaf4,#f5eadf)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 16px',
      fontFamily: "var(--sans, 'Avenir Next', sans-serif)",
    }}>
      <div style={{ maxWidth: 460, width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/mg-icon.svg" alt="Mourning Guide" width={56} height={56}
            style={{ borderRadius: 10, display: 'block', margin: '0 auto 16px' }} />
        </div>

        <div style={{
          background: 'rgba(255,250,244,0.94)', borderRadius: 26, border: '1px solid rgba(142,95,70,0.2)',
          overflow: 'hidden', boxShadow: '0 20px 46px rgba(67,46,33,0.1)',
        }}>
          <div style={{ padding: '40px 36px 44px' }}>

            <p style={{ margin: '0 0 6px', fontSize: '0.75rem', color: '#c86d49', textTransform: 'uppercase', letterSpacing: '0.14em', fontWeight: 800 }}>
              {eyebrow}
            </p>
            <h1 style={{ fontFamily: 'var(--serif)', fontWeight: 500, fontSize: '1.6rem', color: '#2f241f', marginBottom: 20, lineHeight: 1.25 }}>
              Dear {firstName},
            </h1>

            <p style={{ color: '#594b43', lineHeight: 1.75, fontSize: '0.97rem', marginBottom: 20 }}>
              {openingLine}
            </p>

            <div style={{
              borderLeft: '3px solid #c57b57', paddingLeft: 20, margin: '24px 0',
            }}>
              <p style={{ margin: 0, fontFamily: 'var(--serif)', fontSize: '1.05rem', color: '#2f241f', lineHeight: 1.7, fontStyle: 'italic' }}>
                To keep your guide active and make sure your family can access everything when the time comes, continue with a full account.
              </p>
            </div>

            <div style={{
              background: 'rgba(255,255,255,0.75)', borderRadius: 16, border: '1px solid rgba(145,104,82,0.16)',
              padding: '20px 22px', marginBottom: 28,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <span style={{ fontFamily: 'var(--serif)', fontWeight: 500, color: '#2f241f', fontSize: '1.05rem' }}>Guide Plan</span>
                <span style={{ fontWeight: 700, color: '#c57b57', fontSize: '1.15rem' }}>$89 / year</span>
              </div>
              <ul style={{ margin: 0, padding: '0 0 0 18px', color: '#594b43', fontSize: '0.88rem', lineHeight: 2.1 }}>
                <li>Full vault — finances, letters, wishes, portal</li>
                <li>Activation flow for your legacy contact</li>
                <li>Automatic letter delivery on activation</li>
                <li>Family notification system</li>
              </ul>
            </div>

            <a href="/api/checkout" style={{
              display: 'flex', width: '100%', minHeight: 54, alignItems: 'center', justifyContent: 'center', padding: '15px',
              background: 'linear-gradient(180deg,#d88963,#c57b57)', color: '#fff', border: 'none',
              borderRadius: 14, fontSize: '1rem', fontWeight: 600,
              textDecoration: 'none', textAlign: 'center',
              fontFamily: 'var(--serif)', boxSizing: 'border-box', boxShadow: '0 12px 26px rgba(197,123,87,0.28)',
            }}>
              Subscribe to Guide Plan — $89/year →
            </a>

            <p style={{ margin: '14px 0 0', fontSize: '0.8rem', color: '#9a7a6a', textAlign: 'center', lineHeight: 1.6 }}>
              This is your paid planning subscription. The grief path is a separate, always-free option — not what you&apos;re subscribing to here.
            </p>

            <p style={{ margin: '20px 0 0', fontSize: '0.82rem', color: '#9a7a6a', textAlign: 'center', lineHeight: 1.7 }}>
              Questions? Reply to any email from us or write to{' '}
              <a href="mailto:support@mourninguide.com" style={{ color: '#c57b57', textDecoration: 'none' }}>
                support@mourninguide.com
              </a>
            </p>
          </div>
        </div>

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: '0.76rem', color: '#a08a76' }}>
          <a href="https://mourninguide.com" style={{ color: '#a08a76', textDecoration: 'none' }}>mourninguide.com</a>
        </p>
      </div>
    </div>
  );
}
