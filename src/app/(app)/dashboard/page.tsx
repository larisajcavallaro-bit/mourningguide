import type { Metadata } from 'next';
import { auth, currentUser } from '@clerk/nextjs/server';

export const metadata: Metadata = { title: 'Dashboard — Mourning Guide' };
import { redirect } from 'next/navigation';
import { getAccount } from '@/lib/account';
import Link from 'next/link';

const PLANNING_TILES = [
  { href: '/vault/finances', icon: '🏦', label: 'Finances', sub: 'Accounts, insurance, property' },
  { href: '/vault/letters', icon: '✉️', label: 'Letters', sub: 'Messages to release after' },
  { href: '/people', icon: '👥', label: 'People', sub: 'Legacy contact & notifications' },
  { href: '/vault/wishes', icon: '🕊️', label: 'Final wishes', sub: 'Funeral & service details' },
  { href: '/portal', icon: '🔗', label: 'Your portal', sub: 'What your family will see' },
  { href: null, icon: '📄', label: 'Documents', sub: 'Will, trusts, IDs — coming soon' },
];

const GRIEF_TILES = [
  { href: null, icon: '✅', label: 'Tasks', sub: 'What to do and when — coming soon' },
  { href: null, icon: '👥', label: 'People', sub: 'Who to notify — coming soon' },
  { href: null, icon: '🏦', label: 'Finances', sub: 'Accounts and bills — coming soon' },
  { href: null, icon: '📅', label: 'Calendar', sub: 'Services and appointments — coming soon' },
  { href: null, icon: '🔗', label: 'Memorial portal', sub: 'Share and coordinate — coming soon' },
  { href: null, icon: '📷', label: 'Remember', sub: 'Photos, stories, music — coming soon' },
];

