---
category: Forms
---

An input with attached affordances — a prefix, a unit, an icon, or a button — presented as one control with a single focus ring.

```jsx
<InputGroup>
  <InputGroupAddon align="inline-start">
    <InputGroupText>qr.example.com/r/</InputGroupText>
  </InputGroupAddon>
  <InputGroupInput placeholder="spring-25" />
  <InputGroupAddon align="inline-end">
    <InputGroupButton size="icon-xs" aria-label="Copy"><CopyIcon /></InputGroupButton>
  </InputGroupAddon>
</InputGroup>
```

- Use `InputGroupInput` / `InputGroupTextarea`, not a bare `Input` — they carry the `data-slot="input-group-control"` the group's focus and invalid styling keys off.
- `align` on `InputGroupAddon`: `"inline-start"` (default), `"inline-end"`, `"block-start"`, `"block-end"`. The block alignments stack the addon above or below the field and switch the group to a taller rounded shape — that's the toolbar layout for a textarea.
- `InputGroupText` is muted static text; `InputGroupButton` is a button sized to fit the field.
- Validation flows from the control: `aria-invalid` on the input turns the whole group destructive.
