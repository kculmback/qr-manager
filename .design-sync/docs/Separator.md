---
category: Layout
---

A one-pixel rule that divides content. Use it where a gap alone doesn't make the grouping clear — between a card's header and its body, between rows of a list, between stats in a toolbar.

```jsx
<Separator />                         // horizontal, full width
<Separator orientation="vertical" />  // vertical, stretches to the flex row
```

## How it sizes itself

There is no `size` prop — orientation drives it:

- **horizontal** — `h-px w-full`. Drop it between blocks in a normal flow; it needs no wrapper.
- **vertical** — `w-px self-stretch`. It only appears inside a **flex row that has a height**. If the vertical rule is invisible, the parent has no height: give the row `h-5`/`items-center` or `items-stretch`, not the separator a height.

```jsx
<div className="flex h-5 items-center gap-4 text-sm">
  <span>4,812 scans</span>
  <Separator orientation="vertical" />
  <span>903 devices</span>
</div>
```

## Notes

- Built on base-ui's Separator, so it renders with `role="separator"` — it is decorative-plus-semantic; don't wrap it in extra roles.
- The colour is `bg-border`. Change it only when the surface changes too (the sidebar uses `bg-sidebar-border`, which is what `SidebarSeparator` does for you).
- Inside a `Card`, place it as a direct child *between* `CardHeader` and `CardContent` so it spans the full card width; putting it inside `CardContent` inherits the content padding and reads as a mistake.
- Form field groups have their own divider (`FieldSeparator`) that adds the right vertical rhythm — use that inside a `FieldGroup` rather than a bare `Separator`.
