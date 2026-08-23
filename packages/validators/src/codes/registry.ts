import { z } from "zod/v4";

import type { CodeType } from "./types";
import { emailPayloadSchema, emailType } from "./email";
import { geoPayloadSchema, geoType } from "./geo";
import { smsPayloadSchema, smsType } from "./sms";
import { textPayloadSchema, textType } from "./text";
import { CODE_TYPE_NAMES } from "./types";
import { urlPayloadSchema, urlType } from "./url";
import { vcardPayloadSchema, vcardType } from "./vcard";
import { wifiPayloadSchema, wifiType } from "./wifi";

/**
 * Every payload kind, keyed by the value stored in `code.type`.
 *
 * Deliberately not annotated as `Record<CodeType, CodeTypeDef<unknown>>`: each
 * entry's `encode` takes its own payload type, and widening the record would
 * erase that. `satisfies` below still checks that every type is present.
 */
export const CODE_TYPES = {
  url: urlType,
  vcard: vcardType,
  wifi: wifiType,
  text: textType,
  email: emailType,
  sms: smsType,
  geo: geoType,
};

// Presence check only: asserts every `CodeType` has an entry. The value type is
// `unknown` because each entry's `encode` is contravariant in its own payload,
// so any shared supertype would reject all of them.
const _everyTypeRegistered: Record<CodeType, unknown> = CODE_TYPES;
void _everyTypeRegistered;

/**
 * A payload together with the discriminator that says how to read it. The API
 * validates the pair as a unit, so a Wi-Fi payload can never be stored against
 * `type: "url"`.
 */
export const codeContentSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("url"), payload: urlPayloadSchema }),
  z.object({ type: z.literal("vcard"), payload: vcardPayloadSchema }),
  z.object({ type: z.literal("wifi"), payload: wifiPayloadSchema }),
  z.object({ type: z.literal("text"), payload: textPayloadSchema }),
  z.object({ type: z.literal("email"), payload: emailPayloadSchema }),
  z.object({ type: z.literal("sms"), payload: smsPayloadSchema }),
  z.object({ type: z.literal("geo"), payload: geoPayloadSchema }),
]);

export type CodeContent = z.infer<typeof codeContentSchema>;

/** The union of every payload shape, as stored in the `payload` jsonb column. */
export type CodePayload = CodeContent["payload"];

/** The payload shape for one specific type. */
export type PayloadFor<T extends CodeType> = Extract<
  CodeContent,
  { type: T }
>["payload"];

/** Types that can be served through the `/r/:slug` redirect. */
export const DYNAMIC_CAPABLE_TYPES = CODE_TYPE_NAMES.filter(
  (type) => CODE_TYPES[type].supportsDynamic,
);

export function supportsDynamic(type: CodeType): boolean {
  return CODE_TYPES[type].supportsDynamic;
}
