---
category: Layout
---

Show/hide a region behind a trigger. The unstyled primitive — it supplies the open state and animation, not chrome, so you style the trigger yourself.

```jsx
<Collapsible defaultOpen>
  <CollapsibleTrigger render={<Button variant="ghost" size="sm" />}>
    Advanced options
    <ChevronDownIcon />
  </CollapsibleTrigger>
  <CollapsibleContent className="pt-2">
    …fields…
  </CollapsibleContent>
</Collapsible>
```

`defaultOpen` for uncontrolled, `open` + `onOpenChange` for controlled. `CollapsibleContent` animates its height, so don't set a fixed one.

Rotate a chevron with `group-data-[panel-open]:rotate-180` on the icon and `group` on the trigger. For a set of sections where only one opens at a time, compose several of these — or use `Tabs` if the sections are peers rather than progressive disclosure.
