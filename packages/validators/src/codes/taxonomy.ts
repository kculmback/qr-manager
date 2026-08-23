import { z } from "zod/v4";

/**
 * Categories and tags: the two ways a code can be filed.
 *
 * A code has at most one category and any number of tags, and both are
 * optional. Neither is QR-specific -- an NFC tag is filed the same way -- so
 * this lives beside the payload types rather than inside them.
 *
 * Both are user-scoped and created implicitly by naming them on a code. There
 * is no separate "manage your tags" step: a tag is a label on codes, so one
 * that labels nothing is deleted rather than kept around to clutter the
 * suggestion list.
 */

export const CATEGORY_NAME_MAX_LENGTH = 60;
export const TAG_NAME_MAX_LENGTH = 40;

/**
 * Enough to file a code without turning the list page into a wall of badges.
 * The cap is here so a paste of a hundred words fails as one clear message
 * rather than as a hundred rows.
 */
export const MAX_TAGS_PER_CODE = 20;

/**
 * Collapses the whitespace a name was typed with.
 *
 * Applied before storing and before comparing, so `"  Trade  show "` and
 * `"Trade show"` are the same name rather than two rows that look identical in
 * the UI. Case is *not* folded here -- the entered casing is what gets
 * displayed; see `taxonomyKey` for the comparison form.
 */
export function normalizeTaxonomyName(name: string): string {
  return name.trim().replace(/\s+/g, " ");
}

/**
 * The form two names are compared by. `Lobby` and `lobby` are one tag, and
 * whichever was created first supplies the casing everyone sees.
 *
 * The database enforces the same rule with a unique index on `lower(name)`, so
 * two requests racing to create the same tag cannot produce a duplicate.
 */
export function taxonomyKey(name: string): string {
  return normalizeTaxonomyName(name).toLowerCase();
}

const taxonomyName = (max: number) =>
  z
    .string()
    .transform(normalizeTaxonomyName)
    .pipe(z.string().min(1, "Give it a name.").max(max));

export const categoryNameSchema = taxonomyName(CATEGORY_NAME_MAX_LENGTH);
export const tagNameSchema = taxonomyName(TAG_NAME_MAX_LENGTH);

/**
 * A code's category as it arrives from a form: the name, or nothing.
 *
 * An empty string means "no category" rather than a validation failure -- it is
 * what an emptied text input submits, and clearing the field is a thing users
 * are meant to be able to do.
 */
export const codeCategoryInputSchema = z
  .string()
  .nullish()
  .transform((value) => {
    const name = normalizeTaxonomyName(value ?? "");
    return name === "" ? null : name;
  })
  .pipe(categoryNameSchema.nullable());

/** A code's tags, de-duplicated case-insensitively and capped. */
export const codeTagsInputSchema = z
  .array(z.string())
  .default([])
  .transform(dedupeTaxonomyNames)
  .pipe(
    z
      .array(tagNameSchema)
      .max(MAX_TAGS_PER_CODE, `Use at most ${MAX_TAGS_PER_CODE} tags.`),
  );

/**
 * Drops blanks and repeats, keeping the first spelling of each name.
 *
 * Shared with the tag input so the browser and the server agree on what "the
 * same tag" means -- the field can refuse to add a duplicate for the same
 * reason the server would have collapsed it.
 */
export function dedupeTaxonomyNames(names: readonly string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const raw of names) {
    const name = normalizeTaxonomyName(raw);
    if (name === "") continue;

    const key = taxonomyKey(name);
    if (seen.has(key)) continue;

    seen.add(key);
    result.push(name);
  }

  return result;
}
