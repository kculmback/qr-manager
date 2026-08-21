/// <reference types="vite/client" />
import type { QueryClient } from "@tanstack/react-query";
import type { TRPCOptionsProxy } from "@trpc/tanstack-react-query";
import type * as React from "react";
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import type { AppRouter } from "@qr-manager/api";
import {
  themeDetectorScript,
  ThemeProvider,
  ThemeToggle,
} from "@qr-manager/ui/components/theme";
import { Toaster } from "@qr-manager/ui/components/toast";
import { TooltipProvider } from "@qr-manager/ui/components/tooltip";

import appCss from "@qr-manager/ui/globals.css?url";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
  trpc: TRPCOptionsProxy<AppRouter>;
}>()({
  head: () => ({
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <HeadContent />
          {/* Must stay in <head> and stay sync: it sets the theme class before
              first paint. React 19 refuses to hoist a non-async script, so
              rendering it anywhere outside the document warns and loses its
              ordering guarantee. */}
          <script
            dangerouslySetInnerHTML={{ __html: themeDetectorScript }}
            suppressHydrationWarning
          />
        </head>
        <body className="bg-background text-foreground min-h-screen font-sans antialiased">
          <TooltipProvider>
            {children}

            <div className="absolute right-4 bottom-12">
              <ThemeToggle />
            </div>

            <Toaster />
            <TanStackRouterDevtools position="bottom-right" />
            <Scripts />
          </TooltipProvider>
        </body>
      </html>
    </ThemeProvider>
  );
}
