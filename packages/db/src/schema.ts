import { sql } from "drizzle-orm";
import { index, pgTable } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

import type { CodePayload } from "@qr-manager/validators";
import {
  CODE_MEDIUMS,
  CODE_MODES,
  CODE_TYPE_NAMES,
} from "@qr-manager/validators";

import { user } from "./auth-schema";

export const Post = pgTable("post", (t) => ({
  id: t.uuid().notNull().primaryKey().defaultRandom(),
  title: t.varchar({ length: 256 }).notNull(),
  content: t.text().notNull(),
  createdAt: t.timestamp().defaultNow().notNull(),
  updatedAt: t
    .timestamp({ mode: "date", withTimezone: true })
    .$onUpdateFn(() => sql`now()`),
}));

export const CreatePostSchema = createInsertSchema(Post, {
  title: z.string().max(256),
  content: z.string().max(256),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

/**
 * A code someone has created: what it points at, and how it is encoded.
 *
 * Deliberately *not* named `QrCode`. NFC tags are planned, and they reuse
 * everything here -- the payload types, the dynamic redirect, and later the
 * scan records and actions. Only the encoding and the artwork are specific to
 * QR, so the medium is a column rather than a separate table.
 */
export const Code = pgTable(
  "code",
  (t) => ({
    id: t.uuid().notNull().primaryKey().defaultRandom(),
    userId: t
      .text()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),

    // `text({ enum })` rather than `pgEnum`: NFC and further payload types are
    // a matter of when, not if, and `ALTER TYPE ... ADD VALUE` cannot use the
    // new value in the same transaction that adds it -- which is exactly how
    // drizzle applies migrations. The TypeScript type is narrowed either way.
    medium: t.text({ enum: CODE_MEDIUMS }).notNull().default("qr"),
    type: t.text({ enum: CODE_TYPE_NAMES }).notNull(),
    mode: t.text({ enum: CODE_MODES }).notNull(),

    name: t.varchar({ length: 120 }).notNull(),

    /**
     * The short-link segment served at `/r/:slug`.
     *
     * Present on every code, static ones included: flipping a code from static
     * to dynamic then keeps the short link it already had, and the redirect
     * lookup never has to reason about nulls.
     */
    slug: t.text().notNull().unique(),

    /**
     * The type-specific payload. Its shape is discriminated by `type`, and both
     * are validated together by `codeContentSchema` on every write.
     */
    payload: t.jsonb().$type<CodePayload>().notNull(),

    createdAt: t.timestamp().defaultNow().notNull(),
    updatedAt: t
      .timestamp({ mode: "date", withTimezone: true })
      .$onUpdateFn(() => sql`now()`),
  }),
  (table) => [index("code_user_id_idx").on(table.userId)],
);

export * from "./auth-schema";
