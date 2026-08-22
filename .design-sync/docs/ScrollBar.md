---
category: Layout
---

The scrollbar rendered by `ScrollArea`. You only place it yourself to add an axis the default doesn't cover.

```jsx
<ScrollArea className="w-96 whitespace-nowrap rounded-xl border">
  <div className="flex gap-3 p-4">…</div>
  <ScrollBar orientation="horizontal" />
</ScrollArea>
```

`orientation` is `"vertical"` (default) or `"horizontal"`. It must be a child of a `ScrollArea` — outside one it has no scroll state to bind to and renders nothing useful.

A vertical bar is already included, so the only common reason to write `ScrollBar` is the horizontal case above.
