---
category: Forms
---

The single-choice dropdown for short, known option sets. Past roughly a dozen options — or when the user should be able to type — use `Combobox`.

## Anatomy

```jsx
<Select defaultValue="url">
  <SelectTrigger>
    <SelectValue placeholder="Choose a type" />
  </SelectTrigger>
  <SelectContent>
    <SelectGroup>
      <SelectLabel>Dynamic</SelectLabel>
      <SelectItem value="url">URL redirect</SelectItem>
      <SelectItem value="sms">SMS</SelectItem>
    </SelectGroup>
    <SelectSeparator />
    <SelectGroup>
      <SelectLabel>Static</SelectLabel>
      <SelectItem value="wifi">Wi-Fi credentials</SelectItem>
      <SelectItem value="vcard">Contact card</SelectItem>
    </SelectGroup>
  </SelectContent>
</Select>
```

- `SelectLabel` is a group label and must live inside a `SelectGroup` — Base UI throws if it doesn't.
- `SelectValue` renders the selected item's label; `placeholder` shows only while nothing is chosen.
- `SelectScrollUpButton` / `SelectScrollDownButton` appear automatically on long lists.
- Put it inside a `Field` with a `FieldLabel` — `Select` supplies no label of its own.
