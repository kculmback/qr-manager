import { ensureSession, viewPaths } from "@better-auth-ui/core";
import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import { createIsomorphicFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";

import { Settings } from "~/components/auth/settings/settings";
import { authClient } from "~/lib/auth/client";

const validSettingsPaths = [...Object.values(viewPaths.settings)];

export const Route = createFileRoute("/settings/$path")({
  async beforeLoad({ params: { path }, context: { queryClient }, location }) {
    if (!validSettingsPaths.includes(path)) {
      throw notFound();
    }

    const ensureSessionIso = createIsomorphicFn()
      .server(() =>
        ensureSessionFn(queryClient, authClient, {
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
  component: SettingsPage,
});

function SettingsPage() {
  const { path } = Route.useParams();

  return (
    <div className="mx-auto w-full max-w-3xl p-4 md:p-6">
      <Settings path={path} />
    </div>
  );
}
