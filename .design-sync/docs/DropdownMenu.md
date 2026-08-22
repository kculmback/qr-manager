---
category: Overlays
---

The action menu hung off a trigger — row actions, a "more" kebab, a filter or sort menu.

## Anatomy

```jsx
<DropdownMenu>
  <DropdownMenuTrigger render={<Button variant="ghost" size="icon" aria-label="Actions" />}>
    <MoreHorizontalIcon />
  </DropdownMenuTrigger>
  <DropdownMenuContent className="min-w-52">
    <DropdownMenuGroup>
      <DropdownMenuLabel>Code</DropdownMenuLabel>
      <DropdownMenuItem><PencilIcon />Edit target</DropdownMenuItem>
      <DropdownMenuItem><CopyIcon />Copy short link</DropdownMenuItem>
    </DropdownMenuGroup>
    <DropdownMenuSeparator />
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>Download as</DropdownMenuSubTrigger>
      <DropdownMenuSubContent>
        <DropdownMenuItem>PNG</DropdownMenuItem>
        <DropdownMenuItem>SVG</DropdownMenuItem>
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  </DropdownMenuContent>
</DropdownMenu>
```

**`DropdownMenuLabel` is a group label** — it must be inside a `DropdownMenuGroup` or a `DropdownMenuRadioGroup`, or Base UI throws `MenuGroupContext is missing`. This is the single most common mistake with this component.

- Use `render={<Button …/>}` on the trigger rather than nesting a `Button` inside it — two nested interactive elements is invalid.
- `DropdownMenuCheckboxItem` (with `checked`) for multi-select filters; `DropdownMenuRadioGroup` + `DropdownMenuRadioItem` (with `value`) for a single choice such as sort order.
- `DropdownMenuShortcut` is right-aligned muted text, not a key handler.
- `DropdownMenuContent` takes `align` and `side`; align a row-action menu to `"end"` so it doesn't hang off the table.
