---
category: Data tables
---

A query builder for list views — the filter bar above a `DataGrid` or any collection. It owns a whole filter *query* (rules, groups, AND/OR), not a single control.

## Fields and query

`fields` is the schema: `{ id, label, type, options?, operators?, fields? }`. `type` picks both the value editor and the default operator set — `text`, `number`, `range`, `date`, `select`, `multiselect`, `boolean`. Nest `fields` to group related attributes.

The query is a tree: a root `FilterGroupNode` (`{ id, type: "group", combinator: "and" | "or", rules: [...] }`) whose rules are either `FilterRule` (`{ id, type: "rule", path, operator, value, negated? }`) or further groups. `path` is the field id path, root first.

```jsx
<Filters
  fields={fields}
  defaultQuery={{
    id: "root", type: "group", combinator: "and",
    rules: [
      { id: "r1", type: "rule", path: ["type"], operator: "is", value: "url" },
      { id: "r2", type: "rule", path: ["scans"], operator: "gt", value: 500 },
    ],
  }}
  onQueryChange={(query, details) => setQuery(query)}
/>
```

**Operator ids come from the catalog for the field's `type`** — they are not interchangeable. Equality is `"is"` / `"is_not"` for `select`, `boolean` and `text`, but `"eq"` / `"neq"` for `number`. A wrong id renders as raw text in the chip. Numbers also take `gt`/`gte`/`lt`/`lte`/`between`; text takes `contains`/`starts_with`/`ends_with`; every type takes `empty`/`not_empty`.

## Variants

- `variant="basic"` (default) — a flat chip row, joined by an implicit AND. A chip row has nowhere to put a parenthesis, so it draws a nested rule at any depth as a flat chip.
- `variant="advanced"` — the full builder with combinator pills and groups. `advancedMode="inline"` renders the panel in place; `"popover"` (default) hangs it off a trigger.
- `size="sm" | "default"` sets the density of the whole bar, chips included.
- `reorderable` turns on drag / Alt+Arrow row reordering — off by default, since a move doesn't change what the query means.

`onQueryChange` gets `(query, details)` where `details` carries `reason` (`add`, `update`, `remove`, `duplicate`, `negate`, `reorder`, `combinator`, `clear`), the changed `rule` and the resolved `field`, so you never have to diff two trees.

## Notes

- Async options: give the field `loadOptions` (paged via `cursor`) plus `resolveValues` so restored chips can label values the loader hasn't returned yet.
- Custom editors register through the `editors` prop and are selected per field with `editor`.
