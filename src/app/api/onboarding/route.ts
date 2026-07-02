import { auth, currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { db } from '@/db';
import { accounts, griefProfiles } from '@/db/schema/accounts';
import { accountBilling } from '@/db/schema/billing';
import { eq } from 'drizzle-orm';
import { sendWelcomeEmail } from '@/lib/emails';
import {
  createAccountMembership,
  getUserMemberships,
  setActiveAccountCookie,
} from '@/lib/account';

type ProxyConsentPath = 'can_text' | 'cannot_text';

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const user = await currentUser();

    const body = await req.json();
    const {
      path,
      subjectName,
      usState,
      relationship,
      planFor,
      createNew,
      proxyRelationship,
      consentPath,
      familyAttestation,
      subjectPhone,
    } = body as {
      path?: string;
      subjectName?: string;
      usState?: string;
      relationship?: string;
      planFor?: string;
      createNew?: boolean;
      proxyRelationship?: string;
      consentPath?: ProxyConsentPath;
      familyAttestation?: boolean;
      subjectPhone?: string;
    };

    if (!path || !['planning', 'grief'].includes(path)) {
      return NextResponse.json({ error: 'Invalid path' }, { status: 400 });
    }
    if (!subjectName?.trim()) {
      return NextResponse.json({ error: 'Name required' }, { status: 400 });
    }

    const existingMemberships = await getUserMemberships(userId);
    if (existingMemberships.length && !createNew) {
      const active = existingMemberships[0];
      const [account] = await db.select().from(accounts).where(eq(accounts.id, active.accountId)).limit(1);
      return NextResponse.json({ account, alreadyExists: true });
    }

    const resolvedPlanFor =
      path === 'planning' && planFor === 'other' ? 'other' : 'self';

    if (resolvedPlanFor === 'other') {
      if (!proxyRelationship?.trim()) {
        return NextResponse.json({ error: 'Please tell us your relationship to this person.' }, { status: 400 });
      }
      if (!consentPath || !['can_text', 'cannot_text'].includes(consentPath)) {
        return NextResponse.json({ error: 'Please choose how we should handle consent.' }, { status: 400 });
      }
      if (consentPath === 'cannot_text' && !familyAttestation) {
        return NextResponse.json({
          error: 'Please confirm you have permission to set up this plan on their behalf.',
        }, { status: 400 });
      }
    }

    const proxyConsentMethod =
      resolvedPlanFor === 'other'
        ? consentPath === 'cannot_text'
          ? 'family_attestation'
          : 'sms_pending'
        : 'not_required';

    const proxyConsentedAt =
      resolvedPlanFor === 'other' ? new Date() : null;

    const ownerEmail = user?.emailAddresses?.[0]?.emailAddress?.toLowerCase() ?? null;

    const resolvedPath = path as 'planning' | 'grief';

    const [account] = await db.insert(accounts).values({
      clerkUserId: userId,
      ownerEmail,
      path: resolvedPath,
      planFor: resolvedPlanFor,
      subjectName: subjectName.trim(),
      usState: usState ?? null,
      proxyRelationship: resolvedPlanFor === 'other' ? proxyRelationship!.trim() : null,
      proxyConsentMethod,
      proxySubjectPhone:
        resolvedPlanFor === 'other' && subjectPhone?.trim() ? subjectPhone.trim() : null,
      proxyConsentedAt,
    }).returning();

    await createAccountMembership(userId, account.id, 'owner');

    if (resolvedPath === 'grief' && relationship) {
      await db.insert(griefProfiles).values({
        accountId: account.id,
        relationshipToDeceased: relationship,
      });
    }

    const trialEndsAt = resolvedPath === 'planning'
      ? new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
      : null;

    await db.insert(accountBilling).values({
      accountId: account.id,
      planTier: 'free',
      trialEndsAt,
    });

    await setActiveAccountCookie(account.id);

    const email = user?.emailAddresses?.[0]?.emailAddress;
    const firstName = user?.firstName ?? subjectName.trim().split(' ')[0];
    if (email) {
      sendWelcomeEmail({ to: email, firstName, path: resolvedPath }).catch(() => {});
    }

    return NextResponse.json({ account });
  } catch (err: unknown) {
    console.error('Onboarding error:', err);
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
