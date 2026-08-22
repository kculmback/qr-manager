---
category: Feedback
---

The indeterminate loading indicator — a spinning `Loader2Icon` with `role="status"` and an `aria-label` of "Loading" already applied. Reach for it when the duration is unknown; when you have a percentage, use `Progress`.

## Usage

It renders an `<svg>`, so it behaves like any other icon: `size-4` by default, and it inherits `currentColor`.

```jsx
// inside a button — the button owns the disabled state
<Button disabled>
  <Spinner data-icon="inline-start" />
  Generating…
</Button>

// icon-only button
<Button size="icon" variant="ghost" aria-label="Saving">
  <Spinner />
</Button>

// inline with status text
<div className="text-muted-foreground flex items-center gap-3 text-sm">
  <Spinner />
  Resolving 42 short links…
</div>
```

- Change the size with a `size-*` class (`size-3` inline in dense text, `size-6`/`size-8` for a centered block). Colour it with `text-muted-foreground` when it sits next to muted copy — bare, it takes the surrounding text colour.
- Inside a `Button`, pass `data-icon="inline-start"` exactly as you would for a real icon, and keep the label text: replacing the label with a lone spinner makes the button change width.
- For a whole region that is loading, centre it in an `Empty` block (`EmptyMedia variant="icon"` + `EmptyTitle`) rather than floating it on its own.

## Notes

- The accessible name is built in. Only pass `aria-label` if "Loading" is wrong for the context; never set `aria-hidden` on the only loading affordance on screen.
- One spinner per waiting region. A page with four spinners reads as broken, not busy.
