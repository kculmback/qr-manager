---
category: Forms
---

A fixed-length code entered one character per box — two-factor codes at sign-in, an emailed verification code, a short claim code for a printed batch. Not a general text input: the length is known up front.

## Anatomy

One `InputOTP` with `maxLength`, containing one or more `InputOTPGroup`s of `InputOTPSlot`s. **Each slot needs its own `index`, counting across the whole input, not per group.**

```jsx
<InputOTP maxLength={6} defaultValue="482913">
  <InputOTPGroup>
    <InputOTPSlot index={0} />
    <InputOTPSlot index={1} />
    <InputOTPSlot index={2} />
  </InputOTPGroup>
  <InputOTPSeparator />
  <InputOTPGroup>
    <InputOTPSlot index={3} />
    <InputOTPSlot index={4} />
    <InputOTPSlot index={5} />
  </InputOTPGroup>
</InputOTP>
```

The number of slots must equal `maxLength`. A slot with no matching index renders blank forever.

`InputOTPGroup` is what carries the rounded outline — the first and last slot in each group round their outer corners, so one group reads as a single pill and two groups read as two. `InputOTPSeparator` draws the dash between them and takes no props.

## Behaviour and state

Under the hood there is exactly one hidden `<input>` spanning all the slots, so paste, autofill and one-time-code autocomplete all work; the boxes are painted from context. Use `defaultValue`, or `value` + `onChange` (which receives the **string**, not an event) for controlled use. `onComplete` fires when the last character lands. Restrict input with `pattern={REGEXP_ONLY_DIGITS}`.

Focus renders a fake blinking caret in the active slot — you will not see it in a static render.

## States

`disabled` on the `InputOTP` fades the whole container. For validation, put `aria-invalid` on **every slot** (each slot styles its own border) plus `data-invalid` on the surrounding `Field`, then render a `FieldError`.

## Notes

- Wrap it in a `Field` with a `FieldLabel` and a `FieldDescription` telling the user where the code came from and how long it lasts.
- Six digits split 3+3 is the house default; keep groups even.
