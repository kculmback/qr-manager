import { viewPaths } from "@better-auth-ui/core";
import { createFileRoute, redirect } from "@tanstack/react-router";

import { Auth } from "~/components/auth/auth";
import { twoFactorPlugin } from "~/lib/auth/two-factor-plugin";

const validAuthPathSegments = new Set([
  ...Object.values({ ...viewPaths.auth }),
  // Contributed by the plugin rather than the built-in view paths, so the
  // challenge would otherwise be redirected away as an unknown segment.
  twoFactorPlugin().viewPaths.auth.twoFactor,
]);

export const Route = createFileRoute("/auth/$path")({
  async beforeLoad({ params: { path }, context: { queryClient, trpc } }) {
    if (!validAuthPathSegments.has(path)) {
      throw redirect({ to: "/" });
    }

    const { setupRequired, signUpEnabled } = await queryClient.ensureQueryData(
      trpc.auth.registrationStatus.queryOptions(),
    );

    // Nothing to sign into yet — claiming the instance comes first.
    if (setupRequired) {
      throw redirect({ to: "/setup" });
    }

    // `ALLOW_REGISTRATION` is off, so the sign-up form would only produce a
    // rejection from the server. Send visitors to the form that can work.
    if (path === viewPaths.auth.signUp && !signUpEnabled) {
      throw redirect({
        to: "/auth/$path",
        params: { path: viewPaths.auth.signIn },
      });
    }
  },
  component: AuthPage,
});

function AuthPage() {
  const { path } = Route.useParams();

  return (
    <div className="my-auto flex justify-center p-4 md:p-6">
      <Auth path={path} />
    </div>
  );
}
