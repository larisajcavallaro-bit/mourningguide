import { NextResponse } from 'next/server';
import { db } from '@/db';
import { accounts } from '@/db/schema/accounts';
import { legacyContacts } from '@/db/schema/people';
import { eq } from 'drizzle-orm';
import { clerkClient } from '@clerk/nextjs/server';

// POST — allow the legacy contact to permanently delete the deceased person's
// account. Token-authenticated (only the holder of the activation link can do
// this) and only once the guide has actually been activated.
export async function POST(
  _req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;

  const contactRows = await db.select({ accountId: legacyContacts.accountId })
    .from(legacyContacts)
    .where(eq(legacyContacts.activationToken, token))
    .limit(1);
  if (!contactRows[0]) return NextResponse.json({ error: 'Invalid token' }, { status: 404 });

  const [account] = await db.select().from(accounts)
    .where(eq(accounts.id, contactRows[0].accountId)).limit(1);
  if (!account) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  // Only deletable after the guide has been activated (the person has passed).
  if (account.activationStatus !== 'activated') {
    return NextResponse.json(
      { error: 'This guide can only be deleted after it has been activated.' },
      { status: 400 },
    );
  }

  // Remove the deceased person's Clerk login too, if present (best-effort).
  if (account.clerkUserId) {
    try {
      const clerk = await clerkClient();
      await clerk.users.deleteUser(account.clerkUserId);
    } catch { /* the Clerk user may already be gone — proceed with DB delete */ }
  }

  // Cascades remove billing, vault, people, photos, activations, and logs.
  await db.delete(accounts).where(eq(accounts.id, account.id));

  return NextResponse.json({ success: true });
}
