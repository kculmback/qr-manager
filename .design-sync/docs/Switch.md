---
category: Forms
---

A single setting that takes effect immediately — "fire scan actions", "record coarse location", "code is active". If the value only applies when a form is submitted, or several options can be true at once, use `Checkbox` instead.

## Composition

A switch is a settings **row**: a horizontal `Field` with the text on the left and the switch pinned right.

```jsx
<Field orientation="horizontal">
  <FieldContent>
    <FieldTitle>Fire scan actions</FieldTitle>
    <FieldDescription>Call the Home Assistant webhook on every scan.</FieldDescription>
  </FieldContent>
  <Switch defaultChecked />
</Field>
```

With no description, replace `FieldContent` with a `FieldLabel htmlFor` and give the switch a matching `id`. Stack rows in a `FieldGroup` — it owns the gap.

## Sizes and states

`size="default"` (h-5 / w-11) or `size="sm"` (h-4 / w-7); `sm` is for dense contexts like a table row or toolbar. Checked fills the track with `primary`; `disabled` dims to 50%; `aria-invalid` rings destructive.

State is base-ui's: `checked` / `defaultChecked` with `onCheckedChange` — not `onChange`.

## Notes

- Built on `@base-ui/react`'s Switch; it renders a `<button role="switch">`, so a `<label>` around it will not associate — wire `id` + `htmlFor`.
- Don't label a switch "Enable X" and also put a Yes/No next to it; the track position *is* the state.
- The thumb transition and an invisible `after:` hit-area halo come with the component — no extra padding needed.
