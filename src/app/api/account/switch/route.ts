import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { setActiveAccountCookie, userHasAccountAccess } from '@/lib/account';

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { accountId } = body as { accountId?: string };
  if (!accountId) {
    return NextResponse.json({ error: 'accountId required' }, { status: 400 });
  }

  const allowed = await userHasAccountAccess(userId, accountId);
  if (!allowed) {
    return NextResponse.json({ error: 'You do not have access to this plan' }, { status: 403 });
  }

  await setActiveAccountCookie(accountId);
  return NextResponse.json({ success: true, accountId });
}
