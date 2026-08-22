---
category: Overlays
---

A rich preview that appears on hover — for a link, a code, or a person. Informational only: it opens on hover, so it must never contain the only copy of an action or anything a keyboard-only or touch user needs.

```jsx
<HoverCard>
  <HoverCardTrigger render={<Button variant="link" />}>Spring launch flyer</HoverCardTrigger>
  <HoverCardContent className="w-72">
    <div className="flex gap-3">
      <img src={qr} alt="" className="size-16 rounded-lg" />
      <div>
        <p className="font-medium">Spring launch flyer</p>
        <p className="text-muted-foreground text-sm">1,284 scans · /r/spring-25</p>
      </div>
    </div>
  </HoverCardContent>
</HoverCard>
```

For content that must be reachable by click or keyboard, use `Popover`. For one line of plain text, use `Tooltip`.
