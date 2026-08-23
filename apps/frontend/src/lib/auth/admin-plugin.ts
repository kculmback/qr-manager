import type { AdminPluginOptions } from "@better-auth-ui/core/plugins/admin";
import { createAuthPlugin } from "@better-auth-ui/core";
import { adminPlugin as coreAdminPlugin } from "@better-auth-ui/core/plugins/admin";

import { StopImpersonating } from "~/components/auth/admin/stop-impersonating";

export const adminPlugin = createAuthPlugin(
  coreAdminPlugin.id,
  (options: AdminPluginOptions = {}) => ({
    ...coreAdminPlugin(options),
    userMenuItems: [StopImpersonating],
  }),
);
