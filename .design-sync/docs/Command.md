---
category: Navigation
---

The command palette / searchable action list (cmdk). Use it for ⌘K search, "jump to" navigation, and any list that should filter as you type. It renders inline; `CommandDialog` is the same list inside a modal.

## Anatomy

```jsx
<Command>
  <CommandInput placeholder="Search codes and actions…" />
  <CommandList>
    <CommandEmpty>No results found.</CommandEmpty>
    <CommandGroup heading="Actions">
      <CommandItem>
        <PlusIcon />
        New QR code
        <CommandShortcut>⌘N</CommandShortcut>
      </CommandItem>
    </CommandGroup>
    <CommandSeparator />
    <CommandGroup heading="Codes">
      <CommandItem>Spring launch flyer</CommandItem>
    </CommandGroup>
  </CommandList>
</Command>
```

- `CommandInput` does the filtering — matching is over each item's text content, so put a `value` on `CommandItem` when the visible label isn't what should match.
- `CommandEmpty` renders only when nothing matches. Always include one.
- `CommandShortcut` is right-aligned muted text for a keybinding hint; it isn't a key handler.
- `CommandGroup heading` labels a section and hides itself when all of its items filter out.
- For the ⌘K modal, use `CommandDialog` — same children, plus dialog chrome.

`Command` has no border of its own; give it `rounded-2xl border shadow-md` when it floats.
