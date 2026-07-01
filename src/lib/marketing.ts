import { randomUUID } from 'crypto';
import { db } from '@/db';
import { accounts } from '@/db/schema/accounts';
import { marketingSubscribers } from '@/db/schema/marketing';
import { eq, and } from 'drizzle-orm';

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function unsubscribeUrl(token: string): string {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? 'https://mourninguide.com';
  return `${base}/unsubscribe?token=${encodeURIComponent(token)}`;
}

/** Opt in an email address (footer signup or account settings). */
export async function subscribeMarketingEmail(
  rawEmail: string,
  source: 'footer' | 'settings' | 'admin' = 'footer',
): Promise<{ email: string; token: string; alreadySubscribed: boolean }> {
  const email = normalizeEmail(rawEmail);
  if (!email.includes('@')) throw new Error('Valid email required');

  const existing = await db
    .select()
    .from(marketingSubscribers)
    .where(eq(marketingSubscribers.email, email))
    .limit(1);

  let token: string;

  if (existing.length) {
    token = existing[0].unsubscribeToken;
    if (!existing[0].optedIn) {
      await db
        .update(marketingSubscribers)
        .set({ optedIn: true, unsubscribedAt: null, updatedAt: new Date(), source })
        .where(eq(marketingSubscribers.email, email));
    }
  } else {
    token = randomUUID();
    await db.insert(marketingSubscribers).values({
      email,
      optedIn: true,
      source,
      unsubscribeToken: token,
    });
  }

  await syncAccountMarketingOptIn(email, true);

  return { email, token, alreadySubscribed: existing.length > 0 && existing[0].optedIn };
}

/** Opt out everywhere this email appears. */
export async function unsubscribeMarketingEmail(opts: {
  email?: string;
  token?: string;
}): Promise<{ email: string; found: boolean }> {
  let email = opts.email ? normalizeEmail(opts.email) : null;

  if (opts.token) {
    const [row] = await db
      .select()
      .from(marketingSubscribers)
      .where(eq(marketingSubscribers.unsubscribeToken, opts.token))
      .limit(1);
    if (row) email = row.email;
  }

  if (!email) return { email: '', found: false };

  let found = false;

  const [subscriber] = await db
    .select({ id: marketingSubscribers.id, optedIn: marketingSubscribers.optedIn })
    .from(marketingSubscribers)
    .where(eq(marketingSubscribers.email, email))
    .limit(1);

  if (subscriber) {
    found = true;
    if (subscriber.optedIn) {
      await db
        .update(marketingSubscribers)
        .set({ optedIn: false, unsubscribedAt: new Date(), updatedAt: new Date() })
        .where(eq(marketingSubscribers.email, email));
    }
  }

  const accountRows = await db
    .select({ id: accounts.id, marketingOptIn: accounts.marketingOptIn })
    .from(accounts)
    .where(eq(accounts.ownerEmail, email));

  for (const account of accountRows) {
    found = true;
    if (account.marketingOptIn) {
      await db
        .update(accounts)
        .set({ marketingOptIn: false, updatedAt: new Date() })
        .where(eq(accounts.id, account.id));
    }
  }

  return { email, found };
}

async function syncAccountMarketingOptIn(email: string, optedIn: boolean) {
  await db
    .update(accounts)
    .set({ marketingOptIn: optedIn, updatedAt: new Date() })
    .where(eq(accounts.ownerEmail, email));
}

/** Keep subscriber row in sync when a signed-in user toggles settings. */
export async function syncMarketingSubscriberFromAccount(email: string, optedIn: boolean) {
  const normalized = normalizeEmail(email);
  const existing = await db
    .select()
    .from(marketingSubscribers)
    .where(eq(marketingSubscribers.email, normalized))
    .limit(1);

  if (optedIn) {
    if (existing.length) {
      await db
        .update(marketingSubscribers)
        .set({ optedIn: true, unsubscribedAt: null, updatedAt: new Date(), source: 'settings' })
        .where(eq(marketingSubscribers.email, normalized));
    } else {
      await db.insert(marketingSubscribers).values({
        email: normalized,
        optedIn: true,
        source: 'settings',
        unsubscribeToken: randomUUID(),
      });
    }
    return;
  }

  if (existing.length && existing[0].optedIn) {
    await db
      .update(marketingSubscribers)
      .set({ optedIn: false, unsubscribedAt: new Date(), updatedAt: new Date() })
      .where(eq(marketingSubscribers.email, normalized));
  }
}

export async function getOptedInMarketingEmails(): Promise<string[]> {
  const accountEmails = await db
    .select({ email: accounts.ownerEmail })
    .from(accounts)
    .where(and(eq(accounts.marketingOptIn, true)));

  const subscriberEmails = await db
    .select({ email: marketingSubscribers.email })
    .from(marketingSubscribers)
    .where(eq(marketingSubscribers.optedIn, true));

  const all = new Set<string>();
  for (const row of accountEmails) {
    if (row.email) all.add(row.email);
  }
  for (const row of subscriberEmails) {
    all.add(row.email);
  }
  return [...all].sort();
}

export async function countOptedInMarketingEmails(): Promise<number> {
  const emails = await getOptedInMarketingEmails();
  return emails.length;
}

export async function getSubscriberByToken(token: string) {
  const [row] = await db
    .select()
    .from(marketingSubscribers)
    .where(eq(marketingSubscribers.unsubscribeToken, token))
    .limit(1);
  return row ?? null;
}
