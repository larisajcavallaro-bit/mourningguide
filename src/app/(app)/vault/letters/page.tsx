import { db } from '@/db';
import { letters } from '@/db/schema/vault';
import { eq } from 'drizzle-orm';
import AppShell from '@/components/AppShell';
import LettersClient from './LettersClient';
import { requirePlanningAccount } from '@/lib/account';

export const metadata = { title: 'Letters — Mourning Guide' };

export default async function LettersPage() {
  const { accountId } = await requirePlanningAccount();

  const items = await db.select().from(letters)
    .where(eq(letters.accountId, accountId))
    .orderBy(letters.createdAt);

  return (
    <AppShell title="Letters" active="remember">
      <LettersClient initial={items} />
    </AppShell>
  );
}
