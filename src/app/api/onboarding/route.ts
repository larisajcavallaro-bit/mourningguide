import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { db } from '@/db';
import { accounts, griefProfiles } from '@/db/schema/accounts';
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { path, subjectName, usState, relationship } = body;

  if (!path || !['planning', 'grief'].includes(path)) {
    return NextResponse.json({ error: 'Invalid path' }, { status: 400 });
  }
  if (!subjectName?.trim()) {
    return NextResponse.json({ error: 'Name required' }, { status: 400 });
  }

  // Idempotent: return existing account if already created
  const existing = await db.select().from(accounts).where(eq(accounts.clerkUserId, userId)).limit(1);
  if (existing.length) {
    return NextResponse.json({ account: existing[0] });
  }

  const [account] = await db.insert(accounts).values({
    clerkUserId: userId,
    path,
    subjectName: subjectName.trim(),
    usState: usState ?? null,
  }).returning();

  if (path === 'grief' && relationship) {
    await db.insert(griefProfiles).values({
      accountId: account.id,
      relationshipToDeceased: relationship,
    });
  }

  return NextResponse.json({ account });
}
