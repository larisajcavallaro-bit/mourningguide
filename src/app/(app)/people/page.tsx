import { db } from '@/db';
import { legacyContacts, notificationContacts } from '@/db/schema/people';
import { eq } from 'drizzle-orm';
import AppShell from '@/components/AppShell';
import PeopleClient from './PeopleClient';
import { requirePlanningAccount } from '@/lib/account';

export const metadata = { title: 'People — Mourning Guide' };

export default async function PeoplePage() {
  const { accountId } = await requirePlanningAccount();

  const [legacyRows, contactRows] = await Promise.all([
    db.select().from(legacyContacts).where(eq(legacyContacts.accountId, accountId)).orderBy(legacyContacts.createdAt),
    db.select().from(notificationContacts).where(eq(notificationContacts.accountId, accountId)).orderBy(notificationContacts.createdAt),
  ]);

  return (
    <AppShell title="People" active="people">
      <PeopleClient
        initialLegacy={legacyRows}
        initialContacts={contactRows}
      />
    </AppShell>
  );
}
