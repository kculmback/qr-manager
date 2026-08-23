import { useQuery } from "@tanstack/react-query";

import type { RouterOutputs } from "@qr-manager/api";

import { useTRPC } from "~/lib/trpc";

export type RegistrationStatus = RouterOutputs["auth"]["registrationStatus"];

/**
 * Conservative stand-in for the moment the status has not loaded: assume the
 * instance is claimed and closed, so nothing invites an account that the
 * server would then refuse.
 *
 * Routes that care call `ensureQueryData` in `beforeLoad`, so the components
 * below normally render with the real answer on their first paint.
 */
const UNKNOWN: RegistrationStatus = {
  setupRequired: false,
  signUpEnabled: false,
};

/**
 * Whether this instance still needs its first (admin) account, and whether
 * self-registration is open.
 *
 * Both answers come from the backend rather than a bundled build-time flag:
 * the frontend image is meant to run against any deployment, and "no accounts
 * yet" is database state, not configuration.
 */
export function useRegistrationStatus(): RegistrationStatus {
  const trpc = useTRPC();
  const { data } = useQuery(trpc.auth.registrationStatus.queryOptions());

  return data ?? UNKNOWN;
}
