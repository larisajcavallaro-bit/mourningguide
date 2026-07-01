import { pgTable, uuid, text, timestamp, boolean, pgEnum } from 'drizzle-orm/pg-core';

export const marketingSourceEnum = pgEnum('marketing_source', ['footer', 'settings', 'admin']);

export const marketingSubscribers = pgTable('marketing_subscribers', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  optedIn: boolean('opted_in').default(true).notNull(),
  source: marketingSourceEnum('source').default('footer').notNull(),
  unsubscribeToken: text('unsubscribe_token').notNull().unique(),
  unsubscribedAt: timestamp('unsubscribed_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
