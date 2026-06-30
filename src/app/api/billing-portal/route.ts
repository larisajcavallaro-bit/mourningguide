import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { getAccount } from '@/lib/account';

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.redirect('/sign-in');

  const account = await getAccount(userId);
  const customerId = account?.account_billing?.stripeCustomerId;
  if (!customerId) return NextResponse.redirect('/settings');

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://mourninguide.com';

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${appUrl}/settings`,
  });

  return NextResponse.redirect(session.url);
}
