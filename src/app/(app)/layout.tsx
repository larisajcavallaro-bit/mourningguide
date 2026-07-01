import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getAccount } from '@/lib/account';

function isTrialExpired(trialEndsAt: Date | string | null | undefined): boolean {
  if (!trialEndsAt) return false;
  return new Date(trialEndsAt).getTime() < Date.now();
}

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const account = await getAccount(userId);
  if (!account) redirect('/onboarding');

  const { accounts: acct, account_billing: billing } = account;

  // Planning path only — grief path is always free.
  // Note: this gate only affects the account OWNER's app pages. The death-
  // activation flow lives at /activate/[token] (a public route, outside this
  // layout) and is never billing-gated — a lapsed card must never block a
  // legacy contact from activating a deceased person's guide.
  if (acct.path === 'planning') {
    const paid = billing?.planTier === 'guide';
    const expired = isTrialExpired(billing?.trialEndsAt);
    const lapsed = billing?.planTier === 'lapsed';

    if (!paid && (expired || lapsed)) {
      // /upgrade lives outside the (app) group, so redirecting there won't loop.
      redirect('/upgrade');
    }
  }

  return <>{children}</>;
}
