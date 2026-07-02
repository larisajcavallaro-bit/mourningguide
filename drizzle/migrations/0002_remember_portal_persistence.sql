-- Persistence for restored Remember creative pages and Portal option pages.
-- This adds one generalized remember table for all Remember-only entries and
-- one account-scoped portal settings table for option-state that is currently
-- browser-local only.

CREATE TABLE IF NOT EXISTS "remember_entries" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "account_id" uuid NOT NULL REFERENCES "accounts"("id") ON DELETE cascade,
  "kind" text NOT NULL,
  "storage_key" text,
  "file_name" text,
  "title" text,
  "recipient" text,
  "delivery_target" text,
  "body" text,
  "metadata" jsonb,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "portal_settings" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "account_id" uuid NOT NULL UNIQUE REFERENCES "accounts"("id") ON DELETE cascade,
  "theme" jsonb,
  "gallery" jsonb,
  "guestbook" jsonb,
  "ways_to_help" jsonb,
  "gifts" jsonb,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
