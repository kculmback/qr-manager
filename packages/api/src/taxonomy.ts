import type { SQLWrapper } from "@qr-manager/db";
import type { Reader, Transaction } from "@qr-manager/db/client";
import { and, asc, count, eq, inArray, notExists, sql } from "@qr-manager/db";
import { Category, Code, CodeTag, Tag } from "@qr-manager/db/schema";
import { taxonomyKey } from "@qr-manager/validators";

/** A category or tag as the client sees it. */
export interface TaxonomyRef {
  id: string;
  name: string;
}

/** How a code is filed. Both halves are optional and independent. */
export interface CodeTaxonomy {
  category: TaxonomyRef | null;
  tags: TaxonomyRef[];
}

export const EMPTY_TAXONOMY: CodeTaxonomy = { category: null, tags: [] };

/**
 * Case-insensitive ordering, matching the expression the unique indexes are
 * built on. Plain `ORDER BY name` under a `C`-collated database would sort
 * `Zebra` before `apple`, which is not what a badge list should do.
 */
function byName(column: SQLWrapper) {
  return asc(sql`lower(${column})`);
}

/**
 * Finds the user's categories/tags with these names, creating any that are
 * missing, and returns them with the casing actually stored.
 *
 * Insert-then-select rather than select-then-insert-the-difference: a bare
 * `ON CONFLICT DO NOTHING` makes the insert a no-op for names that already
 * exist *or* that another request created a moment ago, so the select
 * afterwards is the single source of truth either way. Two requests racing to
 * use the same new tag both end up on the same row.
 *
 * Names are matched by `lower(...)`, the same expression as the unique index,
 * so `Lobby` and `lobby` resolve to one row -- whichever spelling got there
 * first is the one everyone sees.
 */
async function resolveNames(
  tx: Transaction,
  table: typeof Tag | typeof Category,
  userId: string,
  names: string[],
): Promise<TaxonomyRef[]> {
  if (names.length === 0) return [];

  await tx
    .insert(table)
    .values(names.map((name) => ({ userId, name })))
    .onConflictDoNothing();

  return tx
    .select({ id: table.id, name: table.name })
    .from(table)
    .where(
      and(
        eq(table.userId, userId),
        inArray(sql`lower(${table.name})`, names.map(taxonomyKey)),
      ),
    )
    .orderBy(byName(table.name));
}

export function resolveTags(
  tx: Transaction,
  userId: string,
  names: string[],
): Promise<TaxonomyRef[]> {
  return resolveNames(tx, Tag, userId, names);
}

export async function resolveCategory(
  tx: Transaction,
  userId: string,
  name: string | null,
): Promise<TaxonomyRef | null> {
  if (name === null) return null;
  const [category] = await resolveNames(tx, Category, userId, [name]);
  return category ?? null;
}

/** Replaces a code's tag links wholesale. */
export async function setCodeTags(
  tx: Transaction,
  codeId: string,
  tagIds: string[],
): Promise<void> {
  await tx.delete(CodeTag).where(eq(CodeTag.codeId, codeId));

  if (tagIds.length > 0) {
    await tx.insert(CodeTag).values(tagIds.map((tagId) => ({ codeId, tagId })));
  }
}

/**
 * Deletes the user's categories and tags that no longer file anything.
 *
 * Categories and tags exist only by being named on a code -- there is no
 * screen for creating one on its own -- so one attached to nothing has no
 * meaning left, and keeping it would slowly fill the suggestion lists with
 * labels the user has already abandoned. Run after any write that can detach
 * the last code.
 */
export async function pruneOrphanTaxonomy(
  tx: Transaction,
  userId: string,
): Promise<void> {
  await tx.delete(Tag).where(
    and(
      eq(Tag.userId, userId),
      notExists(
        tx
          .select({ one: sql`1` })
          .from(CodeTag)
          .where(eq(CodeTag.tagId, Tag.id)),
      ),
    ),
  );

  await tx.delete(Category).where(
    and(
      eq(Category.userId, userId),
      notExists(
        tx
          .select({ one: sql`1` })
          .from(Code)
          .where(eq(Code.categoryId, Category.id)),
      ),
    ),
  );
}

/**
 * The tags on each of these codes, keyed by code id.
 *
 * One query for the whole page rather than one per code: the list view renders
 * every code's badges, and a per-row lookup would make that N+1.
 */
export async function loadTagsByCode(
  db: Reader,
  codeIds: string[],
): Promise<Map<string, TaxonomyRef[]>> {
  const byCode = new Map<string, TaxonomyRef[]>();
  if (codeIds.length === 0) return byCode;

  const rows = await db
    .select({ codeId: CodeTag.codeId, id: Tag.id, name: Tag.name })
    .from(CodeTag)
    .innerJoin(Tag, eq(Tag.id, CodeTag.tagId))
    .where(inArray(CodeTag.codeId, codeIds))
    .orderBy(byName(Tag.name));

  for (const { codeId, ...tag } of rows) {
    const tags = byCode.get(codeId);
    if (tags) tags.push(tag);
    else byCode.set(codeId, [tag]);
  }

  return byCode;
}

/** Everything the user has filed things under, and how much is filed there. */
export async function listTaxonomy(db: Reader, userId: string) {
  const [categories, tags] = await Promise.all([
    db
      .select({
        id: Category.id,
        name: Category.name,
        codeCount: count(Code.id),
      })
      .from(Category)
      .leftJoin(Code, eq(Code.categoryId, Category.id))
      .where(eq(Category.userId, userId))
      .groupBy(Category.id, Category.name)
      .orderBy(byName(Category.name)),

    db
      .select({
        id: Tag.id,
        name: Tag.name,
        codeCount: count(CodeTag.codeId),
      })
      .from(Tag)
      .leftJoin(CodeTag, eq(CodeTag.tagId, Tag.id))
      .where(eq(Tag.userId, userId))
      .groupBy(Tag.id, Tag.name)
      .orderBy(byName(Tag.name)),
  ]);

  return { categories, tags };
}
