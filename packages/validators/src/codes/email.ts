import { z } from "zod/v4";

import type { CodeTypeDef } from "./types";

export const emailPayloadSchema = z.object({
  to: z.email("Enter a valid email address.").max(254),
  subject: z.string().trim().max(200).optional(),
  body: z.string().trim().max(1000).optional(),
});

export type EmailPayload = z.infer<typeof emailPayloadSchema>;

export const emailType: CodeTypeDef<EmailPayload> = {
  label: "Email",
  description: "Opens a pre-addressed draft in the phone's mail app.",
  schema: emailPayloadSchema,
  // `mailto:` rather than the legacy DoCoMo `MATMSG:` form -- every current
  // scanner understands it, and it is a real URI scheme rather than a
  // convention.
  encode: (payload) => {
    const params = new URLSearchParams();
    if (payload.subject) params.set("subject", payload.subject);
    if (payload.body) params.set("body", payload.body);

    const query = params.toString();
    // URLSearchParams encodes spaces as `+`, which mail clients show literally
    // in a subject line. `%20` is what the scheme actually wants.
    return `mailto:${payload.to}${query ? `?${query.replace(/\+/g, "%20")}` : ""}`;
  },
  supportsDynamic: false,
  defaultMode: "static",
};
