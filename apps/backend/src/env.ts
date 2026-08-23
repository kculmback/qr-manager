import { createEnv } from "@t3-oss/env-core";
import { z } from "zod/v4";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here.
   * This way you can ensure the app isn't started with invalid env vars.
   */
  server: {
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),

    /** Interface the HTTP server binds to. `0.0.0.0` so it is reachable from outside a container. */
    HOST: z.string().min(1).default("0.0.0.0"),
    PORT: z.coerce.number().int().positive().max(65535).default(3000),

    /** Connection string for the Postgres instance this deployment owns. */
    POSTGRES_URL: z.url(),

    /** Overrides where the migration runner looks for generated SQL. */
    MIGRATIONS_DIR: z.string().min(1).optional(),

    /** Public origin this backend is reachable at — used as better-auth's `baseURL`. */
    BACKEND_URL: z.url(),
    /** Public origin of the frontend — used for CORS and as a trusted auth origin. */
    FRONTEND_URL: z.url(),

    /** Generate with `openssl rand -base64 32`. Required in production. */
    AUTH_SECRET:
      process.env.NODE_ENV === "production"
        ? z.string().min(1)
        : z.string().min(1).optional(),

    /**
     * Whether visitors may create their own account. Off by default: a
     * self-hosted instance on a public URL should not accept strangers unless
     * its operator says so. The first account is always allowed regardless,
     * so the instance stays claimable.
     */
    ALLOW_REGISTRATION: z.stringbool().default(false),

    /** Optional Discord OAuth provider; the provider is only registered when both are set. */
    AUTH_DISCORD_ID: z.string().min(1).optional(),
    AUTH_DISCORD_SECRET: z.string().min(1).optional(),
  },

  /**
   * Destructure all variables from `process.env` to make sure they aren't tree-shaken away.
   */
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
  skipValidation:
    !!process.env.CI || process.env.npm_lifecycle_event === "lint",
});
