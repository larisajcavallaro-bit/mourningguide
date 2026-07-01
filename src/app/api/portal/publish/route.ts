import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { db } from '@/db';
import { accounts } from '@/db/schema/accounts';
import { obituary } from '@/db/schema/vault';
import { eq } from 'drizzle-orm';
import { randomBytes } from 'crypto';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://mourninguide.com';

async function getAccount(userId: string) {
  const rows = await db.select({ id: accounts.id, portalToken: accounts.portalToken })
    .from(accounts).where(eq(accounts.clerkUserId, userId)).limit(1);
  return rows[0] ?? null;
}

// GET — current publish state + public URL
export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const account = await getAccount(userId);
  if (!account) return NextResponse.json({ error: 'No account' }, { status: 400 });

  const [obit] = await db.select({ published: obituary.published })
    .from(obituary).where(eq(obituary.accountId, account.id)).limit(1);

  return NextResponse.json({
    published: obit?.published ?? false,
    url: account.portalToken ? `${APP_URL}/portal/${account.portalToken}` : null,
  });
}

// POST { publish: boolean } — toggle the public memorial page on/off
export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const account = await getAccount(userId);
  if (!account) return NextResponse.json({ error: 'No account' }, { status: 400 });

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
