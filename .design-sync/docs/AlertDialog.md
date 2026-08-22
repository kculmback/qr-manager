---
category: Overlays
---

The confirmation modal: one question, two answers, no way to dismiss by clicking outside. Reach for it before anything destructive or irreversible — deleting a code, clearing scan history, rotating credentials that invalidate printed codes. Anything with a form in it is a `Dialog`, not an `AlertDialog`.

## Anatomy

```jsx
<AlertDialog>
  <AlertDialogTrigger render={<Button variant="destructive" />}>Delete code</AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Delete this code?</AlertDialogTitle>
      <AlertDialogDescription>
        “Spring launch flyer” and its 1,284 scan records are removed permanently.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Keep code</AlertDialogCancel>
      <AlertDialogAction variant="destructive">Delete code</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

- `AlertDialogCancel` closes on its own — it renders a `Button` internally and takes `variant`/`size` directly (defaults to `outline`). `AlertDialogAction` is a plain `Button`: it does **not** close the dialog, so wire its `onClick` to both the mutation and your close handler.
- Write the title as the question and the actions as the answers. "Delete code" / "Keep code" beats "OK" / "Cancel".

## `size`

| size | Shape |
|---|---|
| `default` | `sm:max-w-md`; header goes left-aligned at `sm`, footer is a right-aligned row |
| `sm` | `max-w-xs` at every width; header stays centered, footer becomes a 2-column grid |

Use `sm` for a one-line consequence, `default` when the description needs a sentence or two.

## `AlertDialogMedia`

An optional icon puck at the top of the header — a muted circle that auto-sizes its `svg` to `size-8`.

```jsx
<AlertDialogHeader>
  <AlertDialogMedia><WifiOffIcon className="text-muted-foreground" /></AlertDialogMedia>
  <AlertDialogTitle>Reprint required</AlertDialogTitle>
  <AlertDialogDescription>Wi-Fi credentials are encoded literally.</AlertDialogDescription>
</AlertDialogHeader>
```

At `size="default"` the header grid moves it into its own left column beside the title and description; at `size="sm"` it sits centered above them. Both fall out of the header — don't position it.

## Notes

- The content portals and paints its own backdrop; `AlertDialogPortal`/`AlertDialogOverlay` are exported for bespoke cases only.
- An alert dialog cannot be dismissed by an outside press — that is the point. Don't add `disablePointerDismissal` or a floating × to it.
