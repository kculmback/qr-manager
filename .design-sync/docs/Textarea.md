---
category: Forms
---

The multi-line text control — internal notes, a vCard address block, a webhook JSON body, anything that wraps.

## Composition

Same shape as `Input`: it belongs inside a `Field`.

```jsx
<Field>
  <FieldLabel htmlFor="notes">Internal notes</FieldLabel>
  <Textarea id="notes" rows={3} defaultValue="Printed run of 2,000 flyers." />
  <FieldDescription>Never encoded — visible only in the dashboard.</FieldDescription>
</Field>
```

## Sizing

`Textarea` uses `field-sizing-content` with a `min-h-16`, so it **grows with its content** instead of scrolling. `rows` sets the starting height; a `max-h-*` class caps the growth when a long paste would otherwise push the form around. Resize handles are turned off (`resize-none`) on purpose — don't re-enable them.

It is `w-full` and softly rounded (`rounded-2xl`, one step less than `Input`'s pill). Constrain the container, not the textarea.

## Validation

`data-invalid` on the `Field` plus `aria-invalid` on the `Textarea`, then `FieldError` for the message — identical to `Input`.

## Notes

- For a textarea with addons above or below it (a toolbar row, a character count, a send button), use `InputGroup` with `InputGroupTextarea` and `InputGroupAddon align="block-start"` / `"block-end"`.
- Use it for prose and payloads, not for a value the user picks — that is `Select`, `Combobox` or `RadioGroup`.
