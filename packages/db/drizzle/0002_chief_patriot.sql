-- Added by hand: drizzle generates a plain `ADD COLUMN ... NOT NULL`, which
-- Postgres rejects on a table that already has rows. better-auth's own
-- guidance for this column is add-nullable, backfill, then constrain.
-- @see https://better-auth.com/docs/guides/1-7-upgrade-guide#account-identity-is-scoped-by-issuer
ALTER TABLE "account" ADD COLUMN "issuer" text;--> statement-breakpoint
UPDATE "account" SET "issuer" = CASE
  WHEN "provider_id" = 'credential' THEN 'local:credential'
  ELSE 'local:oauth:' || "provider_id"
END WHERE "issuer" IS NULL;--> statement-breakpoint
ALTER TABLE "account" ALTER COLUMN "issuer" SET NOT NULL;
