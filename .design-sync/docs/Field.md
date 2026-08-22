---
category: Forms
---

The form-row primitive: it pairs a label, a control, help text and validation into one consistently spaced unit. Every form control in the DS is meant to sit inside a `Field`.

## Anatomy

```jsx
<Field>
  <FieldLabel htmlFor="qr-name">Code name</FieldLabel>
  <Input id="qr-name" />
  <FieldDescription>Only you see this — it is not encoded.</FieldDescription>
</Field>
```

- `orientation="horizontal"` puts the control to the right of the text — the shape for switches and checkboxes. Wrap the text in `FieldContent` with `FieldTitle` + `FieldDescription` so it stays left-aligned.
- `FieldSet` + `FieldLegend` + `FieldGroup` group several fields under one heading; `FieldSeparator` divides them.
- Validation: put `data-invalid` on the `Field` and `aria-invalid` on the control, then render `FieldError`. The destructive token flows to the label, the control's ring and the message.

```jsx
<Field data-invalid>
  <FieldLabel htmlFor="qr-target">Destination URL</FieldLabel>
  <Input id="qr-target" aria-invalid />
  <FieldError>Enter a full URL, including https://</FieldError>
</Field>
```

## Notes

- Always wire `htmlFor` to the control's `id` — `FieldLabel` does not generate one.
- Don't add margins between fields; `FieldGroup` owns that spacing.