function trialDaysLeft(trialEndsAt: Date | string | null): number | null {
  if (!trialEndsAt) return null;
  const ms = new Date(trialEndsAt).getTime() - Date.now();
  return ms > 0 ? Math.ceil(ms / (1000 * 60 * 60 * 24)) : 0;
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ upgraded?: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const [{ upgraded }, account, user] = await Promise.all([
    searchParams,
    getAccount(userId!),
    currentUser(),
  ]);

  if (!account) redirect('/onboarding');

  const { accounts: acct, account_billing: billing } = account;
  const isPlanning = acct.path === 'planning';
  const firstName = user?.firstName ?? acct.subjectName?.split(' ')[0] ?? 'there';
  const isPaid = billing?.planTier === 'guide';
  const daysLeft = isPlanning && !isPaid ? trialDaysLeft(billing?.trialEndsAt ?? null) : null;
  const trialExpired = daysLeft !== null && daysLeft <= 0;
  const tiles = isPlanning ? PLANNING_TILES : GRIEF_TILES;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--mg-bg)', padding: '0 0 80px' }}>
      {/* Header */}
      <header style={{
        background: '#fff', borderBottom: '1px solid var(--mg-border)',
        padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span style={{
          fontFamily: 'var(--font-playfair), Georgia, serif',
          fontSize: '1.15rem', color: 'var(--mg-dark)', fontWeight: 600,
        }}>Mourning Guide</span>
        <Link href="/settings" style={{ fontSize: '0.82rem', color: 'var(--mg-light)', textDecoration: 'none' }}>
          Settings
        </Link>
      </header>

      <main style={{ maxWidth: 480, margin: '0 auto', padding: '28px 20px' }}>
        {/* Greeting */}
        <h1 style={{
          fontFamily: 'var(--font-playfair), Georgia, serif',
          fontSize: '1.7rem', color: 'var(--mg-dark)', marginBottom: 4,
        }}>
          {isPlanning ? `Your plan, ${firstName}` : `Here for you, ${firstName}`}
        </h1>
        <p style={{ color: 'var(--mg-light)', fontSize: '0.9rem', marginBottom: 24 }}>
          {isPlanning
            ? `${acct.usState ? acct.usState + ' · ' : ''}Planning ahead`
            : `Supporting the loss of ${acct.subjectName}`}
        </p>

        {/* Upgrade success banner */}
        {upgraded === '1' && (
          <div style={{
            background: 'linear-gradient(135deg, #edf7f0, #d8f0e0)',
            border: '1px solid rgba(39,174,96,0.25)',
            borderRadius: 12, padding: '14px 18px', marginBottom: 24,
          }}>
            <p style={{ color: '#1e7e44', fontWeight: 600, fontSize: '0.88rem', marginBottom: 2 }}>
              You&apos;re all set — welcome to Guide Plan!
            </p>
            <p style={{ color: '#2d6a41', fontSize: '0.8rem' }}>
              Your vault and family portal are unlocked for the year.
            </p>
          </div>
        )}

        {/* Subscribed badge */}
        {isPaid && upgraded !== '1' && (
          <div style={{
            background: 'linear-gradient(135deg, #fdf3ec, #faeadf)',
            border: '1px solid rgba(197,123,87,0.25)',
            borderRadius: 12, padding: '12px 18px', marginBottom: 24,
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <span style={{ fontSize: '1rem' }}>✓</span>
            <p style={{ color: 'var(--mg-dark)', fontWeight: 600, fontSize: '0.85rem', margin: 0 }}>
              Guide Plan · Active
            </p>
          </div>
        )}

        {/* Trial banner */}
        {isPlanning && !isPaid && daysLeft !== null && !trialExpired && (
          <div style={{
            background: 'linear-gradient(135deg, #fdf3ec, #faeadf)',
            border: '1px solid rgba(197,123,87,0.25)',
            borderRadius: 12, padding: '14px 18px', marginBottom: 24,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <div>
              <p style={{ color: 'var(--mg-dark)', fontWeight: 600, fontSize: '0.88rem', marginBottom: 2 }}>
                {daysLeft} {daysLeft === 1 ? 'day' : 'days'} left in your free trial
              </p>
              <p style={{ color: 'var(--mg-mid)', fontSize: '0.8rem' }}>
                $89/year after · No card needed today
              </p>
            </div>
          </div>
        )}

        {/* Trial expired — upgrade required */}
        {isPlanning && !isPaid && trialExpired && (
          <div style={{
            background: '#fff3f3', border: '1px solid rgba(192,57,43,0.2)',
            borderRadius: 12, padding: '16px 18px', marginBottom: 24,
          }}>
            <p style={{ color: '#c0392b', fontWeight: 600, marginBottom: 6, fontSize: '0.92rem' }}>
              Your free trial has ended
            </p>
            <p style={{ color: 'var(--mg-mid)', fontSize: '0.84rem', marginBottom: 12 }}>
              Upgrade to keep access to your vault and family portal.
            </p>
            <a href="/api/checkout" style={{
              display: 'inline-block', background: 'var(--mg-accent)', color: '#fff',
              padding: '9px 18px', borderRadius: 8, fontSize: '0.88rem', fontWeight: 600,
              textDecoration: 'none',
            }}>
              Upgrade — $89/year →
            </a>
          </div>
        )}

        {/* Vault tiles */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {tiles.map(tile => {
            const tileContent = (
              <>
                <div style={{ fontSize: '1.4rem', marginBottom: 8 }}>{tile.icon}</div>
                <div style={{
                  fontFamily: 'var(--font-playfair), Georgia, serif',
                  color: tile.href ? 'var(--mg-dark)' : 'var(--mg-light)',
                  fontWeight: 600, fontSize: '0.95rem', marginBottom: 3,
                }}>{tile.label}</div>
                <div style={{ color: 'var(--mg-light)', fontSize: '0.78rem', lineHeight: 1.4 }}>{tile.sub}</div>
              </>
            );
            return tile.href ? (
              <Link key={tile.label} href={tile.href} style={{
                background: '#fff', border: '1px solid var(--mg-border)',
                borderRadius: 12, padding: '18px 16px', textDecoration: 'none',
                display: 'block',
              }}>
                {tileContent}
              </Link>
            ) : (
              <div key={tile.label} style={{
                background: '#faf7f4', border: '1px solid var(--mg-border)',
                borderRadius: 12, padding: '18px 16px', opacity: 0.6,
              }}>
                {tileContent}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
