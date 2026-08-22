---
category: Forms
---

A multi-level picker for hierarchical values — categories, org units, tag trees, folder paths. Use it when a flat `Select` or `Combobox` would need hundreds of options or lose the parent/child relationship.

## Data

Items are a tree of `CascaderNode`: `{ value, label, children?, icon?, description?, count?, disabled?, keywords?, hasChildren? }`. `value` is both the stable id and the committed selection. For lazily-loaded branches set `hasChildren` (an async node without it reads as a leaf) and supply `getChildren`.

## Composition

`Cascader` is the state root; the panel is composed from parts, so you choose the shape.

```jsx
// popover
<Cascader items={items}>
  <CascaderTrigger><CascaderValue placeholder="Choose a category" /></CascaderTrigger>
  <CascaderContent>
    <CascaderPanel>
      <CascaderNav><CascaderBreadcrumb /></CascaderNav>
      <CascaderList><CascaderItems /></CascaderList>
    </CascaderPanel>
  </CascaderContent>
</Cascader>

// embedded in a page or a filter panel — no popover
<Cascader inline items={items}>
  <CascaderPanel>
    <CascaderColumns columnWidth={170} />
  </CascaderPanel>
</Cascader>
```

- **`inline`** renders the panel in flow instead of in a popover. An inline cascader is never "open", but its panel is live.
- **`mode`**: `"drill"` (default — one level at a time with breadcrumb nav), `"columns"` (macOS-style parallel columns, use `CascaderColumns`), `"tree"` (expandable rows).
- Swap `CascaderBreadcrumb` for `CascaderInput` to make the level searchable; `searchScope="deep"` searches the whole tree and shows each hit's path.
- Multi-select: `multiple` plus `selectable="all"` (default is `"leaf"`) puts checkboxes on rows; `cascade` makes a parent's state follow its children. Use `CascaderChips` instead of `CascaderValue` for the trigger so each selection is individually removable.

## Notes

- `CascaderList`'s height is `min(--available-height, maxHeight)` so a panel opened near the viewport edge shrinks rather than spilling.
- Over `virtualizeThreshold` rows (default 100) the level virtualizes automatically.
- `getParent` must be stable — an inline accessor rebuilds the whole index on every render.
