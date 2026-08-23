import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@qr-manager/ui/components/sidebar";

import { AppSidebar } from "~/components/layout/app-sidebar";

/**
 * Pathless layout route holding the application shell. Everything nested under
 * it renders inside the sidebar; the auth views deliberately sit outside so a
 * signed-out visitor gets a bare, centred card.
 */
export const Route = createFileRoute("/_app")({
  async beforeLoad({ context: { queryClient, trpc } }) {
    const { setupRequired } = await queryClient.ensureQueryData(
      trpc.auth.registrationStatus.queryOptions(),
    );

    // A brand new deployment has nothing to show and nobody to show it to;
    // claiming the instance is the only thing that can happen next.
    if (setupRequired) {
      throw redirect({ to: "/setup" });
    }
  },
  component: AppLayout,
});

function AppLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset>
        <header className="bg-background/80 sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b px-4 backdrop-blur">
          <SidebarTrigger className="-ml-1" />
        </header>

        <div className="flex flex-1 flex-col">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
