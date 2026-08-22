---
category: Overlays
---

A panel that slides in from an edge. Use it for secondary flows that need more room than a `Popover` but shouldn't take over the screen like a `Dialog` — an edit panel, a filter drawer, mobile navigation.

```jsx
<Sheet>
  <SheetTrigger render={<Button variant="outline" />}>Edit destination</SheetTrigger>
  <SheetContent side="right">
    <SheetHeader>
      <SheetTitle>Edit destination</SheetTitle>
      <SheetDescription>This code is dynamic — the printed image never changes.</SheetDescription>
    </SheetHeader>
    <div className="flex flex-col gap-4 px-4">…</div>
    <SheetFooter>
      <Button>Save changes</Button>
      <SheetClose render={<Button variant="outline" />}>Cancel</SheetClose>
    </SheetFooter>
  </SheetContent>
</Sheet>
```

- `side` is `"right"` (default), `"left"`, `"top"` or `"bottom"`. Left/right panels are `w-3/4` capped at `sm:max-w-sm`; top/bottom size to their content.
- `SheetHeader` and `SheetFooter` own their padding; body content needs its own `px-4`.
- Always give it a `SheetTitle` — it names the dialog for assistive tech.
- On touch-first surfaces prefer `Drawer`, which has the swipe affordance.
