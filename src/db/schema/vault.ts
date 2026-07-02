import { pgTable, uuid, text, boolean, timestamp, jsonb } from 'drizzle-orm/pg-core';
import { accounts } from './accounts';

export const financialAccounts = pgTable('financial_accounts', {
  id: uuid('id').primaryKey().defaultRandom(),
  accountId: uuid('account_id').notNull().references(() => accounts.id, { onDelete: 'cascade' }),
  category: text('category').notNull(), // bank | credit_card | insurance | investment | property | vehicle | digital | other | government | funeral
  institutionName: text('institution_name').notNull(),
  accountType: text('account_type'),
  lastFour: text('last_four'), // last 4 digits only — never full account numbers
  whoToCall: text('who_to_call'),
  purposeNotes: text('purpose_notes'),
  paperworkLocation: text('paperwork_location'),
  companyGuideId: text('company_guide_id'),
  details: jsonb('details').$type<Record<string, string | null> | null>(),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const letters = pgTable('letters', {
  id: uuid('id').primaryKey().defaultRandom(),
  accountId: uuid('account_id').notNull().references(() => accounts.id, { onDelete: 'cascade' }),
  recipientName: text('recipient_name').notNull(),
  recipientEmail: text('recipient_email'),
  subject: text('subject'),
  body: text('body').notNull(), // encrypted at application layer before storage
  releaseTiming: text('release_timing').default('immediate'), // immediate | delayed | date
  deliveryStatus: text('delivery_status').default('pending'), // pending | scheduled | sent | skipped | failed
  scheduledReleaseAt: timestamp('scheduled_release_at'), // when a delayed/held letter should be sent
  releasedAt: timestamp('released_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const photos = pgTable('photos', {
  id: uuid('id').primaryKey().defaultRandom(),
  accountId: uuid('account_id').notNull().references(() => accounts.id, { onDelete: 'cascade' }),
  storageKey: text('storage_key').notNull(), // full Vercel Blob public URL
  caption: text('caption'),
  forService: boolean('for_service').default(false),
  uploadedBy: text('uploaded_by').default('planner'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const documents = pgTable('documents', {
  id: uuid('id').primaryKey().defaultRandom(),
  accountId: uuid('account_id').notNull().references(() => accounts.id, { onDelete: 'cascade' }),
  storageKey: text('storage_key').notNull(), // full Vercel Blob URL
  fileName: text('file_name').notNull(),
  category: text('category'), // will | trust | id | insurance | property | other
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const rememberEntries = pgTable('remember_entries', {
  id: uuid('id').primaryKey().defaultRandom(),
  accountId: uuid('account_id').notNull().references(() => accounts.id, { onDelete: 'cascade' }),
  kind: text('kind').notNull(), // photo | voice_video | music | speaker | obituary_note
  storageKey: text('storage_key'), // blob-backed assets only
  fileName: text('file_name'),
  title: text('title'),
  recipient: text('recipient'),
  deliveryTarget: text('delivery_target'), // portal | private | both
  body: text('body'),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const obituary = pgTable('obituaries', {
  id: uuid('id').primaryKey().defaultRandom(),
  accountId: uuid('account_id').notNull().references(() => accounts.id, { onDelete: 'cascade' }).unique(),
  name: text('name'),
  born: text('born'),
  died: text('died'),
  city: text('city'),
  survived: text('survived'),
  predeceased: text('predeceased'),
  body: text('body'),
  published: boolean('published').default(false),
  publishedAt: timestamp('published_at'),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const serviceDetails = pgTable('service_details', {
  id: uuid('id').primaryKey().defaultRandom(),
  accountId: uuid('account_id').notNull().references(() => accounts.id, { onDelete: 'cascade' }).unique(),
  type: text('type'),
  date: text('date'),
  time: text('time'),
  venue: text('venue'),
  address: text('address'),
  parking: text('parking'),
  dresscode: text('dresscode'),
  officiant: text('officiant'),
  reception: boolean('reception').default(false),
  receptionVenue: text('reception_venue'),
  receptionAddress: text('reception_address'),
  receptionTime: text('reception_time'),
  livestreamUrl: text('livestream_url'),
  notes: text('notes'),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const portalSettings = pgTable('portal_settings', {
  id: uuid('id').primaryKey().defaultRandom(),
  accountId: uuid('account_id').notNull().references(() => accounts.id, { onDelete: 'cascade' }).unique(),
  theme: jsonb('theme'),
  gallery: jsonb('gallery'),
  guestbook: jsonb('guestbook'),
  waysToHelp: jsonb('ways_to_help'),
  gifts: jsonb('gifts'),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
