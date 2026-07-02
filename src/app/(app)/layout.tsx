import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getAccount, getUserMemberships } from '@/lib/account';
import AppHeader from './AppHeader';
import WalkthroughHost from '@/components/WalkthroughHost';

function isTrialExpired(trialEndsAt: Date | string | null | undefined): boolean {
  if (!trialEndsAt) return false;
  return new Date(trialEndsAt).getTime() < Date.now();
}

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const memberships = await getUserMemberships(userId);
  if (!memberships.length) redirect('/onboarding');

  const account = await getAccount(userId);
  if (!account) redirect('/onboarding');

  const { accounts: acct, account_billing: billing, membership } = account;
  const isCollaborator = membership.role === 'admin';

  if (acct.path === 'planning' && !isCollaborator) {
    const paid = billing?.planTier === 'guide';
    const expired = isTrialExpired(billing?.trialEndsAt);
    const lapsed = billing?.planTier === 'lapsed';

    if (!paid && (expired || lapsed)) {
      redirect('/upgrade');
    }
  }

  return (
    <>
      <AppHeader />
      <WalkthroughHost accountPath={acct.path} />
      {children}
    </>
  );
}
