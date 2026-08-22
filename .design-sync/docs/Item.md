---
category: Data display
---

The list-row primitive: a media slot, a title/description block, and trailing actions in one consistently spaced row. It is what a QR code, a scan action, or a connected integration looks like in a list.

Use `Item` when each row is a small self-contained summary. Use `Table` when rows share fixed columns the user compares down.

## Anatomy

```jsx
<Item variant="outline">
  <ItemMedia variant="icon"><LinkIcon /></ItemMedia>
  <ItemContent>
    <ItemTitle>Spring launch flyer</ItemTitle>
    <ItemDescription>qr.acme.co/s/9fK2 → acme.co/spring</ItemDescription>
  </ItemContent>
  <ItemActions>
    <Button size="icon-sm" variant="ghost" aria-label="Open code"><ChevronRightIcon /></Button>
  </ItemActions>
</Item>
```

`ItemContent` is the flex-1 middle, so it takes the leftover width and the actions stay pinned right. Everything else is `shrink-0`. Don't add your own `flex-1` or `ml-auto`.

## The media slot

`ItemMedia` has three variants and each one is a different visual contract:

- `icon` — a lucide icon, auto-sized to `size-4`, no background.
- `image` — a fixed 40px rounded thumbnail that crops its `<img>` with `object-cover`. This is the slot for a QR preview or a code's logo. Put a bare `<img>` inside; the sizing is done for you.
- `default` — a transparent box for anything else (an `Avatar`, a `Checkbox`, a small stack).

When the row has an `ItemDescription`, media aligns to the top instead of centring — that happens automatically.

## Variants and sizes

| variant | Use for |
|---|---|
| `default` | rows inside a container that already draws the borders |
| `outline` | standalone rows — the usual choice for a list of codes |
| `muted` | an inline notice or an empty-state row |

Sizes `default` / `sm` / `xs` scale padding and gap. `xs` is for dense pickers and menus; it flattens to zero padding inside a `DropdownMenuContent` so an item can *be* the menu row.

## Grouping

`ItemGroup` is the list container: `role="list"`, full width, and it tightens its own gap when it contains `sm`/`xs` items. `ItemSeparator` divides rows within a group or sections within one item.

```jsx
<ItemGroup>
  <Item variant="outline">…</Item>
  <Item variant="outline">…</Item>
</ItemGroup>
```

## Full-width bands

`ItemHeader` and `ItemFooter` are `basis-full`, so they break onto their own line above and below the media/content row — use them for an eyebrow label with a status badge, or a footer with a timestamp and a low-emphasis action. Everything is `justify-between` already.

## Notes

- `Item` accepts `render` (base-ui `useRender`), which is how a row becomes a link: `<Item variant="outline" render={<a href={`/codes/${code.id}`} />}>`. The `[a]:hover:bg-muted` and focus ring styles only activate for an anchor, so a non-interactive row stays visually inert.
- `ItemTitle` is `line-clamp-1` and `ItemDescription` is `line-clamp-2` — long names truncate rather than reflow the row. Don't fight it with `whitespace-normal`.
- Keep `ItemActions` to one or two controls; more than that belongs in a `DropdownMenu`.
