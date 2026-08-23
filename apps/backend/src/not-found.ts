/**
 * The page somebody lands on when a scan does not resolve.
 *
 * Three constraints make this a hand-written string rather than a route in the
 * frontend app:
 *
 * 1. **It must be self-contained.** No stylesheet, webfont, image or script
 *    request. This renders in a phone camera's in-app browser, often on a bad
 *    connection, and every extra request is another chance to show a blank
 *    screen to somebody who just pointed their camera at a poster.
 * 2. **It cannot link into the app.** `SHORT_URL_BASE` may be a bare domain
 *    that only forwards `/r/*` here, so `/codes` on that origin is not
 *    guaranteed to exist. Better to explain than to offer a link that 404s
 *    again.
 * 3. **It must not need the frontend at all.** The backend answers short links
 *    directly; a 404 that depended on the frontend being reachable would fail
 *    exactly when things are already going wrong.
 *
 * Colours are the app's own tokens from `packages/ui/src/styles/globals.css`,
 * inlined and switched on `prefers-color-scheme` -- there is no theme cookie to
 * read out here, and the visitor is not a signed-in user.
 */

interface NotFoundCopy {
  /** Browser tab title. */
  title: string;
  /** The large line. */
  heading: string;
  /** The explanation underneath. */
  body: string;
}

function render({ title, heading, body }: NotFoundCopy): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>${title}</title>
<style>
  :root {
    color-scheme: light dark;
    --background: oklch(1 0 0);
    --foreground: oklch(0.148 0.004 228.8);
    --card: oklch(1 0 0);
    --muted-foreground: oklch(0.56 0.021 213.5);
    --border: oklch(0.925 0.005 214.3);
  }
  @media (prefers-color-scheme: dark) {
    :root {
      --background: oklch(0.148 0.004 228.8);
      --foreground: oklch(0.987 0.002 197.1);
      --card: oklch(0.218 0.008 223.9);
      --muted-foreground: oklch(0.723 0.014 214.4);
      --border: oklch(1 0 0 / 10%);
    }
  }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    min-height: 100svh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1.5rem;
    background: var(--background);
    color: var(--foreground);
    /* The app is monospace throughout, but it loads a webfont to get there.
       A system stack keeps the same character without a network request. */
    font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas,
      "Liberation Mono", monospace;
    -webkit-font-smoothing: antialiased;
  }
  main {
    width: 100%;
    max-width: 26rem;
    padding: 2rem 1.5rem;
    border: 1px solid var(--border);
    border-radius: 1rem;
    background: var(--card);
    text-align: center;
  }
  svg { color: var(--muted-foreground); margin-bottom: 1.25rem; }
  h1 {
    margin: 0 0 0.75rem;
    font-size: 1.125rem;
    font-weight: 600;
    letter-spacing: -0.01em;
  }
  p {
    margin: 0;
    font-size: 0.875rem;
    line-height: 1.6;
    text-wrap: pretty;
    color: var(--muted-foreground);
  }
</style>
</head>
<body>
<main>
  <!-- A QR code with its bottom-right quadrant missing: recognisable at a
       glance as "this code, but broken". -->
  <svg width="56" height="56" viewBox="0 0 24 24" fill="none"
       stroke="currentColor" stroke-width="1.6" stroke-linecap="round"
       stroke-linejoin="round" aria-hidden="true">
    <rect x="3" y="3" width="7" height="7" rx="1"/>
    <rect x="14" y="3" width="7" height="7" rx="1"/>
    <rect x="3" y="14" width="7" height="7" rx="1"/>
    <path d="M14 14h2"/>
    <path d="M19 14h2"/>
    <path d="M14 19h2"/>
    <path d="M21 19v2"/>
    <path d="M19 17h2"/>
  </svg>
  <h1>${heading}</h1>
  <p>${body}</p>
</main>
</body>
</html>
`;
}

/**
 * A short link that resolves to nothing: the code was deleted, was switched to
 * static, or the slug was mistyped. Deliberately does not distinguish between
 * those -- a stranger who scanned a poster has no business learning which
 * slugs on this instance exist.
 */
export const SHORT_LINK_NOT_FOUND_PAGE = render({
  title: "Code not found",
  heading: "This code doesn't lead anywhere",
  body: "The short link you scanned is not active. It may have been deleted, or the code may not have scanned cleanly — try again, and check the link if you typed it by hand.",
});

/** Any other unknown path on this backend. */
export const NOT_FOUND_PAGE = render({
  title: "Not found",
  heading: "Nothing here",
  body: "That address does not exist on this server.",
});
