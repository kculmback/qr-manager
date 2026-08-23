import type { CodeContent, CodePayload } from "./registry";
import type { CodeMode, CodeType } from "./types";
import { CODE_TYPES } from "./registry";

/**
 * Pairs a row's `type` column with its `payload` jsonb so the two narrow
 * together.
 *
 * They are stored apart on purpose -- `type` is a real column so it can be
 * filtered and indexed, while the payload shape varies -- which the type system
 * has no way to know is coherent. Writes go through `codeContentSchema`, so the
 * pairing is guaranteed at the only point where it could break.
 */
export function toCodeContent(
  type: CodeType,
  payload: CodePayload,
): CodeContent {
  return { type, payload } as CodeContent;
}

/** Serializes a payload into the literal string a scanner reads. */
export function encodePayload(content: CodeContent): string {
  switch (content.type) {
    case "url":
      return CODE_TYPES.url.encode(content.payload);
    case "vcard":
      return CODE_TYPES.vcard.encode(content.payload);
    case "wifi":
      return CODE_TYPES.wifi.encode(content.payload);
    case "text":
      return CODE_TYPES.text.encode(content.payload);
    case "email":
      return CODE_TYPES.email.encode(content.payload);
    case "sms":
      return CODE_TYPES.sms.encode(content.payload);
    case "geo":
      return CODE_TYPES.geo.encode(content.payload);
  }
}

/**
 * The value actually encoded into the QR grid.
 *
 * A dynamic code encodes its short URL and nothing else -- that indirection is
 * the whole reason its destination can change after the code is printed. A
 * static code carries its payload literally and is fixed forever.
 */
export function encodeCodeValue(options: {
  content: CodeContent;
  mode: CodeMode;
  shortUrl: string;
}): string {
  return options.mode === "dynamic"
    ? options.shortUrl
    : encodePayload(options.content);
}

/**
 * The largest payload that still produces a scannable code.
 *
 * A QR code holds ~2,950 bytes at error correction level L and ~2,330 at M, and
 * anything near either is a dense grid that phones struggle with. 2,000 leaves
 * headroom and keeps codes readable at print size.
 *
 * Only static codes are measured against this: a dynamic code encodes its short
 * URL, so its payload size is irrelevant to the grid.
 */
export const MAX_ENCODED_BYTES = 2000;

/** Byte length of an encoded value -- QR capacity is bytes, not characters. */
export function encodedByteLength(value: string): number {
  return new TextEncoder().encode(value).length;
}

/** The public short link for a code, whether or not it currently uses it. */
export function buildShortUrl(shortUrlBase: string, slug: string): string {
  return `${shortUrlBase.replace(/\/+$/, "")}/r/${slug}`;
}
