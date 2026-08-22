---
category: Data display
---

A small, non-interactive label for status and classification — whether a code is dynamic or static, which payload type it encodes, whether a scan action is failing.

## Variants

| variant | Use for |
|---|---|
| `default` | the one state worth emphasising on a surface (`Dynamic`, `Live`) |
| `secondary` | the neutral, most common label — the default choice for a type or status chip |
| `destructive` | failure and expiry; tinted, not solid red |
| `outline` | quiet metadata that must stay legible next to other chips (tags, categories) |
| `ghost` | de-emphasised state inside already-dense rows (`Archived`) |
| `link` | a badge that is really inline navigation — pair it with `render` |

There is no `size`: `Badge` is a fixed `h-5`, `text-xs` chip. Scale it by changing what's around it, not the badge.

## Composition

```jsx
<Badge variant="secondary">Static</Badge>

// icon + label — mark the side so the badge tightens that padding
<Badge>
  <QrCodeIcon data-icon="inline-start" />
  URL
</Badge>
```

Icons are forced to `size-3`; don't set a size class. `data-icon="inline-start"` / `"inline-end"` is the same convention `Button` uses.

Built on `@base-ui/react`'s `useRender`, so `render` swaps the element — that is how a badge becomes a link and picks up the `[a]:hover` styles baked into every variant:

```jsx
<Badge variant="outline" render={<a href={`/codes/${code.id}`} />}>
  Open target
  <ArrowUpRightIcon data-icon="inline-end" />
</Badge>
```

## Notes

- Numbers read better with `tabular-nums`; for a count pill add `min-w-5 rounded-full px-1` so single and double digits keep the same shape.
- Inside a `Card`, put the badge in `CardAction` — the header grid places it top-right for you.
- A badge is a label, not a button. If it needs an `onClick`, use a `Button` with `size="xs"`.
