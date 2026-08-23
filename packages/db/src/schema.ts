import { sql } from "drizzle-orm";
import { index, pgTable, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

import type { CodePayload } from "@qr-manager/validators";
import {
  CATEGORY_NAME_MAX_LENGTH,
  CODE_MEDIUMS,
  CODE_MODES,
  CODE_TYPE_NAMES,
  TAG_NAME_MAX_LENGTH,
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
 * A folder-like grouping. A code belongs to at most one.
 *
 * Scoped to its owner, and unique per owner case-insensitively -- naming a
 * category `Lobby` on one code and `lobby` on another files both under the
 * first spelling rather than creating two categories that look the same.
 */
export const Category = pgTable(
  "category",
  (t) => ({
    id: t.uuid().notNull().primaryKey().defaultRandom(),
    userId: t
      .text()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    name: t.varchar({ length: CATEGORY_NAME_MAX_LENGTH }).notNull(),
    createdAt: t.timestamp().defaultNow().notNull(),
  }),
  (table) => [
    uniqueIndex("category_user_id_name_unique").on(
      table.userId,
      sql`lower(${table.name})`,
    ),
  ],
);

/** A free-form label. A code carries any number of them. */
export const Tag = pgTable(
  "tag",
  (t) => ({
    id: t.uuid().notNull().primaryKey().defaultRandom(),
    userId: t
      .text()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    name: t.varchar({ length: TAG_NAME_MAX_LENGTH }).notNull(),
    createdAt: t.timestamp().defaultNow().notNull(),
  }),
  (table) => [
    uniqueIndex("tag_user_id_name_unique").on(
      table.userId,
      sql`lower(${table.name})`,
    ),
  ],
);

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
     * `set null` rather than `cascade`: deleting a category is a filing
     * decision, not a decision to delete the codes filed under it.
     */
    categoryId: t
      .uuid()
      .references(() => Category.id, { onDelete: "set null" }),

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
  (table) => [
    index("code_user_id_idx").on(table.userId),
    index("code_category_id_idx").on(table.categoryId),
  ],
);

/**
 * Which tags are on which codes.
 *
 * The composite primary key is the de-duplication: applying the same tag twice
 * is a no-op rather than a second row. The extra index covers the other
 * direction -- listing the codes carrying a given tag.
 */
export const CodeTag = pgTable(
  "code_tag",
  (t) => ({
    codeId: t
      .uuid()
      .notNull()
      .references(() => Code.id, { onDelete: "cascade" }),
    tagId: t
      .uuid()
      .notNull()
      .references(() => Tag.id, { onDelete: "cascade" }),
  }),
  (table) => [
    primaryKey({ columns: [table.codeId, table.tagId] }),
    index("code_tag_tag_id_idx").on(table.tagId),
  ],
);

export * from "./auth-schema";
