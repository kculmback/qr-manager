import { defineConfig } from "eslint/config";

import { baseConfig, restrictEnvAccess } from "@qr-manager/eslint-config/base";
import { reactConfig } from "@qr-manager/eslint-config/react";

export default defineConfig(
  {
    ignores: [".nitro/**", ".output/**", ".tanstack/**"],
  },
  baseConfig,
  reactConfig,
  restrictEnvAccess,
  {
    files: ["src/routes/**/*.tsx", "src/routes/**/*.ts"],
    rules: {
      // `throw redirect(...)` / `throw notFound()` is how TanStack Router
      // interrupts a loader - the router catches these two objects by identity,
      // so wrapping them in an `Error` would break routing rather than fix it.
      "@typescript-eslint/only-throw-error": [
        "error",
        {
          allow: [
            {
              from: "package",
              package: "@tanstack/router-core",
              name: ["Redirect", "NotFoundError"],
            },
          ],
        },
      ],
    },
  },
);
