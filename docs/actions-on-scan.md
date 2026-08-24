# Actions on scan — design

Status: **proposed, nothing built.** No table, route, or validator in this
document exists yet. It fixes the model before the first migration, because the
decisions here are hard to reverse once printed codes depend on them.

Background is in [`CLAUDE.md`](../CLAUDE.md) → "Where this is going". The short
version: `/r/:slug` resolves a destination, records the scan, and fires
user-configured side effects. That handler already exists
(`apps/backend/src/index.ts`) and already reserves the spot:

> Scan records and actions-on-scan belong here, and must be fire-and-forget:
> the person who scanned the code is waiting on this response.

## The split that drives everything

"Action" is two different things wearing one name, and they have opposite
latency budgets:

|          | **Resolver**                          | **Effect**                                 |
| -------- | ------------------------------------- | ------------------------------------------ |
| Question | _Where does this scan go?_            | _What else happens because of this scan?_  |
| Runs     | In-request, before the response       | After the response is committed            |
| Budget   | Single-digit milliseconds             | Seconds; retries across minutes            |
| May do   | Read local DB, read request headers   | Anything, including outbound network calls |
| Must not | Touch the network                     | Influence what the scanner sees            |
| Failure  | Falls back to the code's base payload | Retried, then surfaced in the UI           |
| Example  | "iOS → App Store, else the web app"   | "POST to my Home Assistant webhook"        |

**Do not model these as one list.** A single ordered `actions` array means a
slow webhook can delay someone standing in front of a poster in a parking lot,
and the only fix at that point is a migration. Two concepts, two tables, two
execution phases.

The rest of this document treats **effects** as v1 and **resolvers** as a later
project. Effects are where the motivating use case lives (the Home Assistant
webhook), they do not touch the hot path, and they force us to solve durability
and outbound-request safety while the surface is still small.

## Request shape

```
GET /r/:slug
  │
  ├─ Cache-Control: no-store                    (already done — before everything)
  ├─ load Code by slug                          (already done)
  ├─ reject unless mode === "dynamic"           (already done)
  │
  ├─ classify the request                       NEW  bot? prefetch? real scan?
  ├─ RESOLVERS (later)                          NEW  in-request, DB only, ordered
  │
  ├─ write scan + action_run rows, one txn      NEW  the outbox
  ├─ respond: 302, or the vCard body            (already done)
  │
  └─ (out of band) worker drains action_run     NEW  retries, backoff, status
```

The response is never held for an effect. The transaction that records the scan
is the same one that enqueues the effects, so "the scan happened but the
webhook was never queued" is not a reachable state.

## Data model

Four new tables. Conventions follow `packages/db/src/schema.ts` as it stands:
`text({ enum })` rather than `pgEnum` (new values are a matter of when, not if,
and `ALTER TYPE ... ADD VALUE` cannot be used in the transaction that adds it —
which is exactly how Drizzle applies migrations), `jsonb().$type<T>()` for
type-discriminated config, and no hand-written column names.

### `scan`

Its own table, not a counter column on `code` — analytics needs the time series,
and effects need something to point at.

| Column           | Notes                                                                                                             |
| ---------------- | ----------------------------------------------------------------------------------------------------------------- |
| `id`             | uuid pk                                                                                                           |
| `codeId`         | → `code.id`, `cascade`. Deleting a code retires its history.                                                      |
| `scannedAt`      | timestamptz, indexed with `codeId` for the time-series queries                                                    |
| `medium`         | copied from the code at scan time — a code's medium can be edited, and history should not silently rewrite itself |
| `ip`             | see "Client identity behind the proxy" below                                                                      |
| `userAgent`      | raw, plus a parsed `device` / `os` for grouping                                                                   |
| `referrer`       | nullable, usually absent for a camera scan                                                                        |
| `country`        | nullable, coarse only                                                                                             |
| `classification` | `human` \| `bot` \| `prefetch` — see "Phantom scans"                                                              |

`classification` is a column rather than a filter applied at read time so that
one classifier change does not retroactively rewrite last quarter's numbers.

### `code_action`

The user's configuration: _this code, when scanned, does this._

| Column     | Notes                                                               |
| ---------- | ------------------------------------------------------------------- |
| `id`       | uuid pk                                                             |
| `codeId`   | → `code.id`, `cascade`                                              |
| `type`     | `text({ enum: ACTION_TYPES })` — `webhook`, `mqtt`, `notify`, …     |
| `config`   | `jsonb().$type<ActionConfig>()`, discriminated by `type`            |
| `enabled`  | boolean, default true — pausing an action must not mean deleting it |
| `position` | ordering for display; effects have no ordering semantics at runtime |

This mirrors the existing `Code.type` / `Code.payload` pair exactly, including
the reason: a `codeActionSchema` discriminated union in `packages/validators`
validates the pair as a unit, so an MQTT config can never be stored against
`type: "webhook"`. Put it beside the payload registry — same `registry.ts`
shape, same `satisfies` presence check.

