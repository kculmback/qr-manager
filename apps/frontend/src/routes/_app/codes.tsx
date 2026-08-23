import { ensureSession } from "@better-auth-ui/core";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { createIsomorphicFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";

import { authClient } from "~/lib/auth/client";

/**
 * Layout route for everything under `/codes`.
 *
 * The session guard lives here alone so the list, the create form and the
 * detail view cannot drift apart -- and so a new page under `/codes` is
 * protected by existing rather than by remembering to add a check.
 */
export const Route = createFileRoute("/_app/codes")({
  async beforeLoad({ context: { queryClient }, location }) {
    const ensureSessionIso = createIsomorphicFn()
      .server(() =>
        ensureSession(queryClient, authClient, {
          // SSR has no cookie jar of its own; forward the browser's.
          fetchOptions: { headers: getRequestHeaders() },
        }),
      )
      .client(() => ensureSession(queryClient, authClient));

    const session = await ensureSessionIso();

    if (!session) {
      throw redirect({
        to: "/auth/$path",
        params: { path: "sign-in" },
        search: { redirectTo: location.href },
      });
    }

    return { session };
  },
  component: Outlet,
});
