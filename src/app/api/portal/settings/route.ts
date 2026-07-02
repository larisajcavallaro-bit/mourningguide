import { NextResponse } from 'next/server';
import { db } from '@/db';
import { portalSettings } from '@/db/schema/vault';
import { eq } from 'drizzle-orm';
import { authAccount } from '@/lib/account';

export async function GET() {
  const authResult = await authAccount();
  if (!authResult.ok) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  const [row] = await db.select().from(portalSettings)
    .where(eq(portalSettings.accountId, authResult.accountId))
    .limit(1);

  return NextResponse.json({ item: row ?? null });
}

export async function POST(req: Request) {
  const authResult = await authAccount();
  if (!authResult.ok) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  const { patch } = await req.json();
  if (!patch || typeof patch !== 'object') {
    return NextResponse.json({ error: 'patch required' }, { status: 400 });
  }

  const [existing] = await db.select().from(portalSettings)
    .where(eq(portalSettings.accountId, authResult.accountId))
    .limit(1);

  const nextValues = {
    theme: patch.theme ?? existing?.theme ?? null,
    gallery: patch.gallery ?? existing?.gallery ?? null,
    guestbook: patch.guestbook ?? existing?.guestbook ?? null,
    waysToHelp: patch.waysToHelp ?? existing?.waysToHelp ?? null,
    gifts: patch.gifts ?? existing?.gifts ?? null,
    updatedAt: new Date(),
  };

  let row;
  if (existing) {
    [row] = await db.update(portalSettings).set(nextValues)
      .where(eq(portalSettings.accountId, authResult.accountId))
      .returning();
  } else {
    [row] = await db.insert(portalSettings).values({
      accountId: authResult.accountId,
      ...nextValues,
    }).returning();
  }

  return NextResponse.json({ item: row });
}
