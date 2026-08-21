import type { Db } from "@qr-manager/db/client";
import { initAuth } from "@qr-manager/auth";

import { env } from "./env.js";

export function buildAuth(db: Db) {
  return initAuth({
    db,
    baseUrl: env.BACKEND_URL,
    // Self-hosted deployments are their own "production" instance, so the
    // OAuth proxy points back at this server.
    productionUrl: env.BACKEND_URL,
    frontendUrl: env.FRONTEND_URL,
    secret: env.AUTH_SECRET,
    discordClientId: env.AUTH_DISCORD_ID,
    discordClientSecret: env.AUTH_DISCORD_SECRET,
  });
}
