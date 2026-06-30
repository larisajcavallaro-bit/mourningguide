import { auth, currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { getAccount } from '@/lib/account';

export async function POST() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = await currentUser();
  const account = await getAccount(userId);
  if (!account) return NextResponse.json({ error: 'No account' }, { status: 400 });

  const email = user?.emailAddresses?.[0]?.emailAddress;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://mourninguide.com';

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    customer_email: email,
    line_items: [{ price: process.env.STRIPE_GUIDE_PLAN_PRICE_ID!, quantity: 1 }],
    subscription_data: {
      trial_period_days: 14,
      metadata: { clerkUserId: userId, accountId: account.accounts.id },
    },
    metadata: { clerkUserId: userId, accountId: account.accounts.id },
    success_url: `${appUrl}/dashboard?upgraded=1`,
    cancel_url: `${appUrl}/dashboard`,
  });

  return NextResponse.json({ url: session.url });
}
