import { passkeyClient } from "@better-auth/passkey/client";
import { adminClient, twoFactorClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

import { getBackendUrl } from "~/lib/url";

export const authClient = createAuthClient({
  baseURL: getBackendUrl(),
  fetchOptions: { credentials: "include" },
  // `twoFactorClient` is deliberately left without `onTwoFactorRedirect`: the
  // UI routes the challenge itself from the `twoFactorRedirect` payload in
  // `use-sign-in-continuation`, which keeps the navigation inside the router
  // instead of a full page load.
  plugins: [adminClient(), passkeyClient(), twoFactorClient()],
});
