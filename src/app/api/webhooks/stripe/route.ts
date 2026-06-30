import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { db, accountBilling } from '@/db';
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const sig = headersList.get('stripe-signature')!;

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return new Response('Webhook signature verification failed', { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      const accountId = session.metadata?.accountId;
      if (accountId && session.subscription) {
        await db.update(accountBilling)
          .set({
            planTier: 'guide',
            stripeCustomerId: session.customer as string,
            stripeSubscriptionId: session.subscription as string,
            planExpiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
            updatedAt: new Date(),
          })
          .where(eq(accountBilling.accountId, accountId));
      }
      break;
    }
    case 'customer.subscription.deleted': {
      const sub = event.data.object;
      await db.update(accountBilling)
        .set({ planTier: 'lapsed', lapsedAt: new Date(), updatedAt: new Date() })
        .where(eq(accountBilling.stripeSubscriptionId, sub.id));
      break;
    }
  }

  return new Response('ok', { status: 200 });
}
