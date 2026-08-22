---
category: Data tables
---

The full-featured table: sorting, filtering, pagination, selection, pinning, resizing, drag-to-reorder and virtualization, built on TanStack Table v9. Use it for the QR-code list, scan logs, and anything else with more than a handful of rows. For a static table with no behaviour, use `Table` instead.

## Composition

`DataGrid` is a provider, not a renderer — it needs a table instance and at least one child that draws something.

```jsx
const table = useTable({ features: dataGridFeatures, columns, data });

<DataGrid table={table} recordCount={data.length}>
  <DataGridContainer>
    <DataGridTable />
  </DataGridContainer>
</DataGrid>
```

- `dataGridFeatures` is the batteries-included feature bundle. **v9 requires features to be declared up front**, and the render path needs them — `columnVisibilityFeature` alone gates `row.getVisibleCells()`, so a grid without it renders nothing at all. Pass `dataGridFeatures` unless you have a reason not to.
- `table` is required; `DataGrid` throws without it. `recordCount` drives pagination and the empty state.

## Layout and states

`tableLayout` toggles presentation: `dense`, `stripped`, `cellBorder`, `rowBorder`, `rowRounded`, `headerBackground`, `headerSticky`, `width: "auto" | "fixed"`, plus the interaction switches (`columnsResizable`, `columnsPinnable`, `columnsMovable`, `rowsDraggable`, `rowsPinnable`).

States are props, not conditional rendering: `isLoading` with `loadingMode="skeleton" | "spinner"`, and `emptyMessage` for no rows. Both keep the real header in place.

## The rest of the family

`DataGridPagination`, `DataGridColumnHeader` (sortable header cell), `DataGridColumnVisibility`, `DataGridColumnFilter`, `DataGridScrollArea`, `DataGridTableVirtual` (virtualized body), `DataGridTableDnd` / `DataGridTableDndRows` (drag to reorder) — all render inside the same `<DataGrid>` provider.

Per-column extras go on `columnDef.meta` (`DataGridColumnMeta`): `headerTitle`, `headerClassName`, `cellClassName`, `skeleton`, `expandedContent`, `autoSize`.
