---
category: Data display
---

Renders a keyboard key. Use it wherever the UI teaches a shortcut — a command palette row, a button hint, a tooltip, a keyboard-shortcuts sheet.

## Composition

One `Kbd` is one key. Multi-key chords are a `KbdGroup`, never a single `Kbd` containing `⌘K`:

```jsx
<KbdGroup>
  <Kbd>⌘</Kbd>
  <Kbd>K</Kbd>
</KbdGroup>
```

`KbdGroup` is just an inline flex row with a gap, so plain text between keys works and is the right way to write a sequence:

```jsx
<KbdGroup>
  <Kbd>G</Kbd>
  <span>then</span>
  <Kbd>A</Kbd>
</KbdGroup>
```

Prefer the platform glyphs — `⌘` `⇧` `⌥` `⌃` `⏎` `⌫` `Esc` — over spelled-out names; they stay narrow enough for the fixed `min-w-5.5` key. An icon child is fine and is auto-sized to `size-3`.

## Context styling

`Kbd` restyles itself from its surroundings, so it usually needs no `className`:

- default — `bg-muted` on a normal surface
- inside an `InputGroup` — switches to `bg-input` so it sits on the field
- inside a `TooltipContent` — inverts against the dark tooltip

The one place it needs help is a key on a solid `default` Button, where `bg-muted` sits on the primary fill with no contrast. Prefer `variant="secondary"` or `variant="outline"` for a button that carries a key hint, with `bg-background` on the `Kbd` if it still needs lifting.

## Notes

- `Kbd` is `pointer-events-none` and non-selectable by design — it is a hint, never the control. The clickable thing is the surrounding `Button` or menu item.
- Right-align shortcut hints in a list (`justify-between`) so the keys form a column.
- Don't announce shortcuts to screen readers twice: if the parent control already has an `aria-keyshortcuts`, the `Kbd` is decoration.
