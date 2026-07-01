import { auth, currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { db } from '@/db';
import { accounts } from '@/db/schema/accounts';
import { eq } from 'drizzle-orm';
import { syncMarketingSubscriberFromAccount } from '@/lib/marketing';

export async function PATCH(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  if (typeof body.marketingOptIn !== 'boolean') {
    return NextResponse.json({ error: 'Invalid value' }, { status: 400 });
  }

  const user = await currentUser();
  const email = user?.emailAddresses?.[0]?.emailAddress;

  const [account] = await db
    .update(accounts)
    .set({ marketingOptIn: body.marketingOptIn, updatedAt: new Date() })
    .where(eq(accounts.clerkUserId, userId))
    .returning({ marketingOptIn: accounts.marketingOptIn, ownerEmail: accounts.ownerEmail });

  if (!account) return NextResponse.json({ error: 'Account not found' }, { status: 404 });

  const syncEmail = account.ownerEmail ?? email;
  if (syncEmail) {
    await syncMarketingSubscriberFromAccount(syncEmail, body.marketingOptIn);
  }

  return NextResponse.json({ marketingOptIn: account.marketingOptIn });
}
