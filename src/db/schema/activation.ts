import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';
import { accounts } from './accounts';

export const activations = pgTable('activations', {
  id: uuid('id').primaryKey().defaultRandom(),
  accountId: uuid('account_id').notNull().references(() => accounts.id, { onDelete: 'cascade' }),
  triggeredByUserId: text('triggered_by_user_id').notNull(),
  verificationMethod: text('verification_method').default('mfa_sms'),
  status: text('status').default('pending'), // pending (in cancel window) | completed | cancelled
  cancelWindowExpiresAt: timestamp('cancel_window_expires_at'),
  activatedAt: timestamp('activated_at'), // when the cancel window closed and sends were processed
  completedAt: timestamp('completed_at'),
  cancelledAt: timestamp('cancelled_at'),
  familyAccessLevel: text('family_access_level').default('full'), // full | export_only
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const notificationLogs = pgTable('notification_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  activationId: uuid('activation_id').notNull().references(() => activations.id, { onDelete: 'cascade' }),
  contactId: uuid('contact_id'),
  channel: text('channel'), // email | sms
  type: text('type'),
  sentAt: timestamp('sent_at').defaultNow(),
  status: text('status'), // sent | failed | bounced
});
