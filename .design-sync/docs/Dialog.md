---
category: Overlays
---

A modal surface for a focused task the user opted into — editing a code's destination, creating a new code, explaining a failure. For a yes/no confirmation use `AlertDialog` instead; for a side panel of settings use `Sheet`.

## Anatomy

`Dialog` (state) > `DialogTrigger` + `DialogContent` > `DialogHeader` > (`DialogTitle`, `DialogDescription`) + body + `DialogFooter`.

```jsx
<Dialog>
  <DialogTrigger render={<Button variant="outline" />}>Edit target</DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Edit destination</DialogTitle>
      <DialogDescription>Scans start redirecting here immediately.</DialogDescription>
    </DialogHeader>
    <Field>
      <FieldLabel htmlFor="target">Destination URL</FieldLabel>
      <Input id="target" />
    </Field>
    <DialogFooter>
      <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
      <Button>Save changes</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

- `DialogContent` already renders its own portal and backdrop — never wrap it in `DialogPortal`/`DialogOverlay` yourself. Those are exported only for the rare case where you need a bespoke backdrop.
- The trigger and close are Base UI slots, not buttons. Give them a button with `render={<Button … />}` so they inherit the DS's button styling; the child is the label.
- `DialogFooter` stacks on narrow widths and becomes a right-aligned row at `sm`. Put the confirming action last so it lands on the right.

## Sizing and the close button

`DialogContent` is `sm:max-w-md` by default. Widen it with a class — `className="sm:max-w-lg"` for multi-field forms — rather than setting a fixed width.

```jsx
// no floating × ; a single Close in the footer instead
<DialogContent showCloseButton={false}>
  …
  <DialogFooter showCloseButton />
</DialogContent>
```

`showCloseButton` on `DialogContent` controls the floating × in the top-right (default `true`); the same prop on `DialogFooter` appends an outline "Close" button (default `false`). Use one or the other, not both.

## Notes

- `open`/`onOpenChange` for controlled use, `defaultOpen` for uncontrolled. A dialog opened from a row action usually wants to be controlled so the row can reset it.
- `DialogTitle` is required for accessibility — if the design has no visible title, keep it and hide it with `sr-only` (that is what `CommandDialog` does).
- Anchored, dismissable content belongs in `Popover`, not a `Dialog`; a `Dialog` traps focus and blocks the page.
