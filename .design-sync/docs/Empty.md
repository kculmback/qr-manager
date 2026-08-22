---
category: Feedback
---

The empty-state block: what a region shows when it has nothing to show. Use it for a first-run list ("No QR codes yet"), a filtered list with no matches, and a detail panel with no data — always with a way out.

## Anatomy

```jsx
<Empty>
  <EmptyHeader>
    <EmptyMedia variant="icon"><QrCodeIcon /></EmptyMedia>
    <EmptyTitle>No QR codes yet</EmptyTitle>
    <EmptyDescription>
      Create your first code and point it anywhere — the destination stays
      editable after it is printed.
    </EmptyDescription>
  </EmptyHeader>
  <EmptyContent>
    <Button><PlusIcon data-icon="inline-start" />Create QR code</Button>
  </EmptyContent>
</Empty>
```

- `EmptyHeader` holds the media + text and is capped at `max-w-sm` so the copy stays readable; `EmptyContent` holds the actions below it and is a **column** by default. For side-by-side buttons add `className="flex-row justify-center"`.
- `EmptyMedia variant="icon"` is the standard treatment — a `size-10` muted rounded tile. The plain `variant="default"` is for real artwork (an illustration, a QR preview image) that brings its own background.
- Media, title and description are all optional. A title + description with no icon is a fine quiet empty state; a title alone is fine inside a small panel.

## Layout

`Empty` is `w-full flex-1` and centres its contents, so it fills whatever region you drop it into — give the parent the height, not the `Empty`.

It carries `border-dashed` but **no `border` width**, so no outline shows until you add one:

```jsx
<Empty className="border">…</Empty>          // dashed placeholder region
<Empty>…</Empty>                              // borderless, e.g. inside a Card
```

Padding is `p-12`; drop to `p-6` with a tighter `gap` for an empty state inside a small panel.

## Notes

- Say what is missing and give the action that fixes it. "No codes match “spring”" + a *Clear filters* button beats a generic "Nothing here".
- Use `Empty` for "there is nothing", not "it is still loading" — that's `Skeleton` (known layout) or a `Spinner` inside an `Empty` (unknown layout).
- `EmptyDescription` renders a `div`, not a `p`; nested links get underlines automatically.
