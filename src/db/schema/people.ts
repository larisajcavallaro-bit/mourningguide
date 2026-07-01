import { pgTable, uuid, text, boolean, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { accounts } from './accounts';

export const inviteStatusEnum = pgEnum('invite_status', ['pending', 'accepted']);
export const notifyPhaseEnum = pgEnum('notify_phase', ['inner_circle', 'close_family', 'community', 'financial_only', 'manual']);

export const legacyContacts = pgTable('legacy_contacts', {
  id: uuid('id').primaryKey().defaultRandom(),
  accountId: uuid('account_id').notNull().references(() => accounts.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  email: text('email'),
  phone: text('phone'),
  clerkUserId: text('clerk_user_id'),
  inviteStatus: inviteStatusEnum('invite_status').default('pending').notNull(),
  activationToken: text('activation_token'),
  inviteEmailedAt: timestamp('invite_emailed_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const notificationContacts = pgTable('notification_contacts', {
  id: uuid('id').primaryKey().defaultRandom(),
  accountId: uuid('account_id').notNull().references(() => accounts.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  email: text('email'),
  phone: text('phone'),
  relationship: text('relationship'),
  notifyPhase: notifyPhaseEnum('notify_phase').default('manual'),
  scheduledNotifyAt: timestamp('scheduled_notify_at'), // when this contact should be auto-notified (by phase)
  notified: boolean('notified').default(false),
  notifiedAt: timestamp('notified_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
