import { pgTable, uuid, text, timestamp, boolean, pgEnum } from 'drizzle-orm/pg-core';

// NOTE: the type name must NOT be 'path' — Postgres has a built-in geometric
// type named `path`, and the collision caused the column to be created with the
// wrong type (breaking all account inserts). Keep this named `account_path`.
export const pathEnum = pgEnum('account_path', ['planning', 'grief']);
export const planForEnum = pgEnum('plan_for', ['self', 'other']);
export const proxyConsentMethodEnum = pgEnum('proxy_consent_method', [
  'not_required',
  'family_attestation',
  'sms_pending',
]);
export const activationStatusEnum = pgEnum('activation_status', ['active', 'activation_pending', 'activated', 'grief_active']);

export const accounts = pgTable('accounts', {
  id: uuid('id').primaryKey().defaultRandom(),
  /** @deprecated Prefer account_memberships — kept for legacy rows during migration */
  clerkUserId: text('clerk_user_id'),
  ownerEmail: text('owner_email'),
  marketingOptIn: boolean('marketing_opt_in').default(true).notNull(),
  path: pathEnum('path').notNull(),
  planFor: planForEnum('plan_for').default('self').notNull(),
  proxyRelationship: text('proxy_relationship'),
  proxyConsentMethod: proxyConsentMethodEnum('proxy_consent_method').default('not_required').notNull(),
  proxySubjectPhone: text('proxy_subject_phone'),
  proxyConsentedAt: timestamp('proxy_consented_at'),
  usState: text('us_state'),
  subjectName: text('subject_name'),
  activationStatus: activationStatusEnum('activation_status').default('active').notNull(),
  activatedAt: timestamp('activated_at'),
  portalToken: text('portal_token'), // public memorial portal slug
  deletionRequestedAt: timestamp('deletion_requested_at'), // self-service deletion request
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
