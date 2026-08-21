import type { BetterAuthOptions, BetterAuthPlugin } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { betterAuth } from "better-auth";
import { oAuthProxy } from "better-auth/plugins";

import type { Db } from "@qr-manager/db/client";

export function initAuth<
  TExtraPlugins extends BetterAuthPlugin[] = BetterAuthPlugin[],
>(options: {
  baseUrl: string;
  db: Db;
  productionUrl: string;
  /** Origin the browser app is served from — trusted for cross-origin auth requests. */
  frontendUrl?: string;
  secret: string | undefined;

  discordClientId?: string;
  discordClientSecret?: string;
  extraPlugins?: TExtraPlugins;
}) {
  const config = {
    database: drizzleAdapter(options.db, {
      provider: "pg",
    }),
    baseURL: options.baseUrl,
    secret: options.secret,
    plugins: [
      oAuthProxy({
        productionURL: options.productionUrl,
      }),
      ...(options.extraPlugins ?? []),
    ],
    socialProviders: {
      // Only register Discord when both credentials are configured — it is
      // optional for self-hosted deployments.
      ...(options.discordClientId && options.discordClientSecret
        ? {
            discord: {
              clientId: options.discordClientId,
              clientSecret: options.discordClientSecret,
              redirectURI: `${options.productionUrl}/api/auth/callback/discord`,
            },
          }
        : {}),
    },
    trustedOrigins: options.frontendUrl ? [options.frontendUrl] : [],
    onAPIError: {
      onError(error, ctx) {
        console.error("BETTER AUTH API ERROR", error, ctx);
      },
    },
  } satisfies BetterAuthOptions;

  return betterAuth(config);
}

export type Auth = ReturnType<typeof initAuth>;
export type Session = Auth["$Infer"]["Session"];
