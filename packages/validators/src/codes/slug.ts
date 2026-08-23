import { z } from "zod/v4";

/**
 * Lowercase base32-ish alphabet with the lookalike characters removed
 * (`0`/`O`, `1`/`l`/`I`). Slugs end up in printed short URLs that people
 * sometimes type by hand, so ambiguity is a real cost.
 */
export const SLUG_ALPHABET = "23456789abcdefghjkmnpqrstuvwxyz";

export const SLUG_LENGTH = 8;

export const SLUG_MIN_LENGTH = 3;
export const SLUG_MAX_LENGTH = 64;

/**
 * Slugs a user may not claim. Short links live under `/r/`, so nothing here can
 * actually collide with a route today -- the list exists so that moving short
 * links to the origin root later does not retroactively break someone's code.
 */
export const RESERVED_SLUGS = new Set([
  "admin",
  "api",
  "auth",
  "codes",
  "health",
  "new",
  "r",
  "settings",
  "setup",
  "static",
]);

/**
 * A random, unguessable slug.
 *
 * Uses rejection sampling rather than `byte % ALPHABET.length`: 256 is not a
 * multiple of 31, so plain modulo would make the first few characters of the
 * alphabet measurably more likely than the rest.
 *
 * `crypto.getRandomValues` is a global in both Node 22 and the browser, which
 * keeps this module isomorphic -- importing `node:crypto` here would break the
 * frontend bundle, since the form UI shares this package.
 */
export function generateSlug(length: number = SLUG_LENGTH): string {
  const limit = Math.floor(256 / SLUG_ALPHABET.length) * SLUG_ALPHABET.length;

  let slug = "";
  const bytes = new Uint8Array(length * 2);

  while (slug.length < length) {
    crypto.getRandomValues(bytes);
    for (const byte of bytes) {
      // Biased tail of the byte range: draw again rather than fold it in.
      if (byte >= limit) continue;
      slug += SLUG_ALPHABET[byte % SLUG_ALPHABET.length];
      if (slug.length === length) break;
    }
  }

  return slug;
}

/** A user-supplied vanity slug: lowercase, no leading or trailing hyphen. */
export const slugSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(SLUG_MIN_LENGTH)
  .max(SLUG_MAX_LENGTH)
  .regex(
    /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/,
    "Use lowercase letters, numbers and hyphens, starting and ending with a letter or number.",
  )
  .refine((slug) => !RESERVED_SLUGS.has(slug), "That short link is reserved.");
