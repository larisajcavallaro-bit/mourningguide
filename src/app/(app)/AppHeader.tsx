import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getUserMemberships, resolveActiveAccountId } from '@/lib/account';
import AccountSwitcher from '@/components/AccountSwitcher';

export default async function AppHeader() {
  const { userId } = await auth();
  if (!userId) return null;

  const [activeAccountId, memberships] = await Promise.all([
    resolveActiveAccountId(userId),
    getUserMemberships(userId),
  ]);

  if (!activeAccountId || memberships.length === 0) return null;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        padding: '10px 20px',
        borderBottom: '1px solid rgba(145,104,82,0.1)',
        background: 'rgba(255,250,244,0.92)',
      }}
    >
      <Link
        href="/settings"
        style={{ fontSize: '0.82rem', color: '#7a5341', textDecoration: 'none', fontWeight: 600 }}
      >
        Settings
      </Link>
      <AccountSwitcher activeAccountId={activeAccountId} />
    </div>
  );
}
