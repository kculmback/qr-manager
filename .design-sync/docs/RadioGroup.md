---
category: Forms
---

Exactly one choice out of a small, always-visible set — redirect type, error-correction level, dynamic vs static. Once the list runs past about six options, or needs searching, switch to `Select` or `Combobox`.

## Anatomy

`RadioGroup` owns the value; each `RadioGroupItem` carries a `value`. The group is a `grid gap-3`, so don't add spacing between items.

```jsx
<FieldSet>
  <FieldLegend variant="label">Redirect type</FieldLegend>
  <RadioGroup defaultValue="temporary">
    <Field orientation="horizontal">
      <RadioGroupItem value="temporary" id="r-302" />
      <FieldLabel htmlFor="r-302">302 — temporary</FieldLabel>
    </Field>
    <Field orientation="horizontal">
      <RadioGroupItem value="permanent" id="r-301" />
      <FieldLabel htmlFor="r-301">301 — permanent</FieldLabel>
    </Field>
  </RadioGroup>
</FieldSet>
```

`FieldLegend variant="label"` matches the size of a field label; the default `"legend"` is a section heading.

## Choice cards

When each option needs a sentence of explanation, wrap a nested `Field` **inside** the `FieldLabel`. `FieldLabel` detects the nested field and turns into a bordered, full-width, padded card that tints (`bg-input/30`) when its radio is checked — the whole card becomes the hit target:

```jsx
<RadioGroup defaultValue="dynamic">
  <FieldLabel htmlFor="dynamic">
    <Field orientation="horizontal">
      <FieldContent>
        <FieldTitle>Dynamic code</FieldTitle>
        <FieldDescription>Encodes a short URL — editable after printing.</FieldDescription>
      </FieldContent>
      <RadioGroupItem value="dynamic" id="dynamic" />
    </Field>
  </FieldLabel>
  {/* …one FieldLabel per option */}
</RadioGroup>
```

## States

`disabled` on the `RadioGroup` disables every item at once; put it on an item to disable just that row. For validation, `aria-invalid` goes on the items and `data-invalid` on the `FieldSet`/`Field`, with the message in `FieldError`.

## Notes

- Built on `@base-ui/react`'s RadioGroup + Radio; value changes arrive via `onValueChange`, and items render as `<button role="radio">` — labels must be wired with `htmlFor`/`id`.
- Always give the group a `defaultValue` unless "nothing selected" is a real, submittable state.
