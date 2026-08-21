import { defineConfig } from "eslint/config";

import { baseConfig, restrictEnvAccess } from "@qr-manager/eslint-config/base";

export default defineConfig(baseConfig, restrictEnvAccess);
