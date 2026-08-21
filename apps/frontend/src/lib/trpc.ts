import { createIsomorphicFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import {
  createTRPCClient,
  httpBatchStreamLink,
  loggerLink,
} from "@trpc/client";
import { createTRPCContext } from "@trpc/tanstack-react-query";
import SuperJSON from "superjson";

import type { AppRouter } from "@qr-manager/api";

import { env } from "~/env";
import { getBackendUrl } from "~/lib/url";

const forwardServerHeaders = createIsomorphicFn()
  .server(() => {
    const incoming = new Headers(getRequestHeaders());
    const headers = new Headers();
    headers.set("x-trpc-source", "tanstack-start-server");
    const cookie = incoming.get("cookie");
    if (cookie) headers.set("cookie", cookie);
    return headers;
  })
  .client(() => {
    const headers = new Headers();
    headers.set("x-trpc-source", "tanstack-start-client");
    return headers;
  });

export function makeTRPCClient() {
  return createTRPCClient<AppRouter>({
    links: [
      loggerLink({
        enabled: (op) =>
          env.NODE_ENV === "development" ||
          (op.direction === "down" && op.result instanceof Error),
      }),
      httpBatchStreamLink({
        transformer: SuperJSON,
        url: `${getBackendUrl()}/api/trpc`,
        headers: () => forwardServerHeaders(),
        fetch(url, init) {
          return fetch(url, { ...init, credentials: "include" });
        },
      }),
    ],
  });
}

export const { useTRPC, TRPCProvider } = createTRPCContext<AppRouter>();
