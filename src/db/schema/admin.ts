import { pgTable, uuid, text, timestamp, integer, pgEnum } from 'drizzle-orm/pg-core';
import { accounts } from './accounts';

export const reviewStatusEnum = pgEnum('review_status', ['pending', 'published', 'rejected']);

export const customerReviews = pgTable('customer_reviews', {
  id: uuid('id').primaryKey().defaultRandom(),
  accountId: uuid('account_id').references(() => accounts.id, { onDelete: 'set null' }),
  authorName: text('author_name').notNull(),
  authorEmail: text('author_email').notNull(),
  rating: integer('rating').notNull(), // 1–5
  title: text('title'),
  body: text('body').notNull(),
  status: reviewStatusEnum('status').default('pending').notNull(),
  adminReply: text('admin_reply'),
  adminReplyAt: timestamp('admin_reply_at'),
  publishedAt: timestamp('published_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
