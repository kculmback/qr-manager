# QR Manager — agent guide

Self-hostable QR code manager. Turborepo + pnpm workspaces. The whole stack runs
under Docker with no dependency on a single cloud vendor — keep it that way.

User-facing docs live in [`README.md`](./README.md); this file covers what an
agent needs to change code safely.

## Where this is going

The long-term goal is a full QR code manager, not just a QR generator. Four
capabilities define the target; weigh design decisions against them even while
the codebase is still boilerplate. A fifth — NFC tag management — comes after
the QR side works, but shapes the model from the start.

**Many QR types.** Wi-Fi credentials, contact cards (vCard/MeCard), plain URLs,
email, SMS, calendar events, geo, and so on. Each type is a different payload
encoding, so expect a per-type schema + serializer rather than one generic
"content" string. `packages/validators` is the natural home for those schemas,
shared by the API and the form UI.

**Dynamic wherever possible.** A printed QR code cannot change, so the encoded
value should be a short URL back to this backend that redirects to the current
destination — the target is editable after the code is in the wild. Some types
cannot work this way (Wi-Fi credentials must be encoded literally, since the
scanner joins a network offline), so the model has to accommodate both static
and dynamic codes rather than assuming one.

**Scan analytics.** Scan counts over time, and whatever the redirect can
observe — coarse location, device/user agent, referrer. This falls out of the
dynamic redirect: the backend sees every scan of a dynamic code, and none of a
static one. Treat scan records as their own table, not a counter column.

**Actions on scan.** Trigger user-configured side effects when a code is
scanned — the motivating example is calling a user's Home Assistant webhook.
Actions run on the redirect path, so they must not block or delay the user's
redirect, and outbound URLs are user-supplied, which makes SSRF a real concern
for a self-hosted app sitting on a home network.

**NFC tags, later.** The same four capabilities apply to NFC tags: many record
types (URL, Wi-Fi, text, vCard, launching an app), dynamic wherever the record
type allows it, scan analytics off that same redirect, and actions on scan. QR
ships first and NFC follows, so don't build NFC yet — but when a decision would
otherwise hard-code "QR", prefer the shape that a second tag medium can reuse.
The payload types, the dynamic-redirect model, scan records, and actions are all
about the destination and its side effects, not about how the destination got
encoded; only the encoding and the artwork are genuinely QR-specific.

Together these mean the redirect endpoint is the heart of the product, not an
afterthought: it resolves the destination, records the scan, and fires actions.

## Commands

Run everything from the repo root; Turbo fans out to the workspaces.

| Command                              | Use                                                |
| ------------------------------------ | -------------------------------------------------- |
| `pnpm dev`                           | Watch mode for backend + frontend                  |
| `pnpm dev:db` / `pnpm dev:db:stop`   | Local Postgres in Docker (apps stay on the host)   |
| `pnpm db:generate`                   | Emit a SQL migration after a schema change         |
| `pnpm db:migrate`                    | Apply pending migrations                           |
| `pnpm typecheck` / `lint` / `format` | Verification; `lint:fix` and `format:fix` to write |
| `pnpm build`                         | Build every workspace                              |
| `pnpm ui-add`                        | Add a shadcn component to `packages/ui`            |
| `pnpm docker:up` / `:down` / `:logs` | Full stack behind the Caddy proxy on `:8080`       |

Scope to one workspace with `pnpm -F @qr-manager/<name> <script>`.

**Before handing work back, run `pnpm typecheck && pnpm lint && pnpm format`.**
CI runs exactly these three (`.github/workflows/ci.yml`) and nothing else — no
build job, and there are currently **no tests anywhere in the repo**, so
typecheck is the only real safety net.

## Layout

```text
apps/backend      Hono on Node — tRPC + better-auth. Bundles to one JS file via tsdown.
apps/frontend     TanStack Start (React 19, SSR). Builds to a standalone Nitro server.
packages/api      tRPC router definitions (root.ts, trpc.ts, router/*)
packages/auth     better-auth config — initAuth() factory
packages/db       Drizzle schema, pg client, checked-in SQL migrations
packages/ui       shadcn-style components
packages/validators  Shared zod schemas (currently a placeholder only)
tooling/*         Shared eslint / prettier / tailwind / tsconfig, and the CI setup action
```

Cross-package imports use the `@qr-manager/*` names. `packages/ui` exports
subpaths only — `@qr-manager/ui/components/button`, not `@qr-manager/ui/button`.

