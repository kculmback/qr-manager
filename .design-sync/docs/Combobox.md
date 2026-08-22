---
category: Forms
---

A text input with a filtered dropdown — use it instead of `Select` when the list is long enough that typing beats scrolling, or when the user may enter multiple values.

## Anatomy

```jsx
<Combobox>
  <ComboboxInput placeholder="Search destinations…" />
  <ComboboxContent>
    <ComboboxEmpty>Nothing matches.</ComboboxEmpty>
    <ComboboxList>
      <ComboboxGroup>
        <ComboboxLabel>Campaigns</ComboboxLabel>
        <ComboboxItem value="spring">Spring launch</ComboboxItem>
        <ComboboxItem value="holiday">Holiday promo</ComboboxItem>
      </ComboboxGroup>
    </ComboboxList>
  </ComboboxContent>
</Combobox>
```

- `ComboboxContent` takes `side` (default `"bottom"`), `align` (default `"start"`), `sideOffset` and `alignOffset` — same positioning vocabulary as `Popover` and `Select`.
- Multi-select: use `ComboboxChips` with `ComboboxChipsInput` in place of a bare `ComboboxInput`; each selection becomes a removable `ComboboxChip`.
- `ComboboxTrigger` + `ComboboxValue` gives a select-like closed state instead of an always-visible text field.
- `ComboboxInput` renders inside an `InputGroup`, so it inherits that focus ring and the `aria-invalid` styling.

For hierarchical values, reach for `Cascader` rather than flattening a tree into this list.
