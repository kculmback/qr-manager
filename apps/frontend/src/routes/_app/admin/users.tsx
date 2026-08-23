import { createFileRoute } from "@tanstack/react-router";

import { Admin } from "~/components/auth/admin/admin";

/**
 * User administration. The path is static on purpose — the selected user lives
 * in the drawer's own state rather than the route, so no user ID ends up in a
 * shareable URL.
 *
 * Access is not enforced here: `<Admin>` asks better-auth whether the current
 * session may manage users, and every admin endpoint checks again server-side.
 */
export const Route = createFileRoute("/_app/admin/users")({
  component: AdminUsersPage,
});

function AdminUsersPage() {
  return (
    <div className="mx-auto w-full max-w-5xl p-4 md:p-6">
      <Admin view="users" />
    </div>
  );
}
