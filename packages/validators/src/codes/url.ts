import { z } from "zod/v4";

import type { CodeTypeDef } from "./types";

export const urlPayloadSchema = z.object({
  url: z
    .string()
    .trim()
    .min(1, "Enter a destination URL.")
    .refine((value) => {
      // Parsing beats a regex here, and the scheme check is the point: this
      // value is handed straight to a 302 for dynamic codes, so anything other
      // than http(s) -- `javascript:` above all -- must never get stored.
      let parsed: URL;
      try {
        parsed = new URL(value);
      } catch {
        return false;
      }
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    }, "Enter a full http:// or https:// URL."),
});

export type UrlPayload = z.infer<typeof urlPayloadSchema>;

export const urlType: CodeTypeDef<UrlPayload> = {
  label: "Link",
  description: "Opens a web page. Dynamic links stay editable after printing.",
  schema: urlPayloadSchema,
  encode: (payload) => payload.url,
  supportsDynamic: true,
  defaultMode: "dynamic",
};
