import type { TRPCRouterRecord } from "@trpc/server";

import { listTaxonomy } from "../taxonomy";
import { protectedProcedure } from "../trpc";

/**
 * The user's categories and tags.
 *
 * Read-only. Both are created by naming them on a code and deleted when the
 * last code stops using them, so there is nothing here to mutate -- this exists
 * to feed the suggestions in the code form and the counts beside them.
 */
export const taxonomyRouter = {
  all: protectedProcedure.query(({ ctx }) =>
    listTaxonomy(ctx.db, ctx.session.user.id),
  ),
} satisfies TRPCRouterRecord;
