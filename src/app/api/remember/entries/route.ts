import { NextResponse } from 'next/server';
import { db } from '@/db';
import { rememberEntries } from '@/db/schema/vault';
import { eq, and, desc } from 'drizzle-orm';
import { authAccount } from '@/lib/account';

const ALLOWED_KINDS = new Set(['photos', 'voice-video', 'music', 'speakers', 'obituary']);

export async function GET(req: Request) {
  const authResult = await authAccount();
  if (!authResult.ok) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  const { searchParams } = new URL(req.url);
  const kind = searchParams.get('kind');

  const rows = kind
    ? await db.select().from(rememberEntries)
      .where(and(eq(rememberEntries.accountId, authResult.accountId), eq(rememberEntries.kind, kind)))
      .orderBy(desc(rememberEntries.createdAt))
    : await db.select().from(rememberEntries)
      .where(eq(rememberEntries.accountId, authResult.accountId))
      .orderBy(desc(rememberEntries.createdAt));

  return NextResponse.json({
    items: rows.map((row) => ({
      ...row,
      values: typeof row.metadata === 'object' && row.metadata && 'values' in row.metadata
        ? (row.metadata as { values?: Record<string, string> }).values ?? {}
        : {},
    })),
  });
}

export async function POST(req: Request) {
  const authResult = await authAccount();
  if (!authResult.ok) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  const body = await req.json();
  const kind = typeof body.kind === 'string' ? body.kind : '';
  if (!ALLOWED_KINDS.has(kind)) {
    return NextResponse.json({ error: 'Invalid remember entry kind' }, { status: 400 });
  }

  const values = body.values && typeof body.values === 'object' ? body.values : {};

  const [row] = await db.insert(rememberEntries).values({
    accountId: authResult.accountId,
    kind,
    storageKey: body.storageKey?.trim() || null,
    fileName: body.fileName?.trim() || null,
    title: body.title?.trim() || null,
    recipient: body.recipient?.trim() || null,
    deliveryTarget: body.deliveryTarget?.trim() || null,
    body: body.body?.trim() || null,
    metadata: { values },
    updatedAt: new Date(),
  }).returning();

  return NextResponse.json({
    item: {
      ...row,
      values,
    },
  }, { status: 201 });
}
