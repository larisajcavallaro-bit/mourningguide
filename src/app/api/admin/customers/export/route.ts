import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { isAdminEmail, getCustomers, customersToCsv, exportMarketingEmailsCsv } from '@/lib/admin';

export async function GET(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = await currentUser();
  const email = user?.emailAddresses?.[0]?.emailAddress;
  if (!isAdminEmail(email)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const url = new URL(req.url);
  const path = url.searchParams.get('path');
  const plan = url.searchParams.get('plan');
  const marketingOnly = url.searchParams.get('marketingOnly') === '1';

  if (marketingOnly && !path && !plan) {
    const csv = await exportMarketingEmailsCsv();
    const filename = `mourning-guide-marketing-emails-${new Date().toISOString().slice(0, 10)}.csv`;
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  }

  const customers = await getCustomers({
    path: path === 'planning' || path === 'grief' ? path : 'all',
    planTier: plan === 'free' || plan === 'guide' || plan === 'lapsed' ? plan : 'all',
    marketingOnly,
  });

  const csv = customersToCsv(customers);
  const filename = `mourning-guide-customers-${new Date().toISOString().slice(0, 10)}.csv`;

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}
