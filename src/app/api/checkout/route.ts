import { auth, currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { redirect } from 'next/navigation';
import { stripe } from '@/lib/stripe';
import { getAccount } from '@/lib/account';

async function createCheckoutUrl(userId: string): Promise<string> {
  const user = await currentUser();
  const account = await getAccount(userId);
  if (!account) throw new Error('No account');

  const email = user?.emailAddresses?.[0]?.emailAddress;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://mourninguide.com';

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    customer_email: email,
    line_items: [{ price: process.env.STRIPE_GUIDE_PLAN_PRICE_ID!, quantity: 1 }],
    metadata: { clerkUserId: userId, accountId: account.accounts.id },
    success_url: `${appUrl}/dashboard?upgraded=1`,
    cancel_url: `${appUrl}/dashboard`,
  });

  return session.url!;
}

// GET — supports <a href="/api/checkout"> from the dashboard
export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.redirect('/sign-in');
  const url = await createCheckoutUrl(userId);
  return NextResponse.redirect(url);
}

// POST — supports fetch() calls
export async function POST() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const url = await createCheckoutUrl(userId);
    return NextResponse.json({ url });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
