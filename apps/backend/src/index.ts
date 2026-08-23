import type { Context } from "hono";
import { serve } from "@hono/node-server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { Hono } from "hono";
import { cors } from "hono/cors";

import { appRouter, createTRPCContext } from "@qr-manager/api";
import { eq } from "@qr-manager/db";
import { createDb } from "@qr-manager/db/client";
import { Code } from "@qr-manager/db/schema";
import { CODE_TYPES, toCodeContent } from "@qr-manager/validators";

import { buildAuth } from "./auth.js";
import { env } from "./env.js";
import { NOT_FOUND_PAGE, SHORT_LINK_NOT_FOUND_PAGE } from "./not-found.js";

// Unlike the Workers runtime, this is a long-lived process: build the pool and
// the auth instance once at startup rather than per request.
const db = createDb(env.POSTGRES_URL);
const auth = buildAuth(db);

// Trailing slash stripped once here so every short link is built the same way.
const shortUrlBase = (env.SHORT_URL_BASE ?? env.BACKEND_URL).replace(
  /\/+$/,
  "",
);

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

/**
 * A scan that resolved to nothing. Whoever is looking at this pointed a camera
 * at something, so they get a page rather than Hono's plain-text 404.
 */
function shortLinkNotFound(c: Context) {
  return c.html(SHORT_LINK_NOT_FOUND_PAGE, 404);
}

/**
 * The public short link every dynamic code encodes.
 *
 * This is the heart of the product rather than a utility route: it is the only
 * reason a printed code's destination can change, and it is where scan records
 * and actions-on-scan will hook in.
 */
app.get("/r/:slug", async (c) => {
  // Never cacheable, and set before anything else so it covers the 404 too. A
  // cached redirect is a permanently wrong redirect -- the whole point of a
  // dynamic code is that its destination can still change -- and a cached 404
  // would outlive the owner freeing that slug and reusing it.
  c.header("Cache-Control", "no-store");

  const code = await db.query.Code.findFirst({
    where: eq(Code.slug, c.req.param("slug")),
  });

  // Covers both an unknown slug and a static code: every code has a slug, but a
  // static one carries its payload literally, so its slug is never served.
  //
  // Deleting a code therefore retires its short link in the same statement --
  // there is no separate redirect record to leave behind, and nothing caches
  // the old answer, so the link is dead the moment the row is.
  if (code?.mode !== "dynamic") return shortLinkNotFound(c);

  // Scan records and actions-on-scan belong here, and must be fire-and-forget:
  // the person who scanned the code is waiting on this response.

  // Pairs the `type` column with the `payload` jsonb so the two narrow together.
  const content = toCodeContent(code.type, code.payload);

  switch (content.type) {
    case "url":
      // 302, never 301: browsers cache a permanent redirect indefinitely, which
      // would silently pin this code to today's destination forever.
      return c.redirect(content.payload.url, 302);

    case "vcard":
      // Served as a download rather than a redirect — there is no URL to send
      // the scanner to, so the backend hands back the contact card itself.
      c.header("Content-Type", "text/vcard; charset=utf-8");
      c.header(
        "Content-Disposition",
        `attachment; filename="${code.slug}.vcf"`,
      );
      return c.body(CODE_TYPES.vcard.encode(content.payload));

    default:
      // Every other type is static-only, so `mode` should already have ruled
      // this out. Belt and braces.
      return shortLinkNotFound(c);
  }
});

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
        shortUrlBase,
      }),
    onError({ error, path }) {
      console.error(`>>> tRPC Error on '${path}'`, error);
    },
  });
});

// Under the Compose proxy this backend only sees /api/* and /r/*, but a short
// link on its own domain points every path here. Anything unmatched is a person
// with a browser, so serve the page -- except under /api, where the caller is
// code and expects JSON.
app.notFound((c) =>
  c.req.path.startsWith("/api/")
    ? c.json({ error: "Not found" }, 404)
    : c.html(NOT_FOUND_PAGE, 404),
);

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
