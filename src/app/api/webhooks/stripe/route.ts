import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { db } from '@/db';
import { accountBilling } from '@/db/schema/billing';
import { eq } from 'drizzle-orm';
import Stripe from 'stripe';

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const sig = headersList.get('stripe-signature')!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return new Response('Webhook signature verification failed', { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const accountId = session.metadata?.accountId;
      if (!accountId || !session.subscription) break;

      // Yearly plan — expire 1 year from now
      const expiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);

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
      const invoice = event.data.object as Stripe.Invoice;
      if (invoice.billing_reason === 'subscription_create') break; // handled above
      const subRef = invoice.parent?.subscription_details?.subscription;
      const subId = typeof subRef === 'string' ? subRef : subRef?.id;
      if (!subId) break;

      // invoice.period_end is the end of the billing period just paid
      const expiresAt = new Date(invoice.period_end * 1000);

      await db.update(accountBilling)
        .set({ planTier: 'guide', planExpiresAt: expiresAt, updatedAt: new Date() })
        .where(eq(accountBilling.stripeSubscriptionId, subId));
      break;
    }

    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription;
      await db.update(accountBilling)
        .set({ planTier: 'lapsed', lapsedAt: new Date(), updatedAt: new Date() })
        .where(eq(accountBilling.stripeSubscriptionId, sub.id));
      break;
    }
  }

  return new Response('ok', { status: 200 });
}