### `action_run`

The outbox. One row per (action, scan).

| Column      | Notes                                                       |
| ----------- | ----------------------------------------------------------- |
| `id`        | uuid pk                                                     |
| `actionId`  | → `code_action.id`, `cascade`                               |
| `scanId`    | → `scan.id`, `cascade`                                      |
| `status`    | `pending` \| `running` \| `succeeded` \| `failed` \| `dead` |
| `attempts`  | int, default 0                                              |
| `runAfter`  | timestamptz — backoff, and the worker's claim predicate     |
| `snapshot`  | jsonb — the resolved config used for _this_ run             |
| `lastError` | text, nullable, user-facing                                 |

`snapshot` matters: without it, editing an action's URL rewrites the history of
what already fired, and the user's debugging question ("what did it actually
send?") becomes unanswerable.

Partial index on `(status, runAfter)` where `status IN ('pending','running')`,
so the claim query stays cheap as the table grows.

### `code_rule` (resolvers, later)

Ordered, first-match-wins, per code: `condition` jsonb + a destination override.
Deliberately deferred. Ordering semantics, the fallback chain, and the
interaction with per-type payloads all deserve their own pass, and none of it
blocks effects.

## Effect types

**v1 — one type, most of the value:**

- **`webhook`** — an HTTP request to a user-supplied URL. Method, headers, and a
  templated JSON body with scan context. This one action subsumes Home
  Assistant automation triggers, n8n, Node-RED, Discord and Slack incoming
  webhooks, ntfy, Gotify, and Zapier. Build it well rather than building five
  thin wrappers.

**v1.1 — presets over the same row.** "Notify me by email/push" is mechanically
a webhook, but "text me when someone scans the front-door sign" is a different
mental model than "call this URL". A preset is a nicer form that writes a
`webhook` config; it is not a new action type.

**Later, genuinely different mechanics:**

- **`mqtt`** — the other native home-lab verb. Different transport entirely:
  persistent connection, broker credentials, no SSRF surface, but a connection
  pool the worker has to own.
- **`home_assistant`** — a real service call (`light.turn_on`) against the REST
  API with a long-lived token, as opposed to firing an automation trigger. More
  useful than a webhook, and more secret-handling.
- **`set_field`** — write back to the code itself: "last seen at", "marked
  inventoried". No network at all. Turns a code into an asset tag.

Explicitly **not** an action type: shell command execution. It converts a
public, unauthenticated HTTP endpoint into remote code execution on the host,
and no config flag makes that a good default for a self-hosted app.

## Durability: why the outbox is not optional

Fire-and-forget on Node is a lie without one. A floating promise dies when the
process exits, and `apps/backend/src/index.ts` deliberately drains and closes
the pool on `SIGINT`/`SIGTERM` — Docker stops containers with `SIGTERM`, so
every deploy and restart silently drops whatever was in flight.

The outbox makes the failure mode legible instead of invisible:

- Enqueue in the same transaction as the scan row.
- A worker claims due rows with `SELECT ... FOR UPDATE SKIP LOCKED` and marks
  them `running`. `SKIP LOCKED` is what lets a second backend replica be added
  later without a coordination story.
- Exponential backoff on `runAfter`; a capped attempt count, then `dead`.
- Stale `running` rows (worker killed mid-flight) get reclaimed by age.
- `lastError` is user-facing. "Did my webhook fire?" must be answerable in the
  UI, per-scan, without reading container logs.

The worker runs in the backend process for now. It is deliberately a separate
module with no Hono dependency so it can become its own container later without
a rewrite.

## Outbound request safety

The SSRF threat model here is **inverted** relative to a SaaS app. For a
self-hosted QR manager on a home network, reaching `http://192.168.1.50:8123`
_is the feature_. A blanket private-IP block would break the single motivating
use case, so this cannot be a hardcoded rule — it is operator policy.

**Operator policy (new env vars):**

- `ACTIONS_ALLOW_PRIVATE_NETWORKS` — default `false`. Off, RFC1918 and loopback
  targets are rejected. Home-lab operators turn it on knowingly.
- `ACTIONS_ALLOWED_HOSTS` — optional allowlist. When set, it is the whole
  policy and the flag above is irrelevant.

**Unconditional, regardless of policy:**

- Never follow redirects to a different host. A `302` to `169.254.169.254` is
  the classic bypass.
- Resolve the hostname, validate the resolved IP, then connect to _that IP_ —
  otherwise DNS rebinding walks straight through the check between validation
  and connection.
- Always block link-local `169.254.0.0/16` (cloud instance metadata), even when
  private networks are allowed. A home lab has no reason to reach it and a
  cloud deployment must not.
- Hard connect and total timeouts; cap the response body size.
- Never surface the response body to the user. Status code and timing only —
  the body is the exfiltration channel that makes SSRF worth exploiting.

