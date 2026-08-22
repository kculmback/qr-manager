---
category: Overlays
---

Anchored, dismissable content attached to a trigger — scan details for a row, a quick edit of a redirect target, a campaign summary. It takes focus (unlike `Tooltip` and `HoverCard`) so it may contain inputs and buttons, but it does not block the page the way `Dialog` does.

## Anatomy

```jsx
<Popover>
  <PopoverTrigger render={<Button variant="outline" size="sm" />}>Last scan</PopoverTrigger>
  <PopoverContent>
    <PopoverHeader>
      <PopoverTitle>Last scan</PopoverTitle>
      <PopoverDescription>14 May 2024, 09:41 — resolved in 38 ms.</PopoverDescription>
    </PopoverHeader>
    <Separator />
    …
  </PopoverContent>
</Popover>
```

- `PopoverContent` renders its own portal and positioner; there is nothing to wrap. It is `w-72` and `flex flex-col gap-4`, so direct children are spaced for you — don't add margins between them, and widen with `className="w-80"` when a form needs it.
- `PopoverHeader` groups the title and description into one block so the gap between them is tighter than the gap between sections.

## Placement

`side` (`top` | `right` | `bottom` | `left`, plus the logical `inline-start`/`inline-end`), `align` (`start` | `center` | `end`), `sideOffset` and `alignOffset` are lifted onto `PopoverContent` — set them there, not on a positioner.

```jsx
<PopoverContent side="right" align="start" sideOffset={8}>…</PopoverContent>
```

Defaults are `side="bottom"` `align="center"` `sideOffset={4}`. The popup flips and shifts to stay on screen, so treat these as a preference rather than a guarantee.

## Notes

- Use `Popover` when the content is interactive, `HoverCard` when it is a passive preview, `DropdownMenu` when it is a list of commands, and `Tooltip` when it is a label.
- `open`/`onOpenChange` for controlled use, `defaultOpen` for uncontrolled.
- A popover inside a scrolling table row is fine — it portals out, so it will not be clipped by `overflow-hidden`.
