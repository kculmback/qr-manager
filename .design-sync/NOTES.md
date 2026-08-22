# design-sync notes — @qr-manager/ui → claude.ai/design

Project: **QR Manager UI** — https://claude.ai/design/p/be90c315-921e-4dcf-9df8-a1c1e1c80c4f

## Source shape

- Shape is `package`. There is no Storybook and no `*.stories.*` anywhere in the
  repo (confirmed with the user 2026-08-21).
- Source is `packages/ui` — shadcn-style components plus a vendored `reui/`
  subtree (cascader, data-grid, filters). The user scoped in **everything**.
- Package manager is pnpm; install with `pnpm i --frozen-lockfile`.

## The package has no build — `.design-sync/build-dist.mjs` makes one

`packages/ui` ships raw `src/*.tsx` through subpath exports (`./components/*`)
and has no `build` script, no `dist/`, and no `types` field. The converter needs
a bundlable entry **and** a `.d.ts` tree, so `cfg.buildCmd` runs
`node .design-sync/build-dist.mjs`, which writes (all gitignored):

| Path | What |
|---|---|
| `packages/ui/ds-entry.ts` | barrel re-exporting every `src/components/**/*.tsx` |
| `packages/ui/ds-dist/**/*.d.ts` | `tsc` declaration emit — the real prop contracts |
| `packages/ui/index.d.ts` | types entry; `lib/dts.mjs` looks for it at the package root |
| `packages/ui/ds-dist/styles.css` | compiled Tailwind v4 stylesheet (`cfg.cssEntry`) |
| `packages/ui/ds-dist/files/*.woff2` | fontsource files, next to the css so `url(./files/…)` resolves |
| `.design-sync/.cache/nm/node_modules` | symlink view of `packages/ui/node_modules` + `react-dom` |

Gotchas baked into that script, each of which cost a debugging cycle:

- **Don't pass a pre-bundled `ds-dist/index.js` as `--entry`.** Bundling it with
  `--external:react` leaves `__require("react")` inside CJS deps, and every
  preview then throws `Dynamic require of "react" is not supported`. Point
  `--entry` at **`packages/ui/ds-entry.ts`** and let the converter's esbuild
  (which shims react → `window.React`) do the bundling.
- **Nothing may be dot-prefixed.** ts-morph's glob skips dotfiles, so a
  `.ds-dist/` tree parses as 0 `.d.ts` files and the run silently degrades to
  `[ZERO_MATCH] tokens-only DS`.
- **`incremental` must be off for the declaration emit.** The shared
  `tooling/typescript/base.json` sets `incremental: true` with a package-level
  `tsBuildInfoFile`, so the second run emits nothing at all (and would trample
  the buildinfo `pnpm typecheck` uses). `ds-tsconfig.json` sets
  `incremental: false, tsBuildInfoFile: null`.
- `tsc` reports pre-existing strictness errors in `src/components/reui/filters/*`
  and `reui/cascader/*` (`noUncheckedIndexedAccess`). They are the repo's, not
  the sync's; declarations still emit. Don't chase them.
- **`react-dom` is not a dependency of `@qr-manager/ui`** (it's a peer of the
  apps), but the converter vendors ReactDOM. Hence the symlinked node_modules
  view, which adds `react-dom`/`scheduler` from `apps/frontend/node_modules`
  (same 19.2.8 pin). It must be *named* `node_modules` or esbuild refuses to
  resolve bare specifiers out of it.

## The dts.mjs fork (`cfg.libOverrides`)

shadcn exports subparts flat (`Card`, `CardHeader`, `CardTitle`, …) with no
`Card.Header` namespace, so the bundled `partitionSubcomponents` can't fold
them: the raw discovery is **366 components**. `.design-sync/overrides/dts.mjs`
adds two fallbacks, giving **56 roots / 310 subparts**:

1. **Directory primary** — the export declared in the file named after its own
   directory (`reui/cascader/cascader.d.ts` → `Cascader`) owns everything else
   declared under that directory. This is what collapses cascader, data-grid and
   filters to one card each. Generic dirs (`components/`, `src/`, `lib/`, `ui/`,
   `reui/`) are skipped so it can't over-fire.
