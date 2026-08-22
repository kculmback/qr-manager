---
category: Overlays
---

The right-click menu. Same parts as `DropdownMenu`, but opened by a context-menu gesture on a region rather than by clicking a trigger — use it for direct manipulation of a canvas, chart, or list row where a visible kebab would be noise.

## Anatomy

```jsx
<ContextMenu>
  <ContextMenuTrigger className="…the right-clickable region…">
    Right-click the scan chart
  </ContextMenuTrigger>
  <ContextMenuContent className="min-w-52">
    <ContextMenuGroup>
      <ContextMenuLabel>Series</ContextMenuLabel>
      <ContextMenuCheckboxItem checked>Total scans</ContextMenuCheckboxItem>
      <ContextMenuCheckboxItem>Webhook failures</ContextMenuCheckboxItem>
    </ContextMenuGroup>
    <ContextMenuSeparator />
    <ContextMenuItem><DownloadIcon />Export CSV</ContextMenuItem>
  </ContextMenuContent>
</ContextMenu>
```

**`ContextMenuLabel` must be inside a `ContextMenuGroup` or `ContextMenuRadioGroup`** — otherwise Base UI throws `MenuGroupContext is missing`.

`ContextMenuTrigger` is the hit area, so give it real size and a visible affordance. The rest — `ContextMenuSub`, `ContextMenuRadioGroup`, `ContextMenuShortcut` — behaves exactly as the `DropdownMenu` equivalents.

Never make a context menu the only route to an action: pair it with a visible control.
