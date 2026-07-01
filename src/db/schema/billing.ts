import { pgTable, uuid, text, boolean, timestamp, integer, pgEnum } from 'drizzle-orm/pg-core';
import { accounts } from './accounts';

export const planTierEnum = pgEnum('plan_tier', ['free', 'guide', 'lapsed']);

export const accountBilling = pgTable('account_billing', {
  id: uuid('id').primaryKey().defaultRandom(),
  accountId: uuid('account_id').notNull().references(() => accounts.id, { onDelete: 'cascade' }).unique(),
  planTier: planTierEnum('plan_tier').default('free').notNull(),
  planExpiresAt: timestamp('plan_expires_at'),
  stripeCustomerId: text('stripe_customer_id'),
  stripeSubscriptionId: text('stripe_subscription_id'),
  trialEndsAt: timestamp('trial_ends_at'),
  lapsedAt: timestamp('lapsed_at'),
  trialExpiryEmailedAt: timestamp('trial_expiry_emailed_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
