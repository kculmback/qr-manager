import { z } from "zod/v4";

import type { CodeTypeDef } from "./types";

export const phoneSchema = z
  .string()
  .trim()
  .min(3)
  .max(32)
  .regex(/^\+?[0-9 ()\-.]+$/, "Enter a valid phone number.");

export const smsPayloadSchema = z.object({
  phone: phoneSchema,
  message: z.string().trim().max(500).optional(),
});

export type SmsPayload = z.infer<typeof smsPayloadSchema>;

export const smsType: CodeTypeDef<SmsPayload> = {
  label: "SMS",
  description: "Opens a pre-written text message to a number.",
  schema: smsPayloadSchema,
  // `SMSTO:` is DoCoMo-derived rather than a registered scheme, but it is what
  // essentially every scanner implements; `sms:?body=` is handled far less
  // consistently.
  encode: (payload) =>
    payload.message
      ? `SMSTO:${payload.phone}:${payload.message}`
      : `SMSTO:${payload.phone}`,
  supportsDynamic: false,
  defaultMode: "static",
};
