import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { isAdminEmail } from '@/lib/admin';
import { db } from '@/db';
import { customerReviews } from '@/db/schema/admin';
import { eq } from 'drizzle-orm';

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Params) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = await currentUser();
  const email = user?.emailAddresses?.[0]?.emailAddress;
  if (!isAdminEmail(email)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { id } = await params;
  const body = await req.json();
  const { status, adminReply } = body as {
    status?: 'pending' | 'published' | 'rejected';
    adminReply?: string | null;
  };

  const updates: Partial<typeof customerReviews.$inferInsert> = {
    updatedAt: new Date(),
  };

  if (status) {
    if (!['pending', 'published', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }
    updates.status = status;
    if (status === 'published') {
      updates.publishedAt = new Date();
    }
    if (status !== 'published') {
      updates.publishedAt = null;
    }
  }

  if (adminReply !== undefined) {
    const trimmed = adminReply?.trim();
    updates.adminReply = trimmed || null;
    updates.adminReplyAt = trimmed ? new Date() : null;
  }

  const [review] = await db
    .update(customerReviews)
    .set(updates)
    .where(eq(customerReviews.id, id))
    .returning();

  if (!review) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  return NextResponse.json({ review });
}
