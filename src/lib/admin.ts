import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { db } from '@/db';
import { accounts } from '@/db/schema/accounts';
import { accountBilling } from '@/db/schema/billing';
import { customerReviews } from '@/db/schema/admin';
import { count, eq, sql, desc, and } from 'drizzle-orm';
import { countOptedInMarketingEmails, getOptedInMarketingEmails } from '@/lib/marketing';

const GUIDE_PLAN_ANNUAL = 89;

/** Emails allowed to access /staff. support@ is the business address; add your personal Clerk login here too. */
const DEFAULT_ADMIN_EMAILS = [
  'larisajcavallaro@gmail.com',
  'support@mourninguide.com',
];

function parseAdminEmails(): string[] {
  const fromEnv = (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map(e => e.trim().toLowerCase())
    .filter(Boolean);
  return fromEnv.length ? fromEnv : DEFAULT_ADMIN_EMAILS;
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return parseAdminEmails().includes(email.trim().toLowerCase());
}
export async function requireAdminStaff(): Promise<{ email: string }> {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in?redirect_url=/staff');

  const user = await currentUser();
  const email = user?.emailAddresses?.[0]?.emailAddress;
  if (!isAdminEmail(email)) redirect('/');

  return { email: email! };
}

export type BusinessMetrics = {
  totalAccounts: number;
  planningAccounts: number;
  griefAccounts: number;
  guidePlans: number;
  activeTrials: number;
  lapsedPlans: number;
  activatedAccounts: number;
  pendingReviews: number;
  publishedReviews: number;
  estimatedArr: number;
  newAccountsLast30Days: number;
  marketingOptInCount: number;
};

export async function getBusinessMetrics(): Promise<BusinessMetrics> {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [totals] = await db
    .select({
      totalAccounts: count(),
      planningAccounts: sql<number>`count(*) filter (where ${accounts.path} = 'planning')`.mapWith(Number),
      griefAccounts: sql<number>`count(*) filter (where ${accounts.path} = 'grief')`.mapWith(Number),
      activatedAccounts: sql<number>`count(*) filter (where ${accounts.activationStatus} = 'activated')`.mapWith(Number),
      newAccountsLast30Days: sql<number>`count(*) filter (where ${accounts.createdAt} >= ${thirtyDaysAgo})`.mapWith(Number),
      marketingOptInCount: sql<number>`count(*) filter (where ${accounts.marketingOptIn} = true)`.mapWith(Number),
    })
    .from(accounts);

  const [billingTotals] = await db
    .select({
      guidePlans: sql<number>`count(*) filter (where ${accountBilling.planTier} = 'guide')`.mapWith(Number),
      activeTrials: sql<number>`count(*) filter (where ${accountBilling.trialEndsAt} > ${now} and ${accountBilling.planTier} = 'free')`.mapWith(Number),
      lapsedPlans: sql<number>`count(*) filter (where ${accountBilling.planTier} = 'lapsed')`.mapWith(Number),
    })
    .from(accountBilling);

  const [reviewTotals] = await db
    .select({
      pendingReviews: sql<number>`count(*) filter (where ${customerReviews.status} = 'pending')`.mapWith(Number),
      publishedReviews: sql<number>`count(*) filter (where ${customerReviews.status} = 'published')`.mapWith(Number),
    })
    .from(customerReviews);

  const guidePlans = billingTotals?.guidePlans ?? 0;
  const marketingOptInCount = await countOptedInMarketingEmails();

  return {
    totalAccounts: totals?.totalAccounts ?? 0,
    planningAccounts: totals?.planningAccounts ?? 0,
    griefAccounts: totals?.griefAccounts ?? 0,
    guidePlans,
    activeTrials: billingTotals?.activeTrials ?? 0,
    lapsedPlans: billingTotals?.lapsedPlans ?? 0,
    activatedAccounts: totals?.activatedAccounts ?? 0,
    pendingReviews: reviewTotals?.pendingReviews ?? 0,
    publishedReviews: reviewTotals?.publishedReviews ?? 0,
    estimatedArr: guidePlans * GUIDE_PLAN_ANNUAL,
    newAccountsLast30Days: totals?.newAccountsLast30Days ?? 0,
    marketingOptInCount,
  };
}

export type CustomerRow = {
  id: string;
  ownerEmail: string | null;
  subjectName: string | null;
  path: 'planning' | 'grief';
  usState: string | null;
  activationStatus: string;
  marketingOptIn: boolean;
  planTier: string | null;
  trialEndsAt: Date | null;
  planExpiresAt: Date | null;
  stripeCustomerId: string | null;
  createdAt: Date;
};

export async function getCustomers(filters?: {
  path?: 'planning' | 'grief' | 'all';
  planTier?: 'free' | 'guide' | 'lapsed' | 'all';
  marketingOnly?: boolean;
}): Promise<CustomerRow[]> {
  const conditions = [];
  if (filters?.path && filters.path !== 'all') {
    conditions.push(eq(accounts.path, filters.path));
  }
  if (filters?.planTier && filters.planTier !== 'all') {
    conditions.push(eq(accountBilling.planTier, filters.planTier));
  }
  if (filters?.marketingOnly) {
    conditions.push(eq(accounts.marketingOptIn, true));
  }

  const rows = await db
    .select({
      id: accounts.id,
      ownerEmail: accounts.ownerEmail,
      subjectName: accounts.subjectName,
      path: accounts.path,
      usState: accounts.usState,
      activationStatus: accounts.activationStatus,
      marketingOptIn: accounts.marketingOptIn,
      planTier: accountBilling.planTier,
      trialEndsAt: accountBilling.trialEndsAt,
      planExpiresAt: accountBilling.planExpiresAt,
      stripeCustomerId: accountBilling.stripeCustomerId,
      createdAt: accounts.createdAt,
    })
    .from(accounts)
    .leftJoin(accountBilling, eq(accountBilling.accountId, accounts.id))
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(accounts.createdAt));

  return rows;
}

export async function getReviews(status?: 'pending' | 'published' | 'rejected' | 'all') {
  const query = db
    .select()
    .from(customerReviews)
    .orderBy(desc(customerReviews.createdAt));

  if (status && status !== 'all') {
    return query.where(eq(customerReviews.status, status));
  }
  return query;
}

export async function getPublishedReviews() {
  return db
    .select()
    .from(customerReviews)
    .where(eq(customerReviews.status, 'published'))
    .orderBy(desc(customerReviews.publishedAt));
}

export function customersToCsv(customers: CustomerRow[]): string {
  const header = [
    'email',
    'name',
    'path',
    'state',
    'plan',
    'activation_status',
    'marketing_opt_in',
    'trial_ends',
    'plan_expires',
    'stripe_customer_id',
    'created_at',
  ].join(',');

  const lines = customers.map(c => [
    csvEscape(c.ownerEmail ?? ''),
    csvEscape(c.subjectName ?? ''),
    c.path,
    csvEscape(c.usState ?? ''),
    c.planTier ?? 'free',
    c.activationStatus,
    c.marketingOptIn ? 'yes' : 'no',
    c.trialEndsAt?.toISOString() ?? '',
    c.planExpiresAt?.toISOString() ?? '',
    csvEscape(c.stripeCustomerId ?? ''),
    c.createdAt.toISOString(),
  ].join(','));

  return [header, ...lines].join('\n');
}

function csvEscape(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function marketingEmailsToCsv(emails: string[]): string {
  return ['email', ...emails.map(csvEscape)].join('\n');
}

export async function exportMarketingEmailsCsv(): Promise<string> {
  const emails = await getOptedInMarketingEmails();
  return marketingEmailsToCsv(emails);
}
