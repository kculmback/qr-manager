---
category: Overlays
---

A short label for a control that can't carry one — icon buttons, truncated slugs, a stat whose units need spelling out. Tooltips are hover/focus only and hold no interactive content; anything the user must click belongs in a `Popover`.

## Provider

`TooltipProvider` must be an ancestor — it owns the shared open/close delay so moving between neighbouring triggers doesn't re-wait. Mount it **once** near the app root (the frontend does this in `__root.tsx`), not per tooltip.

```jsx
<TooltipProvider>
  <App />
</TooltipProvider>
```

`delay` defaults to `0` in this DS; raise it on the provider if tooltips feel twitchy.

## Anatomy

```jsx
<Tooltip>
  <TooltipTrigger render={<Button variant="ghost" size="icon" aria-label="Copy short link" />}>
    <CopyIcon />
  </TooltipTrigger>
  <TooltipContent>Copy short link</TooltipContent>
</Tooltip>
```

- `TooltipTrigger` is a slot: pass the real control through `render` so it keeps its own styling and semantics.
- A tooltip is **not** an accessible name. Keep `aria-label` on an icon-only button even when the tooltip repeats it.
- `TooltipContent` portals and draws its own arrow — you never render one.

## Placement and content

`side` (default `top`), `align`, `sideOffset` and `alignOffset` are lifted onto `TooltipContent`. The arrow re-orients itself for the resolved side.

```jsx
<TooltipContent side="right">Dynamic code — target is editable</TooltipContent>
```

The popup is `inline-flex` with `gap-1.5` and `max-w-xs`, so a label plus `Kbd` chips lays out on one line and long text wraps rather than stretching:

```jsx
<TooltipContent>
  Download PNG
  <Kbd>⌘</Kbd>
  <Kbd>S</Kbd>
</TooltipContent>
```

`Kbd` children get their own contrast treatment against the inverted surface — no extra classes needed.

## Notes

- Keep it to a few words. If you need a title and a paragraph, that's a `HoverCard`.
- Never put the only copy of an instruction in a tooltip — touch users never see it.
