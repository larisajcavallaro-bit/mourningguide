import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { db } from '@/db';
import { accounts } from '@/db/schema/accounts';
import { legacyContacts, notificationContacts } from '@/db/schema/people';
import { eq } from 'drizzle-orm';
import AppShell from '@/components/AppShell';
import PeopleClient from './PeopleClient';

export const metadata = { title: 'People — Mourning Guide' };

export default async function PeoplePage() {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const acctRows = await db.select({ id: accounts.id })
    .from(accounts).where(eq(accounts.clerkUserId, userId)).limit(1);
  const accountId = acctRows[0]?.id;
  if (!accountId) redirect('/onboarding');

  const [legacyRows, contactRows] = await Promise.all([
    db.select().from(legacyContacts).where(eq(legacyContacts.accountId, accountId)).limit(1),
    db.select().from(notificationContacts).where(eq(notificationContacts.accountId, accountId)).orderBy(notificationContacts.createdAt),
  ]);

  return (
    <AppShell title="People" back={{ href: '/dashboard', label: 'Your plan' }}>
      <PeopleClient
        initialLegacy={legacyRows[0] ?? null}
        initialContacts={contactRows}
      />
    </AppShell>
  );
}
