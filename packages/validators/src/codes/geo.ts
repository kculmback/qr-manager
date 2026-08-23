import { z } from "zod/v4";

import type { CodeTypeDef } from "./types";

export const geoPayloadSchema = z.object({
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
});

export type GeoPayload = z.infer<typeof geoPayloadSchema>;

export const geoType: CodeTypeDef<GeoPayload> = {
  label: "Location",
  description:
    "Opens a point on a map. Android handles this natively; iOS Camera often ignores geo: links.",
  schema: geoPayloadSchema,
  // RFC 5870.
  encode: (payload) => `geo:${payload.latitude},${payload.longitude}`,
  supportsDynamic: false,
  defaultMode: "static",
};
