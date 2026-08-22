---
category: Data display
---

A plain semantic table for tabular records — the QR code index, a scan log, a webhook delivery history. Use it when rows share a fixed set of columns and the user compares down a column. For a list of heterogeneous records where each row is a small summary, use `Item` instead.

## Anatomy

```jsx
<Table>
  <TableCaption>Scans by code — last 30 days.</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead className="text-right">Scans</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {codes.map((code) => (
      <TableRow key={code.id}>
        <TableCell className="font-medium">{code.name}</TableCell>
        <TableCell className="text-right tabular-nums">{code.scans.toLocaleString()}</TableCell>
      </TableRow>
    ))}
  </TableBody>
  <TableFooter>
    <TableRow>
      <TableCell>Total</TableCell>
      <TableCell className="text-right tabular-nums">4,839</TableCell>
    </TableRow>
  </TableFooter>
</Table>
```

`Table` renders its own `overflow-x-auto` wrapper, so a wide table scrolls inside its container instead of pushing the page sideways. Don't wrap it in another scroller.

## Column conventions

- Cells are `whitespace-nowrap` by default — that is what makes the horizontal scroll work. To let a description column wrap, put `whitespace-normal` on that cell.
- Numbers: `text-right tabular-nums`, and right-align the matching `TableHead` too.
- Identifiers and URLs: `font-mono text-xs text-muted-foreground`.
- Status: a `Badge` in the cell, not a coloured row.
- Secondary text (dates, owners): `text-muted-foreground`.

## Selection and row actions

`TableRow` already styles `data-[state=selected]`; set it alongside the checkbox's checked state rather than adding your own background.

```jsx
<TableRow data-state={selected ? "selected" : undefined}>
  <TableCell><Checkbox checked={selected} aria-label={`Select ${code.name}`} /></TableCell>
  …
</TableRow>
```

Give the checkbox and action columns a fixed narrow width (`className="w-10"`) on the `TableHead`, and leave the trailing action header empty rather than labelling it. Row actions are `size="icon-sm" variant="ghost"` buttons with an `aria-label`.

## Notes

- `Table` is presentation only — no sorting, no pagination, no virtualisation. When you need those, reach for `DataGrid`; pair a plain table with `Pagination` if that is all you need.
- `TableCaption` renders *below* the table (`caption-bottom`). Use it for the scope of the data, not as a heading — a heading belongs above, outside the table.
- Rows highlight on hover, so a table reads as clickable. If rows aren't clickable, that hover is a lie — either wire the row up or use a static layout.
