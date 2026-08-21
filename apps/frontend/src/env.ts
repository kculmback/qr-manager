import { createEnv } from "@t3-oss/env-core";
import { z } from "zod/v4";

export const env = createEnv({
  clientPrefix: "VITE_",
  shared: {
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),
  },
  /**
   * Specify your server-side environment variables schema here.
   * This way you can ensure the app isn't built with invalid env vars.
   */
  server: {
    /** Where server-side rendering reaches the backend; may be an internal URL. */
    BACKEND_URL: z.url(),
  },

  /**
   * Specify your client-side environment variables schema here.
   * For them to be exposed to the client, prefix them with `NEXT_PUBLIC_`.
   */
  client: {
    /**
     * Baked into the client bundle at build time. Leave it unset when the
     * backend is proxied under the same origin as the frontend (see
     * `docker-compose.yml`) so one prebuilt image works on any domain.
     */
    VITE_BACKEND_URL: z.url().optional(),
  },
  /**
   * Destructure all variables from `process.env` to make sure they aren't tree-shaken away.
   */
  runtimeEnv: typeof window !== "undefined" ? import.meta.env : process.env,
  skipValidation:
    !!process.env.CI || process.env.npm_lifecycle_event === "lint",
});
