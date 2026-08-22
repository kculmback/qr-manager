---
category: Actions
---

The action control. Every clickable affordance in the app is a `Button` — including things that look like icons, links or menu triggers.

## Variants

| variant | Use for |
|---|---|
| `default` | the primary action of a view or dialog — one per surface |
| `secondary` | a supporting action shown next to the primary one |
| `outline` | neutral actions on their own (toolbar buttons, "Edit") |
| `ghost` | low-emphasis actions inside dense UI (row actions, "Cancel") |
| `destructive` | delete/remove; tinted, not solid red |
| `link` | inline navigation that must read as text |

Sizes: `xs`, `sm`, `default`, `lg`, and the square `icon`, `icon-xs`, `icon-sm`, `icon-lg` for icon-only buttons.

## Composition

```jsx
<Button>Create QR code</Button>
<Button variant="outline" size="sm">Edit target</Button>

// icon + label — mark the icon's side so the button tightens its padding
<Button>
  <PlusIcon data-icon="inline-start" />
  New code
</Button>

// icon only — always give it an accessible name
<Button size="icon" variant="ghost" aria-label="Delete">
  <TrashIcon />
</Button>
```

Icons are sized automatically (`size-4`, `size-3` at `xs`); don't add size classes. `data-icon="inline-start"` / `"inline-end"` tells the button which side the icon sits on so it can reduce that side's padding.

## Notes

- Built on `@base-ui/react`'s Button, so it accepts `render` to change the underlying element — that is how triggers compose: `<DropdownMenuTrigger render={<Button variant="outline" />}>`.
- Use `disabled` for unavailable actions; add `focusableWhenDisabled` when the reason needs to stay reachable by keyboard.
- Group related buttons with `ButtonGroup` rather than spacing them by hand.
