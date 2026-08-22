---
category: Forms
---

The single-line text control. Everything typed in this app — code names, destination URLs, slugs, Wi-Fi SSIDs, webhook endpoints — is an `Input`.

## Composition

An `Input` is almost never used bare. Put it in a `Field` so it gets its label, help text and validation wiring:

```jsx
<Field>
  <FieldLabel htmlFor="qr-name">Code name</FieldLabel>
  <Input id="qr-name" defaultValue="Spring launch flyer" />
  <FieldDescription>Only you see this — it is not encoded.</FieldDescription>
</Field>
```

`FieldLabel` does not generate an id, so `htmlFor` and `id` must be wired by hand. Stack several fields with `FieldGroup`, which owns the spacing between them — don't add margins.

## Sizing and shape

`Input` is `h-9`, fully pill-rounded (`rounded-3xl`) and `w-full` by design: it fills the `Field` and the `Field` fills its column. Constrain the **container**, not the input. There is no `size` prop.

## Validation

Mark both halves — `data-invalid` on the `Field` (so the label and message turn destructive) and `aria-invalid` on the `Input` (so its border and ring do):

```jsx
<Field data-invalid>
  <FieldLabel htmlFor="qr-target">Destination URL</FieldLabel>
  <Input id="qr-target" aria-invalid />
  <FieldError>Enter a full URL, including https://</FieldError>
</Field>
```

## Notes

- `type` passes straight through — `url`, `email`, `number`, `password`, `file` all behave natively; file inputs get their button styled by the DS.
- Built on `@base-ui/react`'s Input, so it takes the standard `<input>` props plus base-ui's `render`.
- When the value needs a prefix, suffix, unit, icon or inline button (`qr.example.com/` before a slug, a copy button after a short URL), reach for `InputGroup` with `InputGroupInput` instead of decorating an `Input` by hand.
- `disabled` also sets `pointer-events-none`; use it for values that are locked (a slug that has already been printed) rather than hiding the field.
