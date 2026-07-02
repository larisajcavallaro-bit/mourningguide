import { auth, currentUser } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { authAccountOwner, authOwnedAccount, getAccountById } from '@/lib/account';

async function createCheckoutUrl(userId: string, accountId: string): Promise<string> {
  const user = await currentUser();
  const account = await getAccountById(userId, accountId);
  if (!account) throw new Error('No account');
  if (account.membership.role !== 'owner') {
    throw new Error('Only the plan owner can manage billing');
  }

  const email = user?.emailAddresses?.[0]?.emailAddress;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://mourninguide.com';

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    customer_email: email,
    line_items: [{ price: process.env.STRIPE_GUIDE_PLAN_PRICE_ID!, quantity: 1 }],
    metadata: { clerkUserId: userId, accountId: account.accounts.id },
    success_url: `${appUrl}/dashboard?upgraded=1`,
    cancel_url: `${appUrl}/settings`,
  });

  return session.url!;
}

async function resolveCheckoutAccount(req: NextRequest) {
  const accountIdParam = req.nextUrl.searchParams.get('accountId');
  if (accountIdParam) {
    return authOwnedAccount(accountIdParam);
  }
  return authAccountOwner();
}

// GET — supports <a href="/api/checkout"> from the dashboard
export async function GET(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.redirect('/sign-in');

  const authResult = await resolveCheckoutAccount(req);
  if (!authResult.ok) {
    return NextResponse.redirect('/settings');
  }

  try {
    const url = await createCheckoutUrl(userId, authResult.accountId);
    return NextResponse.redirect(url);
  } catch {
    return NextResponse.redirect('/settings');
  }
}

// POST — supports fetch() calls
export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const authResult = await resolveCheckoutAccount(req);
  if (!authResult.ok) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  try {
    const url = await createCheckoutUrl(userId, authResult.accountId);
    return NextResponse.json({ url });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Something went wrong';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
