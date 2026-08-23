import type { TRPCRouterRecord } from "@trpc/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod/v4";

import { and, desc, eq } from "@qr-manager/db";
import { Code } from "@qr-manager/db/schema";
import {
  buildShortUrl,
  codeContentSchema,
  codeMediumSchema,
  codeModeSchema,
  encodeCodeValue,
  encodedByteLength,
  encodePayload,
  generateSlug,
  MAX_ENCODED_BYTES,
  slugSchema,
  supportsDynamic,
  toCodeContent,
} from "@qr-manager/validators";

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

/**
 * Adds the two derived values the client needs but must not compute itself:
 * the public short link, and the exact string encoded into the grid.
 *
 * Keeping `encodedValue` server-side means the QR preview is a pure function of
 * one string, and the frontend never has to re-implement a serializer.
 */
function toCodeView(code: CodeRow, shortUrlBase: string) {
  const content = toCodeContent(code.type, code.payload);
  const shortUrl = buildShortUrl(shortUrlBase, code.slug);

  return {
    ...code,
    content,
    shortUrl,
    encodedValue: encodeCodeValue({ content, mode: code.mode, shortUrl }),
  };
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
  all: protectedProcedure.query(async ({ ctx }) => {
    const codes = await ctx.db.query.Code.findMany({
      where: eq(Code.userId, ctx.session.user.id),
      orderBy: desc(Code.createdAt),
    });

    return codes.map((code) => toCodeView(code, ctx.shortUrlBase));
  }),

  byId: protectedProcedure
    .input(z.object({ id: z.uuid() }))
    .query(async ({ ctx, input }) => {
      const code = await ctx.db.query.Code.findFirst({
        // Scoped to the owner, not merely filtered afterwards. `NOT_FOUND`
        // rather than `FORBIDDEN` so this cannot be used to probe which ids
        // exist on other accounts.
        where: and(eq(Code.id, input.id), eq(Code.userId, ctx.session.user.id)),
      });

      if (!code) throw new TRPCError({ code: "NOT_FOUND" });

      return toCodeView(code, ctx.shortUrlBase);
    }),

  create: protectedProcedure
    .input(createCodeSchema)
    .mutation(async ({ ctx, input }) => {
      const values = {
        userId: ctx.session.user.id,
        name: input.name,
        medium: input.medium,
        mode: input.mode,
        type: input.content.type,
        payload: input.content.payload,
      };

      // A slug the user chose: a collision is theirs to resolve, so surface it
      // rather than silently handing them a different link.
      if (input.slug) {
        const [created] = await ctx.db
          .insert(Code)
          .values({ ...values, slug: input.slug })
          .onConflictDoNothing({ target: Code.slug })
          .returning();

        if (!created) throw SLUG_TAKEN;

        return toCodeView(created, ctx.shortUrlBase);
      }

      // A generated slug: a collision is pure chance, so draw again.
      for (let attempt = 0; attempt < SLUG_ATTEMPTS; attempt++) {
        const [created] = await ctx.db
          .insert(Code)
          .values({ ...values, slug: generateSlug() })
          .onConflictDoNothing({ target: Code.slug })
          .returning();

        if (created) return toCodeView(created, ctx.shortUrlBase);
      }

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Could not allocate a short link. Please try again.",
      });
    }),

  update: protectedProcedure
    .input(updateCodeSchema)
    .mutation(async ({ ctx, input }) => {
      let updated: CodeRow | undefined;

      try {
        [updated] = await ctx.db
          .update(Code)
          .set({
            // `medium` is deliberately absent: nothing can change it yet, and
            // defaulting it here would silently rewrite an NFC tag to "qr" the
            // first time someone edited it.
            name: input.name,
            mode: input.mode,
            type: input.content.type,
            payload: input.content.payload,
            ...(input.slug ? { slug: input.slug } : {}),
          })
          .where(
            and(eq(Code.id, input.id), eq(Code.userId, ctx.session.user.id)),
          )
          .returning();
      } catch (error) {
        // `onConflictDoNothing` has no UPDATE equivalent, so the unique index
        // on `slug` surfaces as a driver error instead.
        if (isUniqueViolation(error)) throw SLUG_TAKEN;
        throw error;
      }

      if (!updated) throw new TRPCError({ code: "NOT_FOUND" });

      return toCodeView(updated, ctx.shortUrlBase);
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
      const [deleted] = await ctx.db
        .delete(Code)
        .where(and(eq(Code.id, input.id), eq(Code.userId, ctx.session.user.id)))
        .returning({ id: Code.id });

      if (!deleted) throw new TRPCError({ code: "NOT_FOUND" });

      return deleted;
    }),
} satisfies TRPCRouterRecord;
