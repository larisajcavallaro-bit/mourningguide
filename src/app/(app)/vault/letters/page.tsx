import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { db } from '@/db';
import { accounts } from '@/db/schema/accounts';
import { letters } from '@/db/schema/vault';
import { eq } from 'drizzle-orm';
import AppShell from '@/components/AppShell';
import LettersClient from './LettersClient';

export const metadata = { title: 'Letters — Mourning Guide' };

export default async function LettersPage() {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const acctRows = await db.select({ id: accounts.id })
    .from(accounts).where(eq(accounts.clerkUserId, userId)).limit(1);
  const accountId = acctRows[0]?.id;
  if (!accountId) redirect('/onboarding');

  const items = await db.select().from(letters)
    .where(eq(letters.accountId, accountId))
    .orderBy(letters.createdAt);

  return (
    <AppShell title="Letters" back={{ href: '/dashboard', label: 'Your plan' }}>
      <p style={{ color: 'var(--mg-light)', fontSize: '0.88rem', marginBottom: 24, lineHeight: 1.5 }}>
        Write letters to the people you love. They'll be delivered to your legacy contact after activation — as private messages, not public posts.
      </p>
      <LettersClient initial={items as any} />
    </AppShell>
  );
}
