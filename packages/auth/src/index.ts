import type { BetterAuthOptions, BetterAuthPlugin } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { betterAuth } from "better-auth";
import { admin, oAuthProxy } from "better-auth/plugins";

import type { Db } from "@qr-manager/db/client";

import { registrationDatabaseHooks } from "./registration";

export function initAuth<
  TExtraPlugins extends BetterAuthPlugin[] = BetterAuthPlugin[],
>(options: {
  baseUrl: string;
  db: Db;
  productionUrl: string;
  /** Origin the browser app is served from — trusted for cross-origin auth requests. */
  frontendUrl?: string;
  secret: string | undefined;

  /**
   * Whether anyone may create an account. The very first account is always
   * allowed regardless, so a deployment that ships with this off is still
   * claimable — see `./registration`.
   */
  allowRegistration: boolean;

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
    emailAndPassword: {
      enabled: true,
    },
    // Not `emailAndPassword.disableSignUp`: that switch is static, and the
    // first account has to get through even when registration is closed.
    databaseHooks: registrationDatabaseHooks({
      db: options.db,
      allowRegistration: options.allowRegistration,
    }),
    plugins: [
      admin(),
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
