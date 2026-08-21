import { defineConfig } from "eslint/config";

import { baseConfig } from "@qr-manager/eslint-config/base";
import { reactConfig } from "@qr-manager/eslint-config/react";

export default defineConfig(
  {
    ignores: ["dist/**"],
  },
  baseConfig,
  reactConfig,
);
