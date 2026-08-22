---
category: Forms
---

An independent on/off box — used where several options can be true at once (which signals a scan records, which channels get a report). For a single setting that reads as on/off, prefer `Switch`; for one choice out of several, `RadioGroup`.

## Composition

A checkbox is a control, not a row. Give it a `Field` with `orientation="horizontal"` so the box sits left of its text:

```jsx
<Field orientation="horizontal">
  <Checkbox id="utm" defaultChecked />
  <FieldContent>
    <FieldTitle>Append UTM parameters</FieldTitle>
    <FieldDescription>Adds utm_source=qr on every redirect.</FieldDescription>
  </FieldContent>
</Field>
```

With only a label and no description, drop `FieldContent` and use `FieldLabel htmlFor` directly. The horizontal `Field` nudges the box down a hair (`mt-px`) when a `FieldContent` is present so it aligns with the first line of text — don't correct that by hand.

For a set of related boxes, wrap them in `FieldSet` + `FieldLegend variant="label"` + `FieldGroup`; the set tightens its gap automatically when it holds checkboxes.

## States

`defaultChecked` / `checked` + `onCheckedChange` (base-ui naming, not `onChange`). The checked box fills with `primary` and shows a `CheckIcon`; `disabled` drops it to 50% opacity; `aria-invalid` swaps the ring to destructive — pair that with `data-invalid` on the `Field`.

## Notes

- Built on `@base-ui/react`'s Checkbox. It renders a `<button role="checkbox">`, so it needs `id` + `htmlFor` to be labelled — the label is not a wrapper.
- The tick indicator only draws a check; there is no mixed/indeterminate glyph in this DS, so don't rely on `indeterminate` to read visually.
- An invisible `after:` halo enlarges the hit target beyond the 16px box. Don't add padding to grow it.
