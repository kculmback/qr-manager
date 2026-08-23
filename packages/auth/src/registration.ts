import type { BetterAuthOptions } from "better-auth";
import { APIError } from "better-auth/api";

import type { Db } from "@qr-manager/db/client";
import { user as userTable } from "@qr-manager/db/schema";

/**
 * Role the better-auth admin plugin treats as an administrator. It is the
 * plugin's own default; naming it here keeps the bootstrap hook and any future
 * role check reading from one place.
 */
export const ADMIN_ROLE = "admin";

/** Endpoint an administrator uses to add an account from the admin UI. */
const ADMIN_CREATE_USER_PATH = "/admin/create-user";

/** Error code returned when a sign-up is refused by the registration switch. */
export const REGISTRATION_DISABLED = "REGISTRATION_DISABLED";

/** Whether this deployment has at least one account. */
export async function hasAnyUser(db: Db): Promise<boolean> {
  // `limit(1)` rather than a count: the answer is boolean, and this runs on
  // every account creation.
  const rows = await db.select({ id: userTable.id }).from(userTable).limit(1);
  return rows.length > 0;
}

export interface RegistrationStatus {
  /**
   * The instance has no accounts at all. The next sign-up bootstraps it and
   * claims the admin role, so the UI prompts for that account even when
   * registration is otherwise closed.
   */
  setupRequired: boolean;
  /** Whether a visitor may reach the sign-up form at all. */
  signUpEnabled: boolean;
}

/**
 * Resolve what the sign-up surfaces should offer right now.
 *
 * This is advisory — the UI reads it to decide what to render. The gate that
 * actually refuses an account is {@link registrationDatabaseHooks}, which runs
 * inside better-auth on every path that creates a user.
 */
export async function getRegistrationStatus(options: {
  db: Db;
  allowRegistration: boolean;
}): Promise<RegistrationStatus> {
  const setupRequired = !(await hasAnyUser(options.db));

  return {
    setupRequired,
    signUpEnabled: setupRequired || options.allowRegistration,
  };
}

/**
 * The registration gate, as better-auth database hooks.
 *
 * Every way an account can come into existence — email sign-up, a social
 * provider creating one on first sign-in, the admin plugin — funnels through
 * `user.create`, so hooking it there closes the door once rather than per
 * endpoint.
 *
 * Two cases are deliberately exempt from `allowRegistration`:
 *
 *  - The **first** account. A fresh deployment has to be claimable, otherwise
 *    shipping with registration closed would lock everyone out. That account
 *    also becomes the admin.
 *  - Accounts an administrator creates through the admin UI, which is not
 *    self-registration.
 */
export function registrationDatabaseHooks(options: {
  db: Db;
  allowRegistration: boolean;
}): BetterAuthOptions["databaseHooks"] {
  return {
    user: {
      create: {
        before: async (user, context) => {
          // Runs before the insert, so an empty table means this *is* the
          // first account.
          if (!(await hasAnyUser(options.db))) {
            return { data: { ...user, role: ADMIN_ROLE } };
          }

          if (context?.path === ADMIN_CREATE_USER_PATH) return;
          if (options.allowRegistration) return;

          throw APIError.from("FORBIDDEN", {
            code: REGISTRATION_DISABLED,
            message: "Registration is disabled on this instance.",
          });
        },
      },
    },
  };
}
