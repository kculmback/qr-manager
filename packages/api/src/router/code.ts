import type { TRPCRouterRecord } from "@trpc/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod/v4";

import type { Transaction } from "@qr-manager/db/client";
import { and, count, desc, eq, getTableColumns, sql } from "@qr-manager/db";
import { Category, Code } from "@qr-manager/db/schema";
import {
  buildShortUrl,
  codeCategoryInputSchema,
  codeContentSchema,
  codeListInputSchema,
  codeLogoSchema,
  codeMediumSchema,
  codeModeSchema,
  codeStyleSchema,
  codeTagsInputSchema,
  encodeCodeValue,
  encodedByteLength,
  encodePayload,
  generateSlug,
  MAX_ENCODED_BYTES,
  slugSchema,
  supportsDynamic,
  toCodeContent,
} from "@qr-manager/validators";

import type { CodeTaxonomy } from "../taxonomy";
import { compileCodeFilter } from "../code-filter";
import {
  EMPTY_TAXONOMY,
  loadTagsByCode,
  pruneOrphanTaxonomy,
  resolveCategory,
  resolveTags,
  setCodeTags,
} from "../taxonomy";
import { protectedProcedure } from "../trpc";

/**
 * How many times to retry a randomly generated slug before giving up. A
 * collision needs two of ~31^8 draws to land on the same value, so anything
 * past the first attempt already means something is badly wrong.
 */
const SLUG_ATTEMPTS = 5;

const codeFieldsSchema = z
  .object({
    name: z.string().trim().min(1, "Give the code a name.").max(120),
    mode: codeModeSchema,
    content: codeContentSchema,
    /** Colours and logo size. Artwork only -- never the encoded value. */
    style: codeStyleSchema,
    /** Base64 data URI for the logo in the middle, or null for none. */
    logo: codeLogoSchema.nullable().default(null),
    /** Category name, not id -- an unknown one is created. Null clears it. */
    category: codeCategoryInputSchema,
    /** Tag names, likewise. Anything left unused afterwards is cleaned up. */
    tags: codeTagsInputSchema,
  })
  .refine(
    (input) => input.mode === "static" || supportsDynamic(input.content.type),
    {
      message:
        "This type has to be static -- the scanner reads it without contacting the server.",
      path: ["mode"],
    },
  )
  .refine(
    (input) =>
      input.mode === "dynamic" ||
      encodedByteLength(encodePayload(input.content)) <= MAX_ENCODED_BYTES,
    {
      // Only static codes carry their payload in the grid; a dynamic one
      // encodes a short URL however large its payload is.
      message: "There is too much content here to fit in a scannable code.",
      path: ["content"],
    },
  );

const createCodeSchema = z.intersection(
  codeFieldsSchema,
  z.object({
    medium: codeMediumSchema.default("qr"),
    slug: slugSchema.optional(),
  }),
);

const updateCodeSchema = z.intersection(
  codeFieldsSchema,
  z.object({
    id: z.uuid(),
    /** Omit to keep the existing short link. Changing it breaks printed codes. */
    slug: slugSchema.optional(),
  }),
);

type CodeRow = typeof Code.$inferSelect;

/** The columns `toCodeView` reads. Generic so the list can leave `logo` out. */
type EncodableRow = Pick<CodeRow, "type" | "payload" | "mode" | "slug">;

/**
 * Adds the two derived values the client needs but must not compute itself:
 * the public short link, and the exact string encoded into the grid.
 *
 * Keeping `encodedValue` server-side means the QR preview is a pure function of
 * one string, and the frontend never has to re-implement a serializer.
 *
 * Generic in the row rather than taking a whole `CodeRow`, so the list can hand
 * it a row with the logo column left unselected and still get its own extra
 * columns back out.
 */
function toCodeView<TRow extends EncodableRow>(
  code: TRow,
  shortUrlBase: string,
  taxonomy: CodeTaxonomy = EMPTY_TAXONOMY,
) {
  const content = toCodeContent(code.type, code.payload);
  const shortUrl = buildShortUrl(shortUrlBase, code.slug);

  return {
    ...code,
    ...taxonomy,
    content,
    shortUrl,
    encodedValue: encodeCodeValue({ content, mode: code.mode, shortUrl }),
  };
}

/**
 * Turns the category and tag *names* a form submitted into rows, creating
 * whichever do not exist yet.
 *
 * Names rather than ids because that is what the user typed: the form offers
 * existing ones as suggestions but does not make the user create a category
 * before they can use it. Runs inside the caller's transaction so a code and
 * its filing either both land or neither does.
 */
