---
category: Data display
---

A surface that groups related content — the standard container for a QR code, a stat, a settings block or a list item detail.

## Anatomy

`Card` > `CardHeader` > (`CardTitle`, `CardDescription`, `CardAction`) + `CardContent` + `CardFooter`.

```jsx
<Card>
  <CardHeader>
    <CardTitle>Launch flyer</CardTitle>
    <CardDescription>Dynamic code — redirects to the campaign page.</CardDescription>
    <CardAction><Badge variant="secondary">Static</Badge></CardAction>
  </CardHeader>
  <CardContent>Printed on 2,000 flyers for the spring launch.</CardContent>
  <CardFooter className="gap-2">
    <Button size="sm">Download PNG</Button>
    <Button size="sm" variant="outline">Edit</Button>
  </CardFooter>
</Card>
```

- `CardAction` is positioned by the header's grid — it lands top-right on its own; don't float it.
- All padding comes from `--card-spacing`, set by `size`: `default` is `--spacing(6)`, `size="sm"` is `--spacing(4)`. Override paddings on the parts only when you must.
- An `<img>` as the first or last child is corner-rounded and un-padded automatically, so media cards need no wrapper.

## Notes

- Cards already carry `bg-card`, a ring and `shadow-md` — don't add your own border or shadow.
- For a stat tile, use `size="sm"` with `CardDescription` as the label and a large `CardTitle` as the value, and skip `CardContent` entirely.
