import { pgTable, uuid, text, timestamp, pgEnum, uniqueIndex } from 'drizzle-orm/pg-core';
import { accounts } from './accounts';

export const membershipRoleEnum = pgEnum('membership_role', ['owner', 'admin', 'successor']);

export const accountMemberships = pgTable(
  'account_memberships',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    clerkUserId: text('clerk_user_id').notNull(),
    accountId: uuid('account_id')
      .notNull()
      .references(() => accounts.id, { onDelete: 'cascade' }),
    role: membershipRoleEnum('role').default('owner').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    userAccountUnique: uniqueIndex('account_memberships_user_account_unique').on(
      table.clerkUserId,
      table.accountId,
    ),
  }),
);
