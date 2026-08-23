import { z } from "zod/v4";

/**
 * The physical carrier a code is printed or written onto.
 *
 * Only QR exists today; NFC tags are planned and reuse everything except the
 * encoding and the artwork. Keeping the medium on the record from the start
 * means adding NFC is a new value here rather than a second set of tables.
 */
export const CODE_MEDIUMS = ["qr", "nfc"] as const;
export type CodeMedium = (typeof CODE_MEDIUMS)[number];
export const codeMediumSchema = z.enum(CODE_MEDIUMS);

/**
 * Whether the encoded value points back at this backend (`dynamic`, so the
 * destination stays editable after the code is in the wild) or carries the
 * payload literally (`static`).
 *
 * Not every type can be dynamic: a phone joining a Wi-Fi network reads the
 * credentials while offline, so there is nobody to ask for a redirect. See
 * `supportsDynamic` on each registry entry.
 */
export const CODE_MODES = ["dynamic", "static"] as const;
export type CodeMode = (typeof CODE_MODES)[number];
export const codeModeSchema = z.enum(CODE_MODES);

/** Payload kinds, each with its own schema and serializer under `./<type>.ts`. */
export const CODE_TYPE_NAMES = [
  "url",
  "vcard",
  "wifi",
  "text",
  "email",
  "sms",
  "geo",
] as const;
export type CodeType = (typeof CODE_TYPE_NAMES)[number];
export const codeTypeSchema = z.enum(CODE_TYPE_NAMES);

/**
 * One payload kind: how to validate it, how to turn it into the string a
 * scanner reads, and whether it can be served through the redirect.
 */
export interface CodeTypeDef<T> {
  /** Human label for the type picker. */
  label: string;
  /** One line explaining what the type is for, shown under the picker. */
  description: string;
  schema: z.ZodType<T>;
  /** Serializes the payload into the literal string encoded into the code. */
  encode: (payload: T) => string;
  /** May this type use the `/r/:slug` redirect instead of a literal payload? */
  supportsDynamic: boolean;
  /** What a freshly created code of this type should default to. */
  defaultMode: CodeMode;
}
