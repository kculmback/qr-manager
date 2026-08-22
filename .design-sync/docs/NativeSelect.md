---
category: Forms
---

A real `<select>` styled to match the DS. Use it when the OS picker is the better experience — long option lists, dense toolbars, mobile, or anything inside a form that must submit without JavaScript. When the options need icons, descriptions, custom rows or a search field, use `Select` (or `Combobox`) instead.

## Anatomy

```jsx
<Field>
  <FieldLabel htmlFor="payload">Payload type</FieldLabel>
  <NativeSelect id="payload" defaultValue="wifi" className="w-full">
    <NativeSelectOption value="url">URL</NativeSelectOption>
    <NativeSelectOptGroup label="Offline payloads">
      <NativeSelectOption value="wifi">Wi-Fi network</NativeSelectOption>
      <NativeSelectOption value="vcard">Contact card</NativeSelectOption>
    </NativeSelectOptGroup>
  </NativeSelect>
  <FieldDescription>Determines how the payload is encoded.</FieldDescription>
</Field>
```

`NativeSelect` renders a wrapper div plus the `<select>` and a chevron; every prop you pass lands on the `<select>`, but `className` lands on the **wrapper**.

## Width

The wrapper is `w-fit` — it shrinks to the widest option. That is right for a toolbar filter and wrong inside a `Field`, where the control should fill the row: pass `className="w-full"` there.

## Sizes and states

`size="default"` (h-9) or `size="sm"` (h-8) — the same scale as `Input` and `SelectTrigger`. `disabled` fades the whole wrapper (the opacity lives on the wrapper, via `has-[select:disabled]`), and `aria-invalid` gives the destructive border and ring.

## Notes

- The chevron is decorative and absolutely positioned; the `<select>` reserves `pr-8` for it. Don't add your own icon.
- `NativeSelectOption` / `NativeSelectOptGroup` force `bg-[Canvas] text-[CanvasText]` so the OS-drawn dropdown stays legible in dark mode. Use them rather than bare `<option>`/`<optgroup>`.
- For a "nothing chosen yet" state use an option with `value=""` as the first child and `defaultValue=""`; there is no `placeholder` prop.
