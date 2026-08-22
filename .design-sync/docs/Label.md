---
category: Forms
---

The bare label primitive: `text-sm`, medium weight, `select-none`, and a built-in `flex items-center gap-2` so an icon or `Kbd` can sit beside the text without extra markup.

## Prefer `FieldLabel`

In a form, use `FieldLabel` (from `Field`) rather than `Label` directly. `FieldLabel` *is* a `Label` with the `Field` wiring layered on: it dims with `group-data-[disabled]/field`, picks up the destructive token from `data-invalid`, and can wrap a nested `Field` to become a bordered, selectable choice card.

Reach for plain `Label` only outside a `Field` — a filter bar control, a toolbar toggle, a table cell editor.

```jsx
<Label htmlFor="qr-slug">Short slug</Label>
<Input id="qr-slug" defaultValue="spring-25" />
```

## Pairing with a control

`htmlFor` must match the control's `id` — `Label` generates nothing. For an inline control, put the control first so the label's `peer-disabled:` styling can reach it:

```jsx
<div className="flex items-center gap-2">
  <Checkbox id="utm" defaultChecked />
  <Label htmlFor="utm">Append UTM parameters</Label>
</div>
```

`Checkbox`, `Switch` and `RadioGroupItem` all carry the `peer` class already, so a disabled control dims its own label. `Input` does not — for a disabled text field, wrap both in a `group` with `data-disabled="true"`, which the label also honours.

## Notes

- Icons inside a `Label` need an explicit size class (`size-3.5`); the label does not size them for you.
- Don't add `mb-*` to space a label off its control — `Field` owns that gap.