2. **Same file + PascalCase prefix** — `Card`/`CardHeader` are declared side by
   side in `card.d.ts` so `CardHeader` folds; `Button` (`button.d.ts`) and
   `ButtonGroup` (`button-group.d.ts`) are not, so `ButtonGroup` stays a root.

Subparts stay in the bundle and importable (`window.QrManagerUI` has 570
exports) and are listed under their parent. To force a name back to a root, pin
it non-null in `cfg.componentSrcMap` — `package-build.mjs` deletes pinned names
from `parentOf`.

`reui/badge.tsx` exports a **second `Badge`** that collides with
`components/badge.tsx`. `build-dist.mjs` leaves it out of the barrel; it is
still bundled because `data-grid-column-filter.tsx` imports it.

## Styling

- `packages/ui/src/styles/globals.css` is a Tailwind v4 **source** file, not a
  stylesheet. `.design-sync/ds-styles.css` imports it and is what gets compiled
  (`pnpm dlx @tailwindcss/cli@4.3.3`).
- It adds `@source inline(...)` safelists (user-approved 2026-08-21). Without
  them the compiled CSS only carries classes this repo happens to use, and every
  utility the design agent reaches for in new markup renders unstyled. Result is
  ~870 KB of CSS — deliberate.
- It also `@source`s `.design-sync/previews/*.tsx`, because preview files sit
  outside the package's own globs. **A utility used only in a preview needs
  either that scan or a safelist entry** — otherwise the card renders unstyled.
- `font-serif` was removed from the safelist: the DS has no serif family and
  safelisting it made `[FONT_MISSING] "Cambria"` fire off Tailwind's default
  serif stack. Don't add it back.
- Fonts that DO ship: `JetBrains Mono Variable` (`--font-mono`) and
  `Geist Mono Variable` (`--font-heading`). There is no `--font-sans` override —
  body text uses Tailwind's system sans stack, by the DS's own choice.

## Previews

- Import from the **bare package name**: `import { Button } from "@qr-manager/ui"`
  → resolves to `window.QrManagerUI`. A subpath import
  (`@qr-manager/ui/components/button`) would bundle a *duplicate* copy from
  source and break React context identity.
- `cfg.provider` wraps every card in `ThemeProvider` → `TooltipProvider`, which
  is exactly what `apps/frontend/src/routes/__root.tsx` does. `ThemeToggle`
  throws without `ThemeProvider`; `Tooltip` needs `TooltipProvider`.
- Keep a story narrower than the grid cell or it trips `[GRID_OVERFLOW]`.
  `Field` is already set to `{"cardMode": "column"}` for this reason.

## Known render warns (triaged — not new)

- `[TOKENS_MISSING]` for 12 custom properties (`--toast-index`,
  `--toast-swipe-movement-x/y`, `--toast-height`, `--toast-offset-y`,
  `--nested-drawers`, `--drawer-swipe-progress`, `--filter-panel-pad`, …).
  These are set at runtime by Toast/Drawer/Filters via inline styles, so no
  stylesheet defines them. Expected — do not chase.

## Environment

- Playwright: `playwright@1.62.0` pins chromium build **1234**, which is already
  in `~/Library/Caches/ms-playwright/`. Installing any other version triggers a
  ~200 MB download. Install with `PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1`.

## Re-sync risks

- `ds-styles.css` duplicates the semantic token names from `globals.css` in its
  safelist. **Adding a token there does not add it here** — the new
  `bg-<token>`/`text-<token>` utilities silently won't exist for the design
  agent. Check that list whenever `:root` in `globals.css` changes.
- The `dts.mjs` fork is a copy of the bundled lib. On re-sync, diff it against
  `.ds-sync/lib/dts.mjs` and merge upstream changes; the fork's own additions are
  confined to `fileOf`/`primaryOfDir` in `partitionSubcomponents` plus the block
  at the end of `loadDts`.
- The Tailwind CLI version is pinned in `build-dist.mjs` (`@tailwindcss/cli@4.3.3`)
  and fetched over the network via `pnpm dlx`. It must track the `tailwindcss`
  catalog version in `pnpm-workspace.yaml`.
