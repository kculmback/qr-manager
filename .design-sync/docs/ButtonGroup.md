---
category: Actions
---

Joins related controls into one connected block — a segmented range picker, a split action, a slug field with a fixed prefix, an icon toolbar. Use it instead of spacing buttons by hand whenever the controls belong to the same decision.

## Usage

```jsx
<ButtonGroup>
  <Button variant="outline">Last 7 days</Button>
  <Button variant="outline">30 days</Button>
  <Button variant="outline">All time</Button>
</ButtonGroup>
```

The group strips the inner corner radii and the duplicated borders itself: every direct child with a `data-slot` loses its right radius, and every child after the first loses its left radius **and** its left border. That is why it only works on **direct** children — wrapping a button in a `<div>` or a fragment breaks the seam.

- Keep one variant across the whole group. Mixing `outline` and `default` makes the shared seam read as a mistake — except in a split action, where the emphasised half is the point.
- `ButtonGroupSeparator` draws the divider inside a split action, where both halves share a variant and there is no border change to mark the join:

```jsx
<ButtonGroup>
  <Button><DownloadIcon data-icon="inline-start" />Download PNG</Button>
  <ButtonGroupSeparator />
  <Button size="icon" aria-label="More formats"><ChevronDownIcon /></Button>
</ButtonGroup>
```

- `ButtonGroupText` is a non-interactive segment — a unit, a prefix, a static label. An `<Input>` inside the group flexes to fill the remaining width automatically:

```jsx
<ButtonGroup className="w-72">
  <ButtonGroupText>qr.sh/</ButtonGroupText>
  <Input defaultValue="spring-launch" aria-label="Short link slug" />
  <Button variant="outline" size="icon" aria-label="Copy"><CopyIcon /></Button>
</ButtonGroup>
```

## Orientation

`orientation="vertical"` stacks the children and moves the seam handling to the top/bottom edges — the shape for a floating icon rail. Default is `horizontal`.

## Notes

- The group is `w-fit`; give it a width class when it contains an input that should fill a form row.
- Nesting a `ButtonGroup` inside a `ButtonGroup` is supported and adds a `gap-2` between the sub-groups — that's how you build a toolbar of several clusters.
- Icon-only children still need `aria-label`; the group is `role="group"` and adds no naming of its own.
