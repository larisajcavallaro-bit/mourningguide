import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/db';
import { customerReviews } from '@/db/schema/admin';
import { authAccount, resolveActiveAccountId } from '@/lib/account';
import { getPublishedReviews } from '@/lib/admin';

export async function GET() {
  const reviews = await getPublishedReviews();
  return NextResponse.json({
    reviews: reviews.map(r => ({
      id: r.id,
      authorName: r.authorName,
      rating: r.rating,
      title: r.title,
      body: r.body,
      adminReply: r.adminReply,
      publishedAt: r.publishedAt,
    })),
  });
}

export async function POST(req: Request) {
  const body = await req.json();
  const { authorName, authorEmail, rating, title, body: reviewBody } = body as {
    authorName?: string;
    authorEmail?: string;
    rating?: number;
    title?: string;
    body?: string;
  };

  if (!authorName?.trim() || !authorEmail?.trim() || !reviewBody?.trim()) {
    return NextResponse.json({ error: 'Name, email, and review are required' }, { status: 400 });
  }
  if (!authorEmail.includes('@')) {
    return NextResponse.json({ error: 'Valid email required' }, { status: 400 });
  }
  if (!rating || rating < 1 || rating > 5) {
    return NextResponse.json({ error: 'Rating must be 1–5' }, { status: 400 });
  }

  let accountId: string | null = null;
  const { userId } = await auth();
  if (userId) {
    accountId = await resolveActiveAccountId(userId);
  }

  const [review] = await db.insert(customerReviews).values({
    accountId,
    authorName: authorName.trim(),
    authorEmail: authorEmail.trim().toLowerCase(),
    rating,
    title: title?.trim() || null,
    body: reviewBody.trim(),
    status: 'pending',
  }).returning();

  return NextResponse.json({ review: { id: review.id, status: review.status } }, { status: 201 });
}
