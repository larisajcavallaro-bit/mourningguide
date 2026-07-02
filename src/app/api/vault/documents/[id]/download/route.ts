import { NextResponse } from 'next/server';
import { db } from '@/db';
import { accounts } from '@/db/schema/accounts';
import { documents } from '@/db/schema/vault';
import { eq, and } from 'drizzle-orm';
import { authAccount } from '@/lib/account';
import { get } from '@vercel/blob';

// GET — stream a private document's bytes back to its owner only. The blob
// itself requires the server's BLOB_READ_WRITE_TOKEN to read, so there is no
// public URL for these files — this route is the only way to fetch them.
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const authResult = await authAccount();
  if (!authResult.ok) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }
  const { accountId } = authResult;

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
