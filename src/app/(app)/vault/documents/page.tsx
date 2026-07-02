import { db } from '@/db';
import { documents } from '@/db/schema/vault';
import { eq } from 'drizzle-orm';
import AppShell from '@/components/AppShell';
import DocumentsClient from './DocumentsClient';
import { requirePlanningAccount } from '@/lib/account';

export const metadata = { title: 'Legal & important papers — Mourning Guide' };

export default async function DocumentsPage() {
  const { accountId } = await requirePlanningAccount();

  const items = await db.select().from(documents)
    .where(eq(documents.accountId, accountId))
    .orderBy(documents.createdAt);

  return (
    <AppShell title="Legal & important papers" active="vault">
      <DocumentsClient initial={items} />
    </AppShell>
  );
}