async function resolveTaxonomy(
  tx: Transaction,
  userId: string,
  input: { category: string | null; tags: string[] },
): Promise<CodeTaxonomy> {
  const [category, tags] = await Promise.all([
    resolveCategory(tx, userId, input.category),
    resolveTags(tx, userId, input.tags),
  ]);

  return { category, tags };
}

/**
 * The category columns a code query joins in.
 *
 * Just the two the client needs, not the whole table: drizzle collapses a
 * left join with no match to `null` for the group as a whole, so an
 * uncategorised code reads as `category: null` rather than an object of nulls.
 */
const categorySelection = { id: Category.id, name: Category.name };

/**
 * The code columns the list selects: everything except the logo.
 *
 * A logo is a base64 image on the row, and a page is 25 rows -- selecting it
 * here would put megabytes on the wire to draw thumbnails far too small to show
 * one. `hasLogo` is what the list actually needs: a thumbnail still has to know
 * whether the real code was encoded at the higher error correction level a
 * logo forces, or its module pattern would not match the code it stands for.
 */
const { logo: _logo, ...listCodeColumns } = getTableColumns(Code);

const listCodeSelection = {
  ...listCodeColumns,
  hasLogo: sql<boolean>`${Code.logo} is not null`,
};

/** Slug candidates to try in order. A collision is pure chance, so draw again. */
function* slugDraws(): Generator<string> {
  for (let attempt = 0; attempt < SLUG_ATTEMPTS; attempt++) {
    yield generateSlug();
  }
}

/** Postgres `unique_violation`. */
function isUniqueViolation(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: unknown }).code === "23505"
  );
}

const SLUG_TAKEN = new TRPCError({
  code: "CONFLICT",
  message: "That short link is already taken.",
});

