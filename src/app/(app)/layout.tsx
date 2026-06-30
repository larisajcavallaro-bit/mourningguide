import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getAccount } from '@/lib/account';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const account = await getAccount(userId);
  if (!account) redirect('/onboarding');

  return <>{children}</>;
}
