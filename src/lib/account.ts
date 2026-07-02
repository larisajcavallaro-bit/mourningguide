import { cookies } from 'next/headers';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { db } from '@/db';
import { accounts } from '@/db/schema/accounts';
import { accountBilling } from '@/db/schema/billing';
import { accountMemberships } from '@/db/schema/memberships';
import { and, eq } from 'drizzle-orm';

export const ACTIVE_ACCOUNT_COOKIE = 'mg_active_account';

export type MembershipRole = 'owner' | 'admin' | 'successor';

export type AccountMembershipRow = {
  membershipId: string;
  accountId: string;
  role: MembershipRole;
  path: 'planning' | 'grief';
  planFor: 'self' | 'other';
  subjectName: string | null;
  label: string;
  sublabel: string;
};

export type AccountRow = {
  accounts: typeof accounts.$inferSelect;
  account_billing: typeof accountBilling.$inferSelect | null;
  membership: {
    id: string;
    role: MembershipRole;
  };
};

export type AuthAccountResult =
  | { ok: true; accountId: string; userId: string }
  | { ok: false; status: 401 | 400 | 403; error: string };

export function formatAccountLabel(
  path: 'planning' | 'grief',
  planFor: 'self' | 'other',
  subjectName: string | null,
  role: MembershipRole = 'owner',
): { label: string; sublabel: string } {
  const name = subjectName?.trim() || 'Unnamed plan';
  const first = name.split(' ')[0];

  if (path === 'grief') {
    return { label: `After ${first}`, sublabel: 'Grief path' };
  }
  if (planFor === 'other') {
    if (role === 'admin') {
      return { label: `${first}'s plan`, sublabel: 'Shared — you help manage' };
    }
    return { label: `${first}'s plan`, sublabel: 'Planning for a loved one' };
  }
  if (role === 'admin') {
    return { label: `${first}'s plan`, sublabel: 'Shared — you help manage' };
  }
  return { label: 'My plan', sublabel: name };
}

export async function getUserMemberships(clerkUserId: string): Promise<AccountMembershipRow[]> {
  const rows = await db
    .select({
      membershipId: accountMemberships.id,
      accountId: accountMemberships.accountId,
      role: accountMemberships.role,
      path: accounts.path,
      planFor: accounts.planFor,
      subjectName: accounts.subjectName,
    })
    .from(accountMemberships)
    .innerJoin(accounts, eq(accounts.id, accountMemberships.accountId))
    .where(eq(accountMemberships.clerkUserId, clerkUserId));

  return rows.map((row) => {
    const { label, sublabel } = formatAccountLabel(
      row.path,
      row.planFor,
      row.subjectName,
      row.role,
    );
    return {
      membershipId: row.membershipId,
      accountId: row.accountId,
      role: row.role,
      path: row.path,
      planFor: row.planFor,
      subjectName: row.subjectName,
      label,
      sublabel,
    };
  });
}

export async function userHasAccountAccess(
  clerkUserId: string,
  accountId: string,
): Promise<boolean> {
  const rows = await db
    .select({ id: accountMemberships.id })
    .from(accountMemberships)
    .where(
      and(
        eq(accountMemberships.clerkUserId, clerkUserId),
        eq(accountMemberships.accountId, accountId),
      ),
    )
    .limit(1);
  return rows.length > 0;
}

export async function resolveActiveAccountId(clerkUserId: string): Promise<string | null> {
  const memberships = await getUserMemberships(clerkUserId);
  if (!memberships.length) return null;

  const cookieStore = await cookies();
  const fromCookie = cookieStore.get(ACTIVE_ACCOUNT_COOKIE)?.value;
  if (fromCookie && memberships.some((m) => m.accountId === fromCookie)) {
    return fromCookie;
  }

  return memberships[0].accountId;
}

export async function getAccountById(
  clerkUserId: string,
  accountId: string,
): Promise<AccountRow | null> {
  const hasAccess = await userHasAccountAccess(clerkUserId, accountId);
  if (!hasAccess) return null;

  const rows = await db
    .select()
    .from(accounts)
    .leftJoin(accountBilling, eq(accountBilling.accountId, accounts.id))
    .innerJoin(
      accountMemberships,
      and(
        eq(accountMemberships.accountId, accounts.id),
        eq(accountMemberships.clerkUserId, clerkUserId),
      ),
    )
    .where(eq(accounts.id, accountId))
    .limit(1);

  const row = rows[0];
  if (!row) return null;

  return {
    accounts: row.accounts,
    account_billing: row.account_billing,
    membership: {
      id: row.account_memberships.id,
      role: row.account_memberships.role,
    },
  };
}

