# QR Manager

A self-hostable QR code manager, built as a Turborepo monorepo. Runs anywhere
Docker runs — a laptop, a VPS, or a managed container platform — with no
dependency on any single cloud vendor.

## Stack

| Layer    | Choice                                                       |
| -------- | ------------------------------------------------------------ |
| Backend  | [Hono](https://hono.dev) on Node, serving tRPC + better-auth |
| Frontend | [TanStack Start](https://tanstack.com/start) (React 19, SSR) |
| API      | [tRPC v11](https://trpc.io), end-to-end typesafe             |
| Auth     | [better-auth](https://better-auth.com)                       |
| Database | Postgres via [Drizzle ORM](https://orm.drizzle.team) + `pg`  |
| Styling  | Tailwind CSS v4 + shadcn-style components                    |
| Monorepo | Turborepo + pnpm workspaces                                  |

```text
apps
  ├─ backend        Hono API server (tRPC + auth), builds to a single JS bundle
  └─ frontend       TanStack Start app, builds to a standalone Nitro server
packages
  ├─ api            tRPC router definitions
  ├─ auth           better-auth configuration
  ├─ db             Drizzle schema, client, and SQL migrations
  ├─ ui             Shared React components
  └─ validators     Shared zod schemas
tooling
  ├─ eslint / prettier / tailwind / typescript    shared configs
  └─ github         composite action used by CI
```

## Requirements

- **Node** `^22.21.0` and **pnpm** `^10.19.0` (see [`package.json#engines`](./package.json))
- **Docker** with Compose v2 — required for self-hosting, and the easiest way to
  get Postgres locally

## Quick start (local development)

```bash
# 1. Install dependencies
pnpm install

# 2. Create your env file, then set AUTH_SECRET
cp .env.example .env
openssl rand -base64 32     # paste into AUTH_SECRET

# 3. Start Postgres in Docker (apps still run on the host, so HMR stays fast)
pnpm dev:db

# 4. Create the database schema
pnpm db:migrate

# 5. Run both apps
pnpm dev
```

- Frontend → <http://localhost:3001>
- Backend → <http://localhost:3000> (health check at `/health`)

Once the stack is up, `curl http://localhost:8080/api/health` confirms the
backend is reachable through the proxy.

Stop the database again with `pnpm dev:db:stop`. Its data lives in a named
volume and survives restarts.

## Self-hosting with Docker

The full stack — Postgres, backend, frontend, and a Caddy reverse proxy — runs
from a single command:

```bash
cp .env.example .env        # set AUTH_SECRET; adjust PUBLIC_URL for your domain
pnpm docker:up              # docker compose up -d --build
```

The whole app is then served from **one origin**, <http://localhost:8080> by
default. Only the proxy publishes a port; the app containers and the database
stay on the internal Docker network.

| Command            | What it does                           |
| ------------------ | -------------------------------------- |
| `pnpm docker:up`   | Build and start the full stack         |
| `pnpm docker:logs` | Tail logs from every service           |
| `pnpm docker:down` | Stop the stack (data volumes are kept) |

Migrations run automatically: a one-shot `migrate` service applies any pending
SQL and must exit successfully before the backend starts.

### Serving a real domain over HTTPS

Set `PUBLIC_URL` to your domain in `.env`, then replace the site block in
[`Caddyfile`](./Caddyfile) with your hostname. Caddy provisions and renews a
Let's Encrypt certificate on its own:

```diff
-:8080 {
+qr.example.com {
 	handle /api/* {
 		reverse_proxy backend:3000
 	}
```

Then publish ports `80` and `443` from the `proxy` service instead of `8080`,
so that ACME validation can reach it.

### Why a single origin

The browser bundle calls the backend at `/api/*`, relative to whatever host it
was loaded from. This matters more than it looks:

- **One image works on every domain.** Vite inlines client-side environment
  variables at _build_ time, so an absolute backend URL would bake a specific
  hostname into the JavaScript and force a rebuild per deployment.
- **No CORS and no third-party cookies.** Auth cookies are first-party, which
  keeps working as browsers continue restricting cross-site cookies.

For a split deployment — frontend and backend on different domains — set
`VITE_BACKEND_URL` at build time and the frontend uses that absolute URL
instead. The backend already allows credentialed CORS from `FRONTEND_URL`.

## Environment variables

Everything is validated at startup with [`@t3-oss/env-core`](https://env.t3.gg),
so a missing or malformed variable fails immediately with a readable error
rather than at the first request.

### Backend (`apps/backend/src/env.ts`)

| Variable                      | Required       | Description                                                        |
| ----------------------------- | -------------- | ------------------------------------------------------------------ |
| `POSTGRES_URL`                | yes            | Postgres connection string                                         |
| `BACKEND_URL`                 | yes            | Public origin of the backend; better-auth builds callbacks from it |
| `FRONTEND_URL`                | yes            | Allowed CORS origin and trusted auth origin                        |
| `AUTH_SECRET`                 | in production  | Session signing secret, 32+ chars                                  |
| `HOST`                        | no (`0.0.0.0`) | Bind interface                                                     |
| `PORT`                        | no (`3000`)    | Bind port                                                          |
| `NODE_ENV`                    | no             | `development` \| `production` \| `test`                            |
| `MIGRATIONS_DIR`              | no             | Overrides where the migration runner looks for SQL                 |
| `ALLOW_REGISTRATION`          | no (`false`)   | Lets visitors create their own account; the first one is always allowed |
| `AUTH_DISCORD_ID` / `_SECRET` | no             | Enables Discord OAuth when both are set                            |

### Frontend (`apps/frontend/src/env.ts`)

| Variable           | Required    | Description                                                                                   |
| ------------------ | ----------- | --------------------------------------------------------------------------------------------- |
| `BACKEND_URL`      | yes         | Where SSR reaches the backend; may be internal (`http://backend:3000`)                        |
| `VITE_BACKEND_URL` | no          | Absolute backend URL baked into the browser bundle at build time. Leave unset for same-origin |
| `FRONTEND_PORT`    | no (`3001`) | Dev server port. Set this rather than `PORT`, which the backend uses                          |

## Database and migrations

The schema lives in [`packages/db/src/schema.ts`](./packages/db/src/schema.ts).
Migrations are real, checked-in SQL files under `packages/db/drizzle`, applied
by `drizzle-orm`'s migrator — `drizzle-kit` is never needed at runtime.

```bash
# After changing the schema: generate a new SQL migration
pnpm db:generate

# Apply pending migrations
pnpm db:migrate

# Browse data
pnpm db:studio
```

`pnpm db:push` also exists for throwaway iteration, but it edits the database
in place without producing a migration. Prefer `db:generate` + `db:migrate`
for anything you intend to deploy.

### Auth schema

Auth tables are generated from the better-auth config into
`packages/db/src/auth-schema.ts`. Regenerate after changing auth options, then
create a migration for the result:

```bash
pnpm auth:generate
pnpm db:generate
```

## Deploying to the cloud

### Container platforms

Both apps produce ordinary container images, so anything that runs a container
works — Fly.io, Railway, Render, Google Cloud Run, ECS, or a plain VPS.

```bash
docker build -f apps/backend/Dockerfile  -t qr-manager-backend  .
docker build -f apps/frontend/Dockerfile -t qr-manager-frontend .
```

Both builds use the **repo root** as the build context, because they install
from the workspace lockfile. Point managed Postgres at `POSTGRES_URL` and drop
the bundled `postgres` service.

The images are deliberately small: the backend bundles to a single JS file with
`tsdown` and ships no `node_modules`, and Nitro emits a self-contained server
for the frontend.

### Serverless

**Frontend** — Nitro builds for most serverless platforms by setting a preset at
build time, without code changes:

```bash
NITRO_PRESET=vercel pnpm --filter @qr-manager/frontend build
```

Set `VITE_BACKEND_URL` at build time if the backend is on another domain.

**Backend** — the app is a standard Hono app, and Hono has adapters for Vercel,
Netlify, Cloudflare Workers, Deno Deploy and AWS Lambda. Moving there means
two swaps in `apps/backend/src/index.ts` and `packages/db/src/client.ts`:

1. Replace the `@hono/node-server` `serve()` call with the platform's adapter
   and export the app.
2. Replace the `pg` driver with one that suits serverless connection limits —
   a pooled driver such as Neon or Supabase's, or a connection pooler like
   PgBouncer in front of plain Postgres.

Long-lived TCP pools are the thing that does not survive the move: `createDb`
builds one `pg.Pool` per process, which is right for a persistent server and
wrong for per-request isolates.

## Scripts

| Command          | Description                              |
| ---------------- | ---------------------------------------- |
| `pnpm dev`       | Run all apps in watch mode               |
| `pnpm dev:db`    | Start the local Postgres container       |
| `pnpm build`     | Build every workspace package            |
| `pnpm typecheck` | Typecheck everything                     |
| `pnpm lint`      | Lint everything (`lint:fix` to autofix)  |
| `pnpm format`    | Check formatting (`format:fix` to write) |
| `pnpm ui-add`    | Add a shadcn component to `packages/ui`  |
| `pnpm clean`     | Remove `node_modules` throughout         |

To add a package, run `pnpm turbo gen init` — it scaffolds `package.json`,
`tsconfig.json`, and the shared tooling configs.

## Acknowledgements

Originally scaffolded from
[create-t3-turbo](https://github.com/t3-oss/create-t3-turbo).
