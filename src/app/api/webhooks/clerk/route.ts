import { verifyWebhook } from '@clerk/nextjs/webhooks';
import type { NextRequest } from 'next/server';
import { db } from '@/db';
import { accounts } from '@/db/schema/accounts';
import { eq } from 'drizzle-orm';

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
    if (clerkUserId) {
      // Cascades remove billing, vault, people, activations, and logs.
      await db.delete(accounts).where(eq(accounts.clerkUserId, clerkUserId));
    }
  }

  return new Response('ok', { status: 200 });
}