export const codeRouter = {
  /**
   * One page of the user's codes, newest first, narrowed by the list's filter.
   *
   * Both halves are the server's job because they are the same job: a filter
   * applied after the LIMIT would narrow a page rather than the list, so the
   * bar's query is compiled into this statement's `WHERE` -- see
   * `compileCodeFilter`.
   */
  list: protectedProcedure
    .input(codeListInputSchema)
    .query(async ({ ctx, input }) => {
      const where = and(
        // Scoped to the owner first, so no filter the client sends can widen
        // what the query can reach.
        eq(Code.userId, ctx.session.user.id),
        input.filter && compileCodeFilter(ctx.db, input.filter),
      );

      const [totals] = await ctx.db
        .select({ total: count() })
        .from(Code)
        .where(where);

      const total = totals?.total ?? 0;
      const pageCount = Math.max(1, Math.ceil(total / input.perPage));

      // Clamped rather than honoured: a bookmarked page 5 of a list that has
      // since shrunk to three pages should show the last page, not an empty
      // one that reads as "nothing matches".
      const page = Math.min(input.page, pageCount);

      // The category comes along in the join; the tags cannot, since a code has
      // many of them and the join would multiply the rows -- which would also
      // make the LIMIT count join output instead of codes. One extra query for
      // the whole page instead.
      const rows = await ctx.db
        .select({ code: listCodeSelection, category: categorySelection })
        .from(Code)
        .leftJoin(Category, eq(Category.id, Code.categoryId))
        .where(where)
        // `createdAt` alone is not a total order -- a seeded or scripted batch
        // can share a timestamp, and rows tied across a page boundary would
        // appear twice or not at all. `id` breaks the tie.
        .orderBy(desc(Code.createdAt), desc(Code.id))
        .limit(input.perPage)
        .offset((page - 1) * input.perPage);

      const tagsByCode = await loadTagsByCode(
        ctx.db,
        rows.map((row) => row.code.id),
      );

      return {
        codes: rows.map((row) =>
          toCodeView(row.code, ctx.shortUrlBase, {
            category: row.category,
            tags: tagsByCode.get(row.code.id) ?? [],
          }),
        ),
        page,
        perPage: input.perPage,
        total,
        pageCount,
      };
    }),

  byId: protectedProcedure
    .input(z.object({ id: z.uuid() }))
    .query(async ({ ctx, input }) => {
      const [row] = await ctx.db
        .select({ code: Code, category: categorySelection })
        .from(Code)
        .leftJoin(Category, eq(Category.id, Code.categoryId))
        // Scoped to the owner, not merely filtered afterwards. `NOT_FOUND`
        // rather than `FORBIDDEN` so this cannot be used to probe which ids
        // exist on other accounts.
        .where(
          and(eq(Code.id, input.id), eq(Code.userId, ctx.session.user.id)),
        );

      if (!row) throw new TRPCError({ code: "NOT_FOUND" });

      const tagsByCode = await loadTagsByCode(ctx.db, [row.code.id]);

      return toCodeView(row.code, ctx.shortUrlBase, {
        category: row.category,
        tags: tagsByCode.get(row.code.id) ?? [],
      });
    }),

  create: protectedProcedure
    .input(createCodeSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      // One transaction for the code, its category and its tag links: a code
      // that saved without its filing, or a tag created for a code that never
      // landed, are both states the UI has no way to show or repair.
      return ctx.db.transaction(async (tx) => {
        const taxonomy = await resolveTaxonomy(tx, userId, input);

        const values = {
          userId,
          name: input.name,
          medium: input.medium,
          mode: input.mode,
          type: input.content.type,
          payload: input.content.payload,
          style: input.style,
          logo: input.logo,
          categoryId: taxonomy.category?.id ?? null,
        };

        // A slug the user chose: a collision is theirs to resolve, so surface
        // it rather than silently handing them a different link.
        //
        // `onConflictDoNothing` rather than letting the unique index raise:
        // inside a transaction a raised error would poison every statement
        // after it, taking the tags down with a recoverable slug clash.
        const attempts = input.slug ? [input.slug] : slugDraws();

        for (const slug of attempts) {
          const [created] = await tx
            .insert(Code)
            .values({ ...values, slug })
            .onConflictDoNothing({ target: Code.slug })
            .returning();

          if (!created) continue;

          await setCodeTags(
            tx,
            created.id,
            taxonomy.tags.map((tag) => tag.id),
          );

          return toCodeView(created, ctx.shortUrlBase, taxonomy);
        }

        if (input.slug) throw SLUG_TAKEN;

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Could not allocate a short link. Please try again.",
        });
      });
    }),

  update: protectedProcedure
    .input(updateCodeSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      try {
        return await ctx.db.transaction(async (tx) => {
          const taxonomy = await resolveTaxonomy(tx, userId, input);

          const [updated] = await tx
            .update(Code)
            .set({
              // `medium` is deliberately absent: nothing can change it yet, and
              // defaulting it here would silently rewrite an NFC tag to "qr" the
              // first time someone edited it.
              name: input.name,
              mode: input.mode,
              type: input.content.type,
              payload: input.content.payload,
              style: input.style,
              logo: input.logo,
              categoryId: taxonomy.category?.id ?? null,
              ...(input.slug ? { slug: input.slug } : {}),
            })
            .where(and(eq(Code.id, input.id), eq(Code.userId, userId)))
            .returning();

          if (!updated) throw new TRPCError({ code: "NOT_FOUND" });

          await setCodeTags(
            tx,
            updated.id,
            taxonomy.tags.map((tag) => tag.id),
          );

          // The edit may have been the last use of a category or tag.
          await pruneOrphanTaxonomy(tx, userId);

          return toCodeView(updated, ctx.shortUrlBase, taxonomy);
        });
      } catch (error) {
        // `onConflictDoNothing` has no UPDATE equivalent, so the unique index
        // on `slug` surfaces as a driver error instead.
        if (isUniqueViolation(error)) throw SLUG_TAKEN;
        throw error;
      }
    }),

  /**
   * Removes the code and, with it, its short link.
   *
   * There is no separate redirect record to clean up: `/r/:slug` resolves by
   * looking the row up on every request and the response is `no-store`, so the
   * link is dead the moment this statement commits. A static code is a
   * different story -- its content is in the printed image, and deleting it
   * here cannot reach that. See `DeleteCodeDialog`, which says so.
   */
  delete: protectedProcedure
    .input(z.object({ id: z.uuid() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      return ctx.db.transaction(async (tx) => {
        // The tag links go with it: `code_tag.code_id` cascades.
        const [deleted] = await tx
          .delete(Code)
          .where(and(eq(Code.id, input.id), eq(Code.userId, userId)))
          .returning({ id: Code.id });

        if (!deleted) throw new TRPCError({ code: "NOT_FOUND" });

        // This may have been the only code under its category or tags.
        await pruneOrphanTaxonomy(tx, userId);

        return deleted;
      });
    }),
} satisfies TRPCRouterRecord;
