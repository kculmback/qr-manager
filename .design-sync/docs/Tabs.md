---
category: Navigation
---

Switches between sibling views of the *same* object without leaving the page — Overview / Scans / Actions on a QR code, or the payload-type picker in the create form.

## Anatomy

`Tabs` > `TabsList` > `TabsTrigger` … plus one `TabsContent` per value, as a sibling of the list.

```jsx
<Tabs defaultValue="overview">
  <TabsList>
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="scans">Scans</TabsTrigger>
    <TabsTrigger value="actions">Actions</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">…</TabsContent>
  <TabsContent value="scans">…</TabsContent>
  <TabsContent value="actions">…</TabsContent>
</Tabs>
```

- `value` is the join key: every `TabsTrigger` needs one and every `TabsContent` needs the matching one. `defaultValue` on the root selects the initial tab (uncontrolled); use `value` + `onValueChange` to drive it from the URL.
- `TabsContent` is a panel and **must be a child of `Tabs`**, not of `TabsList`. It throws outside the root.
- The root is `flex` and already supplies the gap between list and panel; don't add margins between them.

## Variants

| `TabsList variant` | Look |
|---|---|
| `default` | a `bg-muted` pill track; the active trigger becomes a `bg-background` pill |
| `line` | no track — the active trigger gets an underline rule instead |

Use `default` for a self-contained switcher inside a card, `line` when the tabs sit directly on the page background under a heading.

## Orientation

`orientation="vertical"` on the root turns the list into a left-hand column of left-aligned triggers with the panel beside it — good for a long list of payload types (URL, Wi-Fi, vCard, SMS, geo…). Give the list an explicit width; it does not size itself.

## Composition inside a trigger

Triggers accept icons and counts inline:

```jsx
<TabsTrigger value="actions">
  <WebhookIcon data-icon="inline-start" />
  Actions
  <Badge variant="secondary">2</Badge>
</TabsTrigger>
```

Icons are auto-sized to `size-4`; `data-icon="inline-start"` / `"inline-end"` tightens that side's padding.

## Notes

- Triggers stretch to fill the list (`flex-1`), so a list is only as wide as you make it — constrain the list, not the triggers.
- Don't use tabs for navigation between different objects or routes; that's `Breadcrumb` + links or the `Sidebar`.
- `disabled` on a trigger dims it and removes it from the keyboard loop — make sure `defaultValue` doesn't point at it.
