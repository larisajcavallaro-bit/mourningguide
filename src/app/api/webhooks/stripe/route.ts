import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { db } from '@/db';
import { accountBilling } from '@/db/schema/billing';
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
      if (!accountId || !session.subscription) break;

      // Fetch the subscription to get the real period end date
      const sub = await stripe.subscriptions.retrieve(session.subscription as string);
      const expiresAt = new Date(sub.current_period_end * 1000);

      await db.update(accountBilling)
        .set({
          planTier: 'guide',
          stripeCustomerId: session.customer as string,
          stripeSubscriptionId: session.subscription as string,
          planExpiresAt: expiresAt,
          updatedAt: new Date(),
        })
        .where(eq(accountBilling.accountId, accountId));
      break;
    }

    case 'invoice.payment_succeeded': {
      // Fires on every successful renewal — keep planExpiresAt current
      const invoice = event.data.object;
      if (invoice.billing_reason === 'subscription_create') break; // already handled above
      const subId = invoice.subscription as string;
      if (!subId) break;

      const sub = await stripe.subscriptions.retrieve(subId);
      const expiresAt = new Date(sub.current_period_end * 1000);

      await db.update(accountBilling)
        .set({ planTier: 'guide', planExpiresAt: expiresAt, updatedAt: new Date() })
        .where(eq(accountBilling.stripeSubscriptionId, subId));
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
