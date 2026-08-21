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
);