Adding these env vars touches five places; see CLAUDE.md → "Adding an
environment variable touches five places".

## Secrets at rest

Webhook bearer tokens, HA long-lived tokens, and MQTT passwords all live in
`code_action.config`. They are read back by the worker, so hashing is not an
option — this needs symmetric encryption keyed off a new secret, with the
plaintext never returned by the tRPC read path (write-only fields, "•••••
configured" in the UI). Worth settling before the first action type ships,
because migrating plaintext secrets afterwards means asking every user to
re-enter them.

## Trust: a code in the wild is a public trigger

Anyone who photographs the sign can fire the action, as many times as they
like, from anywhere. That is fine for "log a scan" and alarming for "unlock the
door".

- Per-code rate limiting on effect dispatch, independent of the redirect itself
  — the redirect should keep working even once effects are being throttled.
- Anything with a real-world consequence wants a confirmation interstitial
  rather than firing on the bare redirect. That is a per-action
  `requiresConfirmation` flag, and it is the one case where an effect gets to
  change what the scanner sees — so it belongs in the config, not in the
  execution model.
- The UI should say this out loud when a webhook is configured. Users will
  reach for door locks and garage doors immediately.

## Phantom scans

iMessage, Slack, WhatsApp, Discord, and every link-preview crawler prefetch
URLs. Share a short link in a group chat and every member's client hits `/r/…`
before a human ever does. Untreated, that inflates analytics _and_ fires
effects — someone's lights turn on because a link was pasted into a chat.

Classification therefore belongs at the redirect, before either feature reads
it, and is shared by both:

- `HEAD` requests, and `GET` from known bot user agents.
- Missing `Accept: text/html` on what claims to be a browser.
- `Sec-Purpose: prefetch` / `Purpose: prefetch`.

Bot-classified requests still get a correct redirect and still get a `scan` row
(with `classification = 'bot'`), but enqueue no effects. Preserving the row is
what makes the classifier auditable when someone reports a missing scan.

### Client identity behind the proxy

The stack sits behind Caddy (`/api/*` and `/r/*` both proxied), so the socket
peer is always the proxy. IP and geo must come from `X-Forwarded-For` — and
because that header is trivially spoofable when it is _not_ set by a trusted
proxy, the number of trusted hops has to be configuration, not a guess. Getting
this wrong means either every scan is attributed to the Docker bridge network,
or any scanner can forge their own country.

## Constraints inherited from the current model

- **Static codes can never have effects.** The backend never sees the scan.
  `/r/:slug` already returns 404 for `mode !== "dynamic"`. The UI must _explain_
  the empty actions tab rather than hide it, or every Wi-Fi code looks broken.
- **Only `url` and `vcard` are dynamic-capable today** (`supportsDynamic` in the
  payload registry). Everything else is static-only, so the actions surface is
  reachable from exactly two types at launch.
- **`vcard` responds with a body, not a redirect.** Effects work identically —
  they do not care what the response was. Resolvers largely do not apply, since
  there is no destination to choose. Worth remembering when resolvers are
  designed, so they do not get built assuming a `Location` header exists.
- **Nothing here is QR-specific**, which is consistent with `code.medium`. An
  NFC tap hits the same `/r/:slug` and gets the same effects; `medium` becomes
  one more field in the scan context. No action type should name QR.
- **Short links may live on their own origin** (`SHORT_URL_BASE`), so anything
  that builds a URL for a confirmation interstitial must go through
  `buildShortUrl` rather than assuming `BACKEND_URL`.

## Build order

1. **`scan` table + request classification.** No user-facing feature, but it is
   the shared foundation for analytics and effects, and it is the piece that is
   painful to retrofit.
2. **Outbox plumbing** — `code_action`, `action_run`, the worker, retry and
   status. Ship it with a single trivial action type to prove the machinery.
3. **`webhook`** with the full outbound-safety policy and encrypted secrets.
   This is the release that delivers the Home Assistant use case.
4. **Notification presets** over the same row.
5. **Analytics UI** — the `scan` table finally becomes visible.
6. **Resolvers** — separate design pass. Hot path, ordering semantics, their own
   risks.

## Open questions

- **Retention.** `scan` and `action_run` grow without bound. Per-instance
  retention window, or roll up into daily aggregates past some age? Affects
  whether the analytics queries can assume raw rows.
- **Are resolvers per-code or reusable?** A "route iOS to the App Store" rule is
  the same rule on fifty codes. Reusable rule sets are better modelling and a
  much larger surface.
- **Do effects need the resolved destination in their context?** Only if
  resolvers ship first, which they will not. Reserve the field.
- **Confirmation interstitial ownership** — backend-rendered like the existing
  404 page, or a frontend route? The 404 is a backend HTML constant today, and
  a second one argues for a small shared template rather than a third.
