import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getAccount } from '@/lib/account';
import Link from 'next/link';

const PLANNING_TILES = [
  { href: '/vault/finances', icon: '🏦', label: 'Finances', sub: 'Accounts, insurance, property' },
  { href: '/vault/documents', icon: '📄', label: 'Documents', sub: 'Will, trusts, IDs' },
  { href: '/vault/letters', icon: '✉️', label: 'Letters', sub: 'Messages to release after' },
  { href: '/people', icon: '👥', label: 'People', sub: 'Legacy contact & notifications' },
  { href: '/vault/wishes', icon: '🕊️', label: 'Final wishes', sub: 'Funeral & service details' },
  { href: '/portal', icon: '🔗', label: 'Your portal', sub: 'What your family will see' },
];

const GRIEF_TILES = [
  { href: '/grief/tasks', icon: '✅', label: 'Tasks', sub: 'What to do and when' },
  { href: '/grief/people', icon: '👥', label: 'People', sub: 'Who to notify' },
  { href: '/grief/finances', icon: '🏦', label: 'Finances', sub: 'Accounts and bills' },
  { href: '/grief/calendar', icon: '📅', label: 'Calendar', sub: 'Services and appointments' },
  { href: '/grief/portal', icon: '🔗', label: 'Memorial portal', sub: 'Share and coordinate' },
  { href: '/grief/remember', icon: '📷', label: 'Remember', sub: 'Photos, stories, music' },
];

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const [account, user] = await Promise.all([getAccount(userId), currentUser()]);
  if (!account) redirect('/onboarding');

  const { accounts: acct, account_billing: billing } = account;
  const isPlanning = acct.path === 'planning';
  const firstName = user?.firstName ?? acct.subjectName?.split(' ')[0] ?? 'there';
  const isPaid = billing?.planTier === 'guide';
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
        <p style={{ color: 'var(--mg-light)', fontSize: '0.9rem', marginBottom: 28 }}>
          {isPlanning
            ? `${acct.usState ? acct.usState + ' · ' : ''}Planning ahead`
            : `Supporting the loss of ${acct.subjectName}`}
        </p>

        {/* Upgrade banner for planning free tier */}
        {isPlanning && !isPaid && (
          <div style={{
            background: 'linear-gradient(135deg, #fdf3ec, #faeadf)',
            border: '1px solid rgba(197,123,87,0.3)',
            borderRadius: 12, padding: '16px 18px', marginBottom: 24,
          }}>
            <p style={{ color: 'var(--mg-dark)', fontWeight: 600, marginBottom: 4, fontSize: '0.95rem' }}>
              Start your 14-day free trial
            </p>
            <p style={{ color: 'var(--mg-mid)', fontSize: '0.84rem', marginBottom: 12 }}>
              Unlock all vault sections and your family portal. $89/year after trial.
            </p>
            <Link href="/api/checkout" style={{
              display: 'inline-block', background: 'var(--mg-accent)', color: '#fff',
              padding: '9px 18px', borderRadius: 8, fontSize: '0.88rem', fontWeight: 600,
              textDecoration: 'none',
            }}>
              Get started free →
            </Link>
          </div>
        )}

        {/* Vault tiles */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {tiles.map(tile => (
            <Link key={tile.href} href={tile.href} style={{
              background: '#fff', border: '1px solid var(--mg-border)',
              borderRadius: 12, padding: '18px 16px', textDecoration: 'none',
              display: 'block', transition: 'border-color 0.15s',
            }}>
              <div style={{ fontSize: '1.4rem', marginBottom: 8 }}>{tile.icon}</div>
              <div style={{
                fontFamily: 'var(--font-playfair), Georgia, serif',
                color: 'var(--mg-dark)', fontWeight: 600, fontSize: '0.95rem', marginBottom: 3,
              }}>{tile.label}</div>
              <div style={{ color: 'var(--mg-light)', fontSize: '0.78rem', lineHeight: 1.4 }}>{tile.sub}</div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
