import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { authAccountOwner, authOwnedAccount, getAccountById } from '@/lib/account';

export async function GET(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.redirect('/sign-in');

  const accountIdParam = req.nextUrl.searchParams.get('accountId');
  const authResult = accountIdParam
    ? await authOwnedAccount(accountIdParam)
    : await authAccountOwner();

  if (!authResult.ok) {
    return NextResponse.redirect('/settings');
  }

  const account = await getAccountById(userId, authResult.accountId);
  const customerId = account?.account_billing?.stripeCustomerId;
  if (!customerId) return NextResponse.redirect('/settings');

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://mourninguide.com';

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${appUrl}/settings`,
  });

  return NextResponse.redirect(session.url);
}
