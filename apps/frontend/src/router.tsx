import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import SuperJSON from "superjson";

import { NotFound } from "~/components/not-found";
import { makeTRPCClient, TRPCProvider } from "~/lib/trpc";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
  const queryClient = new QueryClient({
    defaultOptions: {
      dehydrate: { serializeData: SuperJSON.serialize },
      hydrate: { deserializeData: SuperJSON.deserialize },
    },
  });
  const trpcClient = makeTRPCClient();
  const trpc = createTRPCOptionsProxy({
    client: trpcClient,
    queryClient,
  });

  const router = createRouter({
    routeTree,
    context: { queryClient, trpc },
    defaultPreload: "intent",
    // Rendered for any unmatched path. Worth having a real page for: a static
    // code's URL cannot be corrected after it is printed, so a dead link into
    // this app keeps sending people here indefinitely.
    defaultNotFoundComponent: NotFound,
    // `TRPCProvider` only supplies the tRPC options proxy — it does not mount
    // a `QueryClientProvider`. Without one, every `useQueryClient()` in the
    // tree falls back to whatever its own library creates: Better Auth UI's
    // `AuthProvider` quietly builds a private `QueryClient` and renders the
    // whole app inside it. Route guards read `context.queryClient` — this one
    // — so the session the auth UI writes and the session a guard checks were
    // two different caches, and SSR-prefetched data never hydrated into the
    // cache components actually read.
    Wrap: (props) => (
      <QueryClientProvider client={queryClient}>
        <TRPCProvider
          trpcClient={trpcClient}
          queryClient={queryClient}
          {...props}
        />
      </QueryClientProvider>
    ),
  });
  setupRouterSsrQueryIntegration({
    router,
    queryClient,
  });

  return router;
}
