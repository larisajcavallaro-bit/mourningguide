import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { db } from '@/db';
import { accounts } from '@/db/schema/accounts';
import { documents } from '@/db/schema/vault';
import { eq, and } from 'drizzle-orm';
import { get } from '@vercel/blob';

async function getAccountId(userId: string) {
  const rows = await db.select({ id: accounts.id })
    .from(accounts).where(eq(accounts.clerkUserId, userId)).limit(1);
  return rows[0]?.id ?? null;
}

// GET — stream a private document's bytes back to its owner only. The blob
// itself requires the server's BLOB_READ_WRITE_TOKEN to read, so there is no
// public URL for these files — this route is the only way to fetch them.
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const accountId = await getAccountId(userId);
  if (!accountId) return NextResponse.json({ error: 'No account' }, { status: 400 });

  const { id } = await params;
  const [doc] = await db.select().from(documents)
    .where(and(eq(documents.id, id), eq(documents.accountId, accountId))).limit(1);
  if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const blob = await get(doc.storageKey, { access: 'private', token: process.env.DOCUMENTS_BLOB_READ_WRITE_TOKEN });
  if (!blob || blob.statusCode !== 200) return NextResponse.json({ error: 'File no longer available' }, { status: 404 });

  return new NextResponse(blob.stream, {
    headers: {
      'Content-Type': blob.blob.contentType || 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${doc.fileName.replace(/"/g, '')}"`,
    },
  });
}