## Things that will bite you

### The backend is Node, not Cloudflare Workers

This was ported off Workers. Do not reintroduce Workers APIs, `c.env` bindings,
or per-request resource construction.

`apps/backend/src/index.ts` builds the db pool and the auth instance **once at
module scope**. That is deliberate: this is a long-lived process, and a
`new Pool()` per request leaks connections. Same for `buildAuth`.

The tRPC handler clones `c.req.raw` before passing it on — something in the
Hono/better-auth chain consumes the original body stream first. Leave the clone.

`SIGINT`/`SIGTERM` handlers drain the server and close the pg pool; Docker stops
containers with `SIGTERM`, so keep shutdown working.

### The frontend calls `/api/*` on its own origin

Vite inlines `VITE_`-prefixed variables at **build** time. An absolute backend
URL would bake one hostname into the JavaScript bundle and break the "one image,
any domain" property. So `getBackendUrl()` in `apps/frontend/src/lib/url.ts`
falls back to `window.location.origin` in the browser, and a reverse proxy
(`Caddyfile`) routes `/api/*` to the backend. Only override with
`VITE_BACKEND_URL` for a deliberate split-domain deployment.

Server-side rendering uses `BACKEND_URL`, which may be an internal address
(`http://backend:3000`). Browser and SSR paths are genuinely different — don't
collapse them.

### `PORT` belongs to the backend; the frontend uses `FRONTEND_PORT`

Both apps load the **same** root `.env` in dev (`dotenv -e ../../.env`), so the
backend's `PORT` is set in the frontend's process too — and nitro's vite plugin
reads `process.env.PORT` _ahead of_ `server.port`, which silently moves the dev
server onto the backend's port. It doesn't raise `EADDRINUSE`, because the
backend binds IPv4 `0.0.0.0` and vite binds IPv6 `[::1]`; you just get the
backend's 404 where the app should be.

`apps/frontend/vite.config.ts` pins `process.env.PORT` from `FRONTEND_PORT`
(default 3001) to block this, but only when `command === "serve"` — the built
server must keep reading `PORT` at runtime, which is how Docker and container
platforms tell it where to listen. Don't drop that guard, and don't add new
unprefixed, app-agnostic names like `PORT` or `HOST` to the shared `.env`.

### Migrations are checked-in SQL, not `db:push`

`pnpm db:push` exists for throwaway iteration but mutates the database with no
artifact. Anything that ships goes through `pnpm db:generate` (writes to
`packages/db/drizzle/`) then `pnpm db:migrate`. Commit the generated SQL **and**
the `meta/` journal together.

`drizzle-kit` is build-time only. Runtime migration goes through
`drizzle-orm`'s migrator via `apps/backend/src/migrate.ts`, which resolves the
SQL folder from either the source tree or the bundle. Compose runs it as a
one-shot service the backend waits on.

Auth tables are generated: `pnpm auth:generate` rewrites
`packages/db/src/auth-schema.ts` from the better-auth config. Regenerate after
changing auth options, then `pnpm db:generate` for the migration.

The generator is `@better-auth/cli`, whose latest release is still 1.4.x while
this repo runs better-auth 1.7. It emits plain `pgTable(name, {...})` columns
with hand-written snake_case names, and it drops columns 1.4 doesn't know about
(`account.issuer`). Treat its output as a diff to read, not to commit: take the
new table, rewrite it in the `(t) => ({ ... })` form the rest of the file uses,
and leave everything else alone.

Do not add `@better-auth/cli` to a workspace's dependencies. It pulls
better-auth 1.4 into that workspace's tree, and pnpm then satisfies the peers of
1.7 packages from there — `@better-auth/passkey` silently resolves better-call
1.1 instead of 1.4 and throws `does not provide an export named
'kAPIErrorHeaderSymbol'` on import. The `generate` script runs the CLI through
`pnpx`, so it never needed the dependency.

### Passkeys are bound to one hostname

`packages/auth` derives the WebAuthn relying party from `frontendUrl` (falling
back to `baseUrl`), because the ceremony runs in the browser app, not the API.
Two consequences: WebAuthn needs a secure context, so anything other than
`localhost` must be HTTPS, and a passkey registered against one hostname will
not verify against another. Moving a deployment to a new domain invalidates
every stored passkey — passwords and OAuth still work, so nobody is locked out.

`origin` is pinned to `baseUrl` + `frontendUrl` rather than left to the plugin's
default, which trusts the request's `Origin` header.

