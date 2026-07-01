import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { isAdminEmail } from '@/lib/admin';
import { getOptedInMarketingEmails } from '@/lib/marketing';

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = await currentUser();
  const email = user?.emailAddresses?.[0]?.emailAddress;
  if (!isAdminEmail(email)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const emails = await getOptedInMarketingEmails();
  return NextResponse.json({ emails });
}
