import { pgTable, uuid, text, timestamp, boolean, pgEnum } from 'drizzle-orm/pg-core';

export const pathEnum = pgEnum('path', ['planning', 'grief']);
export const activationStatusEnum = pgEnum('activation_status', ['active', 'activated', 'grief_active']);

export const accounts = pgTable('accounts', {
  id: uuid('id').primaryKey().defaultRandom(),
  clerkUserId: text('clerk_user_id').notNull().unique(),
  path: pathEnum('path').notNull(),
  usState: text('us_state'),
  subjectName: text('subject_name'),
  activationStatus: activationStatusEnum('activation_status').default('active').notNull(),
  activatedAt: timestamp('activated_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const plannerProfiles = pgTable('planner_profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  accountId: uuid('account_id').notNull().references(() => accounts.id, { onDelete: 'cascade' }),
  dateOfBirth: text('date_of_birth'),
});

export const griefProfiles = pgTable('grief_profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  accountId: uuid('account_id').notNull().references(() => accounts.id, { onDelete: 'cascade' }),
  dateOfDeath: text('date_of_death'),
  relationshipToDeceased: text('relationship_to_deceased'),
});
