import { NextResponse } from 'next/server';
import { db } from '@/db';
import { accounts } from '@/db/schema/accounts';
import { obituary } from '@/db/schema/vault';
import { eq } from 'drizzle-orm';
import { authAccount } from '@/lib/account';
import { randomBytes } from 'crypto';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://mourninguide.com';

// GET — current publish state + public URL
export async function GET() {
  const authResult = await authAccount();
  if (!authResult.ok) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }
  const { accountId } = authResult;
  const account = { id: accountId, portalToken: null as string | null };
  {
    const acctRows = await db.select({ portalToken: accounts.portalToken }).from(accounts).where(eq(accounts.id, accountId)).limit(1);
    if (acctRows[0]) account.portalToken = acctRows[0].portalToken;
  }

  const [obit] = await db.select({ published: obituary.published })
    .from(obituary).where(eq(obituary.accountId, account.id)).limit(1);

  return NextResponse.json({
    published: obit?.published ?? false,
    url: account.portalToken ? `${APP_URL}/portal/${account.portalToken}` : null,
  });
}

// POST { publish: boolean } — toggle the public memorial page on/off
export async function POST(req: Request) {
  const authResult = await authAccount();
  if (!authResult.ok) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }
  const { accountId } = authResult;
  const account = { id: accountId, portalToken: null as string | null };
  {
    const acctRows = await db.select({ portalToken: accounts.portalToken }).from(accounts).where(eq(accounts.id, accountId)).limit(1);
    if (acctRows[0]) account.portalToken = acctRows[0].portalToken;
  }

  const { publish } = await req.json();

  const [obit] = await db.select().from(obituary)
    .where(eq(obituary.accountId, account.id)).limit(1);
  if (!obit || !obit.name) {
    return NextResponse.json({ error: 'Add a name to your portal before publishing.' }, { status: 400 });
  }

  // Mint a portal token on first publish
  let token = account.portalToken;
  if (publish && !token) {
    token = randomBytes(12).toString('hex');
    await db.update(accounts).set({ portalToken: token, updatedAt: new Date() })
      .where(eq(accounts.id, account.id));
  }

  await db.update(obituary)
    .set({ published: !!publish, publishedAt: publish ? new Date() : null, updatedAt: new Date() })
    .where(eq(obituary.accountId, account.id));

  return NextResponse.json({
    published: !!publish,
    url: token ? `${APP_URL}/portal/${token}` : null,
  });
}
