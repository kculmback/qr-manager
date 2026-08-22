---
category: Overlays
---

A bottom-sheet style panel with swipe-to-dismiss. Use it where a sheet would be right but the surface is touch-first, or where snap points matter.

```jsx
<Drawer>
  <DrawerTrigger render={<Button variant="outline" />}>Download</DrawerTrigger>
  <DrawerContent>
    <DrawerSwipeHandle />
    <DrawerHeader>
      <DrawerTitle>Download QR code</DrawerTitle>
      <DrawerDescription>Pick a format for “Spring launch flyer”.</DrawerDescription>
    </DrawerHeader>
    <div className="flex flex-col gap-2 px-4">…</div>
    <DrawerFooter>
      <DrawerClose render={<Button variant="ghost" />}>Cancel</DrawerClose>
    </DrawerFooter>
  </DrawerContent>
</Drawer>
```

- `swipeDirection` (default `"down"`) sets the dismiss gesture; `showSwipeHandle` renders the grab affordance, and you place `DrawerSwipeHandle` where it should sit.
- `snapPoints` turns it into a multi-stop drawer — a partially-open state plus full height.
- `modal` (default `true`) controls whether the rest of the page is inert.

For a side panel on desktop, use `Sheet`.
