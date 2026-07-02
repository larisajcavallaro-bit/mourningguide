import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { getUserMemberships } from '@/lib/account';

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const memberships = await getUserMemberships(userId);
  return NextResponse.json({ memberships });
}
