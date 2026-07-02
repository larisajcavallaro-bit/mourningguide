import { pgTable, uuid, text, timestamp, pgEnum, uniqueIndex } from 'drizzle-orm/pg-core';
import { accounts } from './accounts';

export const collaboratorStatusEnum = pgEnum('collaborator_status', ['pending', 'active']);

export const accountCollaborators = pgTable(
  'account_collaborators',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    accountId: uuid('account_id')
      .notNull()
      .references(() => accounts.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    email: text('email').notNull(),
    clerkUserId: text('clerk_user_id'),
    inviteToken: text('invite_token').notNull(),
    status: collaboratorStatusEnum('status').default('pending').notNull(),
    invitedByClerkUserId: text('invited_by_clerk_user_id').notNull(),
    inviteEmailedAt: timestamp('invite_emailed_at'),
    acceptedAt: timestamp('accepted_at'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    accountEmailUnique: uniqueIndex('account_collaborators_account_email_unique').on(
      table.accountId,
      table.email,
    ),
    inviteTokenUnique: uniqueIndex('account_collaborators_invite_token_unique').on(
      table.inviteToken,
    ),
  }),
);