The `Auth` type now names types from `@simplewebauthn/server`, so any package
that re-exports something inferred from it needs that package as a dependency or
`tsc` raises TS2742 — that is why `packages/api` depends on it without importing
it.

### Adding an environment variable touches five places

Env is validated at startup by `@t3-oss/env-core` + zod v4, so a missed spot
fails loudly rather than silently at first request. Update all of:

1. `apps/backend/src/env.ts` or `apps/frontend/src/env.ts`
2. `.env.example`
3. `turbo.json` → `globalEnv` (otherwise Turbo caches across differing values)
4. `docker-compose.yml` (usually the `x-app-env` anchor)
5. The env table in `README.md`

Local dev reads the **root** `.env` — each app's `with-env` script is
`dotenv -e ../../.env --`. `apps/backend`'s `start` script deliberately omits
`with-env` so the container's real environment wins.

### Base UI's `nativeButton` must match the element you render

Anything built on Base UI's `useButton` — `Button`, `Tabs.Tab`, `Toggle`,
`Menu.Item`, and every `*.Trigger` / `*.Close` — assumes it renders a real
`<button>`. Hand it a `render` prop that produces something else (a `<a>`, a
TanStack `<Link>`) and it logs _"A component that acts as a button expected a
native `<button>`"_ in dev. Set `nativeButton={false}` there:

```tsx
<Button nativeButton={false} render={<a href={href} />}>
```

The check runs **both ways**: `nativeButton={false}` on something that does
render a `<button>` warns just as loudly, so only add it where the rendered
element genuinely is not a button. Rendering one Base UI button component into
another (`<DropdownMenuTrigger render={<Button />} />`) needs nothing — the
chain still bottoms out at a `<button>`.

Not every component with a `render` prop is affected. Base UI's plain
`useRender` wrappers (`SidebarMenuButton`, `Tooltip.Trigger`, `Select.Icon`,
`*.ItemIndicator`) never call `useButton` and accept no `nativeButton`, so a
`<Link>` or `<span>` is fine in those.

### Docker builds use the repo root as context

Both Dockerfiles live in their app directory but must be built from the root
(`docker build -f apps/backend/Dockerfile .`) because they install from the
workspace lockfile. Installs run `--frozen-lockfile --ignore-scripts`; if you
add a dependency that genuinely needs a postinstall script, that assumption
breaks and the Dockerfile needs updating.

## Conventions

- TypeScript throughout, ESM, `"type": "module"`. tsconfigs extend
  `@qr-manager/tsconfig/base.json` (Bundler resolution — NodeNext breaks
  extensionless workspace imports).
- ESLint runs with `--flag unstable_native_nodejs_ts_config`; configs are
  `eslint.config.ts`. Prettier config comes from `@qr-manager/prettier-config`.
- Drizzle uses `casing: "snake_case"`, so camelCase fields map to snake_case
  columns automatically — don't hand-write column names.
- Zod is imported as `zod/v4`.
- New package: `pnpm turbo gen init` scaffolds the manifest and shared configs.

## Known unfinished work

Don't mistake these for intentional design:

- The domain model is still create-t3-turbo boilerplate — the only table is
  `Post`. None of the entities in "Where this is going" exist yet: no QR codes,
  no scan records, no actions.
- `apps/frontend/src/routes/index.tsx` is largely commented-out scaffolding.
- `packages/validators` exports a placeholder.
- `LICENSE` and `.github/FUNDING.yml` still carry upstream attribution.
- Root `postinstall` runs `pnpm lint:ws` → `pnpm dlx sherif@latest`, a network
  call on every install.

<!-- intent-skills:start -->

## Skill Loading

Before editing files for a substantial task:

- Run `pnpm dlx @tanstack/intent@latest list` from the workspace root to see available local skills.
- If a listed skill matches the task, run `pnpm dlx @tanstack/intent@latest load <package>#<skill>` before changing files.
- Use the loaded `SKILL.md` guidance while making the change.
- Monorepos: when working across packages, run the skill check from the workspace root and prefer the local skill for the package being changed.
- Multiple matches: prefer the most specific local skill for the package or concern you are changing; load additional skills only when the task spans multiple packages or concerns.
<!-- intent-skills:end -->

Vendored skills also live in `.agents/skills/` (better-auth, shadcn), pinned by
`skills-lock.json` and symlinked into `.claude/skills/`. `.mcp.json` registers
the shadcn MCP server.
