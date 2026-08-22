---
category: Navigation
---

Page-by-page navigation for long lists — the scan log, the codes table, webhook delivery history.

## Anatomy

`Pagination` (a `<nav>`) > `PaginationContent` (`<ul>`) > `PaginationItem` (`<li>`) wrapping one of `PaginationLink`, `PaginationPrevious`, `PaginationNext`, `PaginationEllipsis`.

```jsx
<Pagination>
  <PaginationContent>
    <PaginationItem><PaginationPrevious href="?page=1" /></PaginationItem>
    <PaginationItem><PaginationLink href="?page=1">1</PaginationLink></PaginationItem>
    <PaginationItem><PaginationLink href="?page=2" isActive>2</PaginationLink></PaginationItem>
    <PaginationItem><PaginationLink href="?page=3">3</PaginationLink></PaginationItem>
    <PaginationItem><PaginationNext href="?page=3" /></PaginationItem>
  </PaginationContent>
</Pagination>
```

- Every child of `PaginationContent` must be a `PaginationItem` — the list styling and gap live there.
- `isActive` is the only state prop. It swaps the underlying `Button` from `ghost` to `outline` and sets `aria-current="page"`. Exactly one link per set gets it.
- `PaginationLink` renders an `<a>`, not a button, so give it a real `href` (or `render={<Link to=… />}` for the router). Disabled prev/next is expressed by omitting the item, not by a `disabled` prop.

## Truncating

`PaginationEllipsis` stands in for a skipped run. Keep the first page, a window around the current page, and the last page:

```jsx
1 … 14 [15] 16 … 92
```

## Prev/next only

For cursor-paged data (the scan log), skip the numbers entirely and relabel the arrows with `text`:

```jsx
<Pagination className="justify-between">
  <PaginationContent>
    <PaginationItem><PaginationPrevious href="…" text="Newer" /></PaginationItem>
  </PaginationContent>
  <PaginationContent>
    <PaginationItem><PaginationNext href="…" text="Older" /></PaginationItem>
  </PaginationContent>
</Pagination>
```

## Notes

- `Pagination` is `mx-auto` and centred by default; override with `className="justify-between"` or `justify-end` when it sits in a table footer.
- The prev/next labels are hidden below the `sm` breakpoint — only the chevron shows on phones. That is intended; keep `aria-label` intact.
- Pair it with a plain "Showing 51–100 of 4,812" line above; the component does not render counts.
