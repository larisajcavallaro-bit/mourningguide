import { verifyWebhook } from '@clerk/nextjs/webhooks';
import type { NextRequest } from 'next/server';
import { db } from '@/db';
import { accounts } from '@/db/schema/accounts';
import { accountMemberships } from '@/db/schema/memberships';
import { eq, inArray, sql } from 'drizzle-orm';

// Clerk webhook. Configure in the Clerk dashboard to POST here for the
// `user.deleted` event. Signature is verified with CLERK_WEBHOOK_SIGNING_SECRET.
export async function POST(req: NextRequest) {
  let evt;
  try {
    evt = await verifyWebhook(req);
  } catch {
    return new Response('Invalid signature', { status: 400 });
  }

  if (evt.type === 'user.deleted') {
    const clerkUserId = evt.data.id;
    if (!clerkUserId) return new Response('ok', { status: 200 });

    const memberships = await db
      .select({ accountId: accountMemberships.accountId })
      .from(accountMemberships)
      .where(eq(accountMemberships.clerkUserId, clerkUserId));

    const accountIds = memberships.map((m) => m.accountId);

    await db.delete(accountMemberships).where(eq(accountMemberships.clerkUserId, clerkUserId));

    if (accountIds.length) {
      const remaining = await db
        .select({
          accountId: accountMemberships.accountId,
          count: sql<number>`count(*)::int`,
        })
        .from(accountMemberships)
        .where(inArray(accountMemberships.accountId, accountIds))
        .groupBy(accountMemberships.accountId);

      const covered = new Set(remaining.map((r) => r.accountId));
      const orphanIds = accountIds.filter((id) => !covered.has(id));
      if (orphanIds.length) {
        await db.delete(accounts).where(inArray(accounts.id, orphanIds));
      }
    }
  }

  return new Response('ok', { status: 200 });
}
