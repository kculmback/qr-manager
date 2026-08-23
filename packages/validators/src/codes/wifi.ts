import { z } from "zod/v4";

import type { CodeTypeDef } from "./types";

export const WIFI_SECURITY = ["WPA", "WEP", "nopass"] as const;
export type WifiSecurity = (typeof WIFI_SECURITY)[number];

export const wifiPayloadSchema = z
  .object({
    ssid: z.string().trim().min(1, "Enter the network name.").max(32),
    security: z.enum(WIFI_SECURITY),
    password: z.string().max(63).optional(),
    hidden: z.boolean().optional(),
  })
  .refine(
    (payload) => payload.security === "nopass" || !!payload.password,
    // `path` puts the message on the password field rather than the whole form.
    { message: "Enter the network password.", path: ["password"] },
  );

export type WifiPayload = z.infer<typeof wifiPayloadSchema>;

/**
 * The Wi-Fi format is delimited by `;` and `:`, so those characters -- plus
 * `\`, `,` and `"` -- have to be backslash-escaped inside a value. Without
 * this, a password containing a semicolon silently truncates the payload and
 * the phone tries to join with the wrong credentials.
 */
function escapeWifi(value: string): string {
  return value.replace(/([\\;,:"])/g, "\\$1");
}

export const wifiType: CodeTypeDef<WifiPayload> = {
  label: "Wi-Fi network",
  description:
    "Joins a wireless network. Always static: the phone reads the credentials while it is still offline.",
  schema: wifiPayloadSchema,
  encode: (payload) => {
    const fields = [`T:${payload.security}`, `S:${escapeWifi(payload.ssid)}`];

    if (payload.security !== "nopass" && payload.password) {
      fields.push(`P:${escapeWifi(payload.password)}`);
    }
    if (payload.hidden) {
      fields.push("H:true");
    }

    return `WIFI:${fields.join(";")};;`;
  },
  supportsDynamic: false,
  defaultMode: "static",
};
