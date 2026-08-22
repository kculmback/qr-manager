---
category: Feedback
---

An inline message attached to the surface it concerns — a validation summary above a form, a warning inside a code's detail panel, a note in a settings block. It stays in the flow of the page, so use it for things the user should read, not for confirmation of something they just did (that's `Toast`).

## Anatomy

```jsx
<Alert>
  <LockIcon />
  <AlertTitle>This code is static and cannot be re-pointed</AlertTitle>
  <AlertDescription>
    Wi-Fi credentials are encoded into the image itself.
  </AlertDescription>
  <AlertAction>
    <Button size="xs" variant="outline">Undo</Button>
  </AlertAction>
</Alert>
```

- The icon is a **direct child** of `Alert`, not nested in a wrapper — the alert's grid detects `> svg` and switches to a two-column layout, spanning the icon across both text rows. Nesting it breaks that alignment. Size is applied automatically.
- `AlertTitle` alone is a valid alert: drop `AlertDescription` when one sentence says it. Keep the title to a single line and put detail in the description.
- `AlertAction` is absolutely positioned in the top-right corner and the alert reserves right padding for it as soon as it is present. Put one small control there (`Button size="xs"`, or an icon button) — it is not a footer for a row of buttons.

## Variants

| variant | Use for |
|---|---|
| `default` | neutral or positive information; renders on `bg-card` |
| `destructive` | failures and blocked actions — tinted text on the same card surface, not a solid red block |

There is no `warning` or `success` variant. Signal those with the icon (`TriangleAlertIcon`, `CircleCheckIcon`) on a `default` alert; the DS deliberately keeps only two tones.

## Notes

- `role="alert"` is already on the element. Don't add another, and don't render an alert for content that is always present — assistive tech will announce it.
- Links inside the title or description are underlined automatically; no extra classes needed.
- For a blocking decision that needs a response, use `AlertDialog` instead — `Alert` is passive.
