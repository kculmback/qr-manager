import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";

import { SignUp } from "~/components/auth/sign-up";
import { useTRPC } from "~/lib/trpc";

/**
 * First-run screen. It exists because a fresh deployment has no accounts and
 * therefore nobody who could be invited: the first sign-up claims the instance
 * and becomes its administrator, whether or not `ALLOW_REGISTRATION` is on.
 *
 * It sits outside the `_app` shell for the same reason the auth views do — a
 * sidebar for an app nobody can sign into yet is noise.
 */
export const Route = createFileRoute("/setup")({
  async beforeLoad({ context: { queryClient, trpc } }) {
    const { setupRequired } = await queryClient.ensureQueryData(
      trpc.auth.registrationStatus.queryOptions(),
    );

    if (!setupRequired) {
      throw redirect({ to: "/" });
    }
  },
  component: SetupPage,
});

function SetupPage() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const navigate = Route.useNavigate();

  const onSignUpSuccess = useCallback(async () => {
    // The instance is claimed now, so the cached "setup required" answer is
    // wrong and every `beforeLoad` guard reads it through `ensureQueryData`,
    // which serves stale cache rather than revalidating. Left alone, `/` would
    // bounce straight back here and the form would look like it never
    // submitted.
    //
    // `invalidateQueries` is not enough to fix that, even awaited with
    // `refetchType: "all"`. This entry arrived by SSR hydration, so it has no
    // `queryFn` of its own and nothing observes it; invalidating marks it
    // stale and refetching it is a no-op. `fetchQuery` supplies the options,
    // so it actually goes to the server.
    await queryClient.fetchQuery(trpc.auth.registrationStatus.queryOptions());
    await navigate({ to: "/" });
  }, [navigate, queryClient, trpc]);

  return (
    <div className="my-auto flex justify-center p-4 md:p-6">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Set up QR Manager
          </h1>
          <p className="text-muted-foreground text-sm text-pretty">
            This instance has no accounts yet. The account you create now is the
            administrator.
          </p>
        </div>

        <SignUp onSignUpSuccess={onSignUpSuccess} />
      </div>
    </div>
  );
}
