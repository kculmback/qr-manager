import { serve } from "@hono/node-server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { Hono } from "hono";
import { cors } from "hono/cors";

import { appRouter, createTRPCContext } from "@qr-manager/api";
import { createDb } from "@qr-manager/db/client";

import { buildAuth } from "./auth.js";
import { env } from "./env.js";

// Unlike the Workers runtime, this is a long-lived process: build the pool and
// the auth instance once at startup rather than per request.
const db = createDb(env.POSTGRES_URL);
const auth = buildAuth(db);

const app = new Hono();

app.use(
  "*",
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  }),
);

// Registered on both paths: `/health` for direct container checks, and
// `/api/health` so it stays reachable through a proxy that only forwards /api.
app.get("/health", (c) => c.json({ status: "ok" }));
app.get("/api/health", (c) => c.json({ status: "ok" }));

app.on(["GET", "POST"], "/api/auth/*", (c) => auth.handler(c.req.raw));

app.all("/api/trpc/*", (c) => {
  // Clone so the body stream is independent of c.req.raw — something in the
  // Hono/better-auth chain consumes the original before tRPC can read it.
  const req = c.req.raw.clone();
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () =>
      createTRPCContext({
        auth,
        db,
        headers: req.headers,
        allowRegistration: env.ALLOW_REGISTRATION,
      }),
    onError({ error, path }) {
      console.error(`>>> tRPC Error on '${path}'`, error);
    },
  });
});

const server = serve(
  {
    fetch: app.fetch,
    hostname: env.HOST,
    port: env.PORT,
  },
  (info) => {
    console.log(`Server is running on http://${env.HOST}:${info.port}`);
  },
);

// Docker stops containers with SIGTERM; drain in-flight requests and close the
// Postgres pool before exiting.
for (const signal of ["SIGINT", "SIGTERM"] as const) {
  process.on(signal, () => {
    server.close(() => {
      void db.$client.end().finally(() => process.exit(0));
    });
  });
}