/** Active account for the signed-in user (respects account switcher cookie). */
export async function getAccount(clerkUserId: string): Promise<AccountRow | null> {
  const accountId = await resolveActiveAccountId(clerkUserId);
  if (!accountId) return null;
  return getAccountById(clerkUserId, accountId);
}

export async function authAccount(): Promise<AuthAccountResult> {
  const { userId } = await auth();
  if (!userId) return { ok: false, status: 401, error: 'Unauthorized' };

  const accountId = await resolveActiveAccountId(userId);
  if (!accountId) return { ok: false, status: 400, error: 'No account' };

  return { ok: true, accountId, userId };
}

/** Active account + must be owner (billing, invites, deletion). */
export async function authAccountOwner(): Promise<
  AuthAccountResult & { ok: true; accountId: string; userId: string }
  | { ok: false; status: 401 | 400 | 403; error: string }
> {
  const result = await authAccount();
  if (!result.ok) return result;

  const row = await getAccountById(result.userId, result.accountId);
  if (!row) return { ok: false, status: 400, error: 'No account' };
  if (row.membership.role !== 'owner') {
    return { ok: false, status: 403, error: 'Only the plan owner can do this' };
  }

  return result;
}

/** Verify user owns a specific account (for per-plan billing). */
export async function authOwnedAccount(
  accountId: string,
): Promise<
  AuthAccountResult & { ok: true; accountId: string; userId: string }
  | { ok: false; status: 401 | 400 | 403; error: string }
> {
  const { userId } = await auth();
  if (!userId) return { ok: false, status: 401, error: 'Unauthorized' };

  const row = await getAccountById(userId, accountId);
  if (!row) return { ok: false, status: 403, error: 'No access to this plan' };
  if (row.membership.role !== 'owner') {
    return { ok: false, status: 403, error: 'Only the plan owner can do this' };
  }

  return { ok: true, accountId, userId };
}

export async function getAccountOwnerClerkId(accountId: string): Promise<string | null> {
  const rows = await db
    .select({ clerkUserId: accountMemberships.clerkUserId })
    .from(accountMemberships)
    .where(
      and(
        eq(accountMemberships.accountId, accountId),
        eq(accountMemberships.role, 'owner'),
      ),
    )
    .limit(1);

  if (rows[0]) return rows[0].clerkUserId;

  const fallback = await db
    .select({ clerkUserId: accountMemberships.clerkUserId })
    .from(accountMemberships)
    .where(eq(accountMemberships.accountId, accountId))
    .limit(1);

  return fallback[0]?.clerkUserId ?? null;
}

export async function createAccountMembership(
  clerkUserId: string,
  accountId: string,
  role: MembershipRole = 'owner',
) {
  const existing = await db
    .select()
    .from(accountMemberships)
    .where(
      and(
        eq(accountMemberships.clerkUserId, clerkUserId),
        eq(accountMemberships.accountId, accountId),
      ),
    )
    .limit(1);
  if (existing[0]) return existing[0];

  const [membership] = await db
    .insert(accountMemberships)
    .values({ clerkUserId, accountId, role })
    .returning();
  return membership;
}

/**
 * Guard for planning-only pages. Ensures the active account is planning path.
 */
export async function requirePlanningAccount(): Promise<{ accountId: string }> {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const accountId = await resolveActiveAccountId(userId);
  if (!accountId) redirect('/onboarding');

  const rows = await db
    .select({ path: accounts.path })
    .from(accounts)
    .where(eq(accounts.id, accountId))
    .limit(1);

  if (!rows[0]) redirect('/onboarding');
  if (rows[0].path !== 'planning') redirect('/dashboard');

  return { accountId };
}

export async function setActiveAccountCookie(accountId: string) {
  const cookieStore = await cookies();
  cookieStore.set(ACTIVE_ACCOUNT_COOKIE, accountId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
  });
}
