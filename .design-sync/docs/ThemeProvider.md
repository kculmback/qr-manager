---
category: System
---

The app-wide theme context. It renders **no markup of its own** — it holds the current mode, persists it, and writes the resolved `light` / `dark` (`+ auto`) class onto `document.documentElement`, which is what every semantic token in the DS keys off.

## Setup

Wrap the app once, as high as possible — in this repo that is the root route:

```jsx
<ThemeProvider>
  <TooltipProvider>
    <App />
  </TooltipProvider>
</ThemeProvider>
```

Three modes: `"light"`, `"dark"`, `"auto"`. `auto` follows `prefers-color-scheme` and keeps following it — the provider subscribes to the media query and re-resolves on change. The choice is stored in `localStorage` under `theme-mode`; unreadable or unknown values fall back to `auto`.

For SSR, inline `themeDetectorScript` in the document `<head>`. It applies the stored class **before first paint**, which is what prevents the light-mode flash on a dark-mode reload. Without it the provider still works, but the page flickers.

## Reading and setting the theme

```jsx
const { themeMode, resolvedTheme, setTheme, toggleMode } = useTheme();
```

| | |
|---|---|
| `themeMode` | what the user chose — `"light"`, `"dark"` or `"auto"` |
| `resolvedTheme` | what is actually on screen — `"light"` or `"dark"` (never `"auto"`) |
| `setTheme(mode)` | set + persist + update the root class |
| `toggleMode()` | cycle through the three modes, starting from the system preference |

Branch on `resolvedTheme` when you need a value CSS can't express (a chart palette, an image swap). Branch on `themeMode` only when you are drawing the control that sets it.

`useTheme()` **throws** outside the provider. That is deliberate — it turns a missing provider into a loud error instead of a page stuck in light mode.

## Notes

- Style with the semantic tokens (`bg-background`, `bg-card`, `text-muted-foreground`, `border`) and both themes come for free. Reaching for `dark:` variants by hand means the token you wanted is missing.
- Don't nest a second `ThemeProvider` for a sub-tree: the root class is global, so an inner provider would report a different mode than the page is actually painting.
- `ThemeToggle` is the ready-made control for this context — prefer it to hand-rolling one.
