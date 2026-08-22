---
category: Actions
---

The light / dark / system switcher. It is a ready-made control, not a primitive: an `outline` icon button that opens a `DropdownMenu` with **Light**, **Dark** and **System**, wired straight to `ThemeProvider`.

## Usage

```jsx
<ThemeToggle />
```

It takes no props. Drop it wherever the app chrome lives — usually the right-hand end of the header or a settings row:

```jsx
<header className="flex items-center gap-2">
  <span className="font-heading text-sm font-medium">QR Manager</span>
  <div className="ml-auto flex items-center gap-2">
    <Button variant="ghost" size="icon" aria-label="Settings"><SettingsIcon /></Button>
    <ThemeToggle />
  </div>
</header>
```

- **It must be inside `ThemeProvider`.** It calls `useTheme()`, which throws outside the provider — this is the single most common way to break a page that renders it.
- The trigger stacks three icons (sun / moon / monitor) in the same `size-9` square and scales the right one in from the `light` / `dark` / `auto` class on the document root. So the icon reflects the *resolved* theme, and in `auto` mode you get the monitor glyph, not a sun.
- The menu opens `align="end"`, which is why it belongs at the right edge of its row.

## Notes

- Don't build your own three-way switch from `Button` + `useTheme()`; the icon-crossfade behaviour is the DS's, and a segmented control loses the "System" nuance.
- One per app chrome. If a settings page also needs the choice, use a `RadioGroup` bound to `setTheme` there rather than a second toggle.
- Since it is an icon-only trigger, the accessible name comes from a visually hidden "Toggle theme" label that ships with the component — don't add another.

## Known issue: the icons are invisible

`ThemeToggle`'s three icons are toggled with `light:`, `auto:` and `dark:` variants, but `packages/ui/src/styles/globals.css` only declares one custom variant:

```css
@custom-variant dark (&:is(.dark *));
```

With no `light` or `auto` variant defined, `light:scale-100!` and `auto:scale-100!` compile to **nothing**, while the trigger's base class sets `[&>svg]:scale-0`. The result is a button with no visible glyph in light and system modes — in this design system's own preview and in the app alike. Only the dark-mode moon icon resolves.

A second defect compounds it: the trigger styles its icons `[&>svg]:absolute`, but neither the `Button` base class nor the trigger sets `relative`. The icons are therefore positioned against whatever ancestor happens to be positioned — not the button — so even the dark-mode moon icon does not appear inside the control.

Until `globals.css` declares `@custom-variant light` / `@custom-variant auto` **and** the trigger gets a `relative`, `ThemeToggle` renders as an empty circular button in every theme. Build the control from `DropdownMenu` + `Button` directly instead — that is all `ThemeToggle` is:

```jsx
<DropdownMenu>
  <DropdownMenuTrigger render={<Button variant="outline" size="icon" aria-label="Theme" />}>
    <SunIcon />
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end">
    <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
    <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
    <DropdownMenuItem onClick={() => setTheme("auto")}>System</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```
