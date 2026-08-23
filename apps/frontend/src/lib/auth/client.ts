import { passkeyClient } from "@better-auth/passkey/client";
import { adminClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

import { getBackendUrl } from "~/lib/url";

export const authClient = createAuthClient({
  baseURL: getBackendUrl(),
  fetchOptions: { credentials: "include" },
  plugins: [adminClient(), passkeyClient()],
});
