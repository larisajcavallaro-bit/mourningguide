import { auth, currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { db } from '@/db';
import { accounts, griefProfiles } from '@/db/schema/accounts';
import { accountBilling } from '@/db/schema/billing';
import { eq } from 'drizzle-orm';
import { sendWelcomeEmail } from '@/lib/emails';

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const user = await currentUser();

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

    // Create billing row — planning gets 14-day trial, grief is always free
    const trialEndsAt = path === 'planning'
      ? new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
      : null;

    await db.insert(accountBilling).values({
      accountId: account.id,
      planTier: 'free',
      trialEndsAt,
    });

    // Send welcome email — fire and forget, don't block the response
    const email = user?.emailAddresses?.[0]?.emailAddress;
    const firstName = user?.firstName ?? subjectName.trim().split(' ')[0];
    if (email) {
      sendWelcomeEmail({ to: email, firstName, path }).catch(() => {});
    }

    return NextResponse.json({ account });
  } catch (err: any) {
    console.error('Onboarding error:', err);
    return NextResponse.json({ error: err?.message ?? 'Unknown error' }, { status: 500 });
  }
}
