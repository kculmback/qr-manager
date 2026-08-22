## Building with @qr-manager/ui

A shadcn-style React 19 library built on **Base UI** (`@base-ui/react`) and **Tailwind v4**. Compose the shipped components; style your own layout with the utility vocabulary below. Never hand-write a lookalike of a component that exists.

### Wrap the app

```jsx
<ThemeProvider>
  <TooltipProvider>
    <div className="bg-background text-foreground min-h-screen font-sans antialiased">
      {children}
    </div>
  </TooltipProvider>
</ThemeProvider>
```

`ThemeProvider` owns light/dark (it toggles a `light`/`dark` class on the root element — the `.dark` selector is what re-points every color token). `ThemeToggle` throws outside it, and `Tooltip` needs `TooltipProvider`. Put `bg-background text-foreground` on your own root element: the tokens are defined, but nothing applies them for you.

### Styling idiom: Tailwind utilities over semantic tokens

Colors are **never** raw Tailwind palette values — no `bg-blue-500`, no hex. Use the semantic tokens, which flip automatically in dark mode:

| Family | Tokens |
|---|---|
| Surfaces | `background`, `card`, `popover`, `muted`, `accent`, `sidebar` |
| Text | `foreground`, `card-foreground`, `popover-foreground`, `muted-foreground`, `accent-foreground`, `secondary-foreground`, `primary-foreground` |
| Brand | `primary` (teal), `secondary` |
| Status | `destructive`, `success`, `warning`, `info`, `invert` |
| Lines | `border`, `input`, `ring` |
| Charts | `chart-1` … `chart-5` |

Each combines with `bg-`, `text-`, `border-`, `ring-`, `fill-`, `stroke-`, and takes an opacity suffix (`bg-primary/10`) and the `hover:` / `focus:` / `dark:` variants — so `bg-card text-card-foreground border-border`, `text-muted-foreground` for secondary copy, `bg-destructive/10 text-destructive` for danger.

Radii are generous and scale off `--radius`: `rounded-sm|md|lg|xl|2xl|3xl|4xl`. Cards and buttons use the large end (`rounded-4xl`) — match it rather than defaulting to `rounded-md`.

Fonts: body text is the system sans stack (`font-sans`). `font-mono` is **JetBrains Mono Variable** and `font-heading` is **Geist Mono Variable** — both ship with the bundle. Use `font-mono` for codes, slugs, URLs and IDs.

Spacing, layout, sizing and typography are ordinary Tailwind (`flex`, `grid grid-cols-3`, `gap-4`, `p-6`, `max-w-2xl`, `text-sm`, `font-medium`, `sm:`/`md:`/`lg:`). The stylesheet ships a pre-generated set of these, so stay in the standard scale — an exotic arbitrary value (`p-[13px]`, `bg-[#0ea5e9]`) has no rule behind it and renders unstyled.

### Where the truth is

- `_ds/<folder>/styles.css` and its `@import` closure — every token definition and every generated utility.
- `components/<group>/<Name>/<Name>.prompt.md` — how to compose that component, with examples. Read it before using a component for the first time.
- `<Name>.d.ts` — the exact props.

### Composition

Components ship as flat exports, not namespaces: it's `<CardHeader>`, never `<Card.Header>`. Parts are listed in each component's `.prompt.md`.

Base UI's `render` prop is how triggers compose — pass an element to change what a component renders as, instead of nesting two interactive elements:

```jsx
<DropdownMenuTrigger render={<Button variant="outline" size="icon" aria-label="Actions" />}>
  <MoreHorizontalIcon />
</DropdownMenuTrigger>
```

A worked example:

```jsx
<Card className="max-w-sm">
  <CardHeader>
    <CardTitle>Launch flyer</CardTitle>
    <CardDescription>Dynamic code — redirects to the campaign page.</CardDescription>
    <CardAction><Badge variant="secondary">Static</Badge></CardAction>
  </CardHeader>
  <CardContent className="text-muted-foreground">
    Printed on 2,000 flyers. <span className="font-mono">/r/spring-25</span>
  </CardContent>
  <CardFooter className="gap-2">
    <Button size="sm">Download PNG</Button>
    <Button size="sm" variant="outline">Edit</Button>
  </CardFooter>
</Card>
```

Form controls belong inside `Field` (`FieldLabel` + control + `FieldDescription`/`FieldError`) — that's what supplies the spacing and the invalid state. Don't space form rows by hand.

### Two known gaps

**`ThemeToggle` renders an empty button.** Its icons are switched with `light:` / `auto:` variants that `globals.css` never declares (only `@custom-variant dark` exists), and the trigger positions them `absolute` with no positioned ancestor. Build the control from `DropdownMenu` + `Button` yourself instead — that is all `ThemeToggle` is. Details in `ThemeToggle.prompt.md`.

**`recharts` is merged into this bundle and re-exports `Tooltip` and `Label`,** which collide with the design system's own. Importing either name from `recharts` silently gives you the DS component. Use `ChartTooltip` / `ChartTooltipContent` for chart tooltips — never recharts' `Tooltip` directly.
