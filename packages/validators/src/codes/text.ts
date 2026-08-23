import { z } from "zod/v4";

import type { CodeTypeDef } from "./types";

export const textPayloadSchema = z.object({
  // A QR code tops out around 2,300 bytes at error correction level M, and
  // anything near that is a dense, hard-to-scan grid. 1,200 keeps codes usable.
  text: z.string().trim().min(1, "Enter some text.").max(1200),
});

export type TextPayload = z.infer<typeof textPayloadSchema>;

export const textType: CodeTypeDef<TextPayload> = {
  label: "Plain text",
  description: "Shows text in the scanner. Cannot be changed after printing.",
  schema: textPayloadSchema,
  encode: (payload) => payload.text,
  supportsDynamic: false,
  defaultMode: "static",
};
