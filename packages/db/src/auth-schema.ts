import { index, pgTable } from "drizzle-orm/pg-core";

export const user = pgTable("user", (t) => ({
  id: t.text().primaryKey(),
  name: t.text().notNull(),
  email: t.text().notNull().unique(),
  emailVerified: t.boolean().notNull(),
  image: t.text(),
  createdAt: t.timestamp().notNull(),
  updatedAt: t.timestamp().notNull(),
  // Added by the better-auth `admin` plugin.
  role: t.text(),
  banned: t.boolean(),
  banReason: t.text(),
  banExpires: t.timestamp(),
}));

export const session = pgTable("session", (t) => ({
  id: t.text().primaryKey(),
  expiresAt: t.timestamp().notNull(),
  token: t.text().notNull().unique(),
  createdAt: t.timestamp().notNull(),
  updatedAt: t.timestamp().notNull(),
  ipAddress: t.text(),
  userAgent: t.text(),
  userId: t
    .text()
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  // Added by the better-auth `admin` plugin: the admin behind an
  // impersonated session.
  impersonatedBy: t.text(),
}));

export const account = pgTable("account", (t) => ({
  id: t.text().primaryKey(),
  accountId: t.text().notNull(),
  providerId: t.text().notNull(),
  // better-auth 1.7 scopes account identity by issuer. Providers without an
  // issuer of their own get a synthetic one: `local:credential` for
  // email + password, `local:oauth:<provider>` for OAuth.
  // @see https://better-auth.com/docs/guides/1-7-upgrade-guide#account-identity-is-scoped-by-issuer
  issuer: t.text().notNull(),
  userId: t
    .text()
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: t.text(),
  refreshToken: t.text(),
  idToken: t.text(),
  accessTokenExpiresAt: t.timestamp(),
  refreshTokenExpiresAt: t.timestamp(),
  scope: t.text(),
  password: t.text(),
  createdAt: t.timestamp().notNull(),
  updatedAt: t.timestamp().notNull(),
}));

export const verification = pgTable("verification", (t) => ({
  id: t.text().primaryKey(),
  identifier: t.text().notNull(),
  value: t.text().notNull(),
  expiresAt: t.timestamp().notNull(),
  createdAt: t.timestamp(),
  updatedAt: t.timestamp(),
}));

// Added by the better-auth `passkey` plugin: one row per registered WebAuthn
// credential.
export const passkey = pgTable(
  "passkey",
  (t) => ({
    id: t.text().primaryKey(),
    /** User-facing label, e.g. "MacBook Touch ID". */
    name: t.text(),
    publicKey: t.text().notNull(),
    userId: t
      .text()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    credentialID: t.text().notNull(),
    counter: t.integer().notNull(),
    deviceType: t.text().notNull(),
    backedUp: t.boolean().notNull(),
    /** Comma-separated WebAuthn transports, e.g. `internal,hybrid`. */
    transports: t.text(),
    createdAt: t.timestamp(),
    /** Authenticator model identifier, used to name and icon the credential. */
    aaguid: t.text(),
  }),
  // Every passkey sign-in resolves the credential the browser returned, so
  // this lookup is on the hot auth path.
  (table) => [index("passkey_credential_id_idx").on(table.credentialID)],
);
