import type { Db } from "@qr-manager/db/client";
import { initAuth } from "@qr-manager/auth";

export function buildAuth(env: CloudflareBindings, db: Db, baseUrl: string) {
  return initAuth({
    db,
    baseUrl,
    productionUrl: env.PRODUCTION_URL,
    frontendUrl: env.FRONTEND_URL,
    secret: env.AUTH_SECRET,
    // discordClientId: env.AUTH_DISCORD_ID,
    // discordClientSecret: env.AUTH_DISCORD_SECRET,
  });
}
