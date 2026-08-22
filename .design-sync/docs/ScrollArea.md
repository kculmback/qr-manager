---
category: Layout
---

A scroll container with styled, overlay scrollbars that match the design system instead of the OS default.

```jsx
<ScrollArea className="h-72 w-full rounded-xl border">
  <div className="p-4">…long content…</div>
</ScrollArea>
```

**`ScrollArea` needs a bounded height** (`h-72`, `max-h-*`, or a flex parent that constrains it) — without one it grows and never scrolls.

It renders a vertical `ScrollBar` by default. For horizontal scrolling, add one explicitly:

```jsx
<ScrollArea className="w-96 whitespace-nowrap rounded-xl border">
  <div className="flex gap-3 p-4">…</div>
  <ScrollBar orientation="horizontal" />
</ScrollArea>
```

Use it for in-page panes — menus, long lists, code blocks. Don't wrap the whole page in one; let the document scroll natively.