- `react-dom` is borrowed from `apps/frontend/node_modules`. If the apps ever
  drop React or diverge from the version `packages/ui` resolves, the vendored
  ReactDOM and the bundle's React will mismatch.

## Findings in the design system itself (not sync issues)

These are real defects in `packages/ui`, surfaced by rendering every component in
isolation. Nothing in the sync can fix them; both are documented in the uploaded
`.prompt.md` files and the README conventions header.

1. **`ThemeToggle` renders an empty button in every theme.** `theme.tsx` switches
   its three icons with `light:` / `auto:` / `dark:` variants, but
   `src/styles/globals.css` declares only `@custom-variant dark (&:is(.dark *))`.
   `light:scale-100!` and `auto:scale-100!` therefore compile to nothing while the
   trigger's base class sets `[&>svg]:scale-0`. A second defect compounds it: the
   trigger styles its icons `[&>svg]:absolute` but neither it nor `Button` sets
   `relative`, so the icons are positioned against an unrelated ancestor. The fix
   is upstream: declare the two missing variants **and** add `relative`. Its three
   preview cells are deliberately graded `needs-work` — they are honest.
2. **`reui/badge.tsx` uses `bg-focus` / `text-focus-foreground`,** but no
   `--focus` token is defined in `globals.css`. That variant renders unstyled.
   (`reui/badge` is excluded from the sync barrel anyway — it collides with
   `components/badge.tsx` — so it does not reach the design agent.)

## More gotchas worth knowing next time

- **`recharts` must be in `cfg.extraEntries`.** Without it the preview compiles
  its own copy while `ChartContainer` uses the bundle's, the two
  `ResponsiveContainer` contexts don't match, and **every chart renders zero
  SVG** — with no error and a non-empty root, so the render check passes and only
  the screenshot reveals it. The cost is `[EXPORT_COLLISION]`: recharts also
  exports `Tooltip` and `Label`, which the DS's own exports win. Documented in
  the conventions header.
- **Disable recharts animation in previews** (`isAnimationActive={false}` on every
  `Bar`/`Line`), or the headless screenshot catches the chart mid-flight and
  series appear truncated.
- **Base UI group labels need their group.** `DropdownMenuLabel` and
  `ContextMenuLabel` are `Menu.GroupLabel`; outside a `DropdownMenuGroup` /
  `ContextMenuGroup` / `*RadioGroup` they throw `MenuGroupContext is missing`.
- **Finish all config changes before grading.** Any edit to
  `.design-sync/config.json` or `.design-sync/overrides/` moves the grade key and
  clears every verdict — a full 56-component re-grade. Editing
  `.design-sync/conventions.md` alone does **not** clear grades (verified: 55/56
  carried forward across a header-only change).
- **A scoped `package-capture.mjs --components …` run prunes the other review
  sheets.** Grades survive, but the PNGs are deleted, so a later grading pass
  needs a full capture first.
- The full build now takes **longer than 10 minutes** with 56 authored previews —
  run it as a background task, and never upload from a bundle whose build was
  interrupted (`components/` ends up empty and `styles.css` / `_ds_sync.json` are
  missing).

## Known render warns (triaged — not new)

- `[TOKENS_MISSING]` for 12 custom properties (`--toast-index`,
  `--toast-swipe-movement-x/y`, `--toast-height`, `--toast-offset-y`,
  `--nested-drawers`, `--drawer-swipe-progress`, `--filter-panel-pad`, …). Set at
  runtime by Toast/Drawer/Filters via inline styles, so no stylesheet defines
  them. Expected.
- `[RENDER_THIN]` on **Sheet** and **Drawer** — measured height 1px because both
  portal their content out of the measured root. Both screenshots were confirmed
  by eye: they render correctly. Benign.

## Grading state

All 56 components authored and graded. 53 grade `good` across every cell;
`ThemeToggle`'s 3 cells are `needs-work` for the upstream defect above. Grades
live in the gitignored `.design-sync/.cache/review/`; the durable carry-forward
is the uploaded `_ds_sync.json`, so a re-sync on any machine skips re-verifying
unchanged components.
