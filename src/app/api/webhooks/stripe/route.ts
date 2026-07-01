import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { db } from '@/db';
import { accountBilling } from '@/db/schema/billing';
import { accounts } from '@/db/schema/accounts';
import { eq } from 'drizzle-orm';
import Stripe from 'stripe';
import { createClerkClient } from '@clerk/backend';
import { sendUpgradeConfirmation, sendPaymentFailedEmail, sendRenewalReminder } from '@/lib/emails';

const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY! });

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
          trialEndsAt: null,          // trial is over — they're a paying customer now
          lapsedAt: null,             // clear any prior lapse
          updatedAt: new Date(),
        })
        .where(eq(accountBilling.accountId, accountId));

      // Send upgrade confirmation email
      try {
        const accountRows = await db.select({ clerkUserId: accounts.clerkUserId })
          .from(accounts).where(eq(accounts.id, accountId)).limit(1);
        if (accountRows[0]) {
          const user = await clerk.users.getUser(accountRows[0].clerkUserId);
          const email = user.emailAddresses?.[0]?.emailAddress;
          const firstName = user.firstName ?? 'there';
          if (email) {
            sendUpgradeConfirmation({ to: email, firstName }).catch(() => {});
          }
        }
      } catch { /* non-fatal */ }
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

    case 'invoice.upcoming': {
      // Stripe fires this ~7 days before renewal. Send a friendly heads-up.
      const invoice = event.data.object as Stripe.Invoice;
      const customerId = typeof invoice.customer === 'string' ? invoice.customer : invoice.customer?.id;
      if (!customerId) break;

      try {
        const billingRows = await db.select({ accountId: accountBilling.accountId })
          .from(accountBilling)
          .where(eq(accountBilling.stripeCustomerId, customerId)).limit(1);
        if (!billingRows[0]) break;

        const accountRows = await db.select({ clerkUserId: accounts.clerkUserId })
          .from(accounts).where(eq(accounts.id, billingRows[0].accountId)).limit(1);
        if (!accountRows[0]) break;

        const user = await clerk.users.getUser(accountRows[0].clerkUserId);
        const email = user.emailAddresses?.[0]?.emailAddress;
        const firstName = user.firstName ?? 'there';
        if (!email) break;

        const renewalDate = invoice.period_end
          ? new Date(invoice.period_end * 1000).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
          : 'soon';

        const portalSession = await stripe.billingPortal.sessions.create({
          customer: customerId,
          return_url: 'https://mourninguide.com/settings',
        });

        sendRenewalReminder({ to: email, firstName, renewalDate, manageUrl: portalSession.url }).catch(() => {});
      } catch { /* non-fatal */ }
      break;
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice;
      const subRef = invoice.parent?.subscription_details?.subscription;
      const subId = typeof subRef === 'string' ? subRef : subRef?.id;
      if (!subId) break;

      // Look up billing row → account → Clerk user
      try {
        const billingRows = await db.select({
          accountId: accountBilling.accountId,
          stripeCustomerId: accountBilling.stripeCustomerId,
        }).from(accountBilling)
          .where(eq(accountBilling.stripeSubscriptionId, subId)).limit(1);

        if (!billingRows[0]) break;

        const accountRows = await db.select({ clerkUserId: accounts.clerkUserId })
          .from(accounts).where(eq(accounts.id, billingRows[0].accountId)).limit(1);

        if (!accountRows[0]) break;

        const user = await clerk.users.getUser(accountRows[0].clerkUserId);
        const email = user.emailAddresses?.[0]?.emailAddress;
        const firstName = user.firstName ?? 'there';
        if (!email) break;

        // Generate a Stripe billing portal URL for updating payment
        const customerId = billingRows[0].stripeCustomerId;
        let updateUrl = 'https://mourninguide.com/settings';
        let cancelUrl = 'https://mourninguide.com/settings';
        if (customerId) {
          const portalSession = await stripe.billingPortal.sessions.create({
            customer: customerId,
            return_url: 'https://mourninguide.com/dashboard',
          });
          updateUrl = portalSession.url;
          cancelUrl = portalSession.url;
        }

        sendPaymentFailedEmail({ to: email, firstName, updateUrl, cancelUrl }).catch(() => {});
      } catch { /* non-fatal */ }
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
