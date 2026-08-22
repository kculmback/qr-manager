---
category: Data display
---

The hover readout for a chart. `ChartTooltip` is recharts' `Tooltip` re-exported unchanged — all the DS styling lives in `ChartTooltipContent`, which you pass to it. The pair only works inside a `ChartContainer`, whose `config` supplies the labels and colours.

## Composition

Always both, always in this shape:

```jsx
<ChartContainer config={chartConfig} className="h-48 w-full">
  <BarChart data={scansPerDay}>
    <CartesianGrid vertical={false} />
    <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
    <ChartTooltip content={<ChartTooltipContent />} />
    <Bar dataKey="scans" fill="var(--color-scans)" radius={4} />
  </BarChart>
</ChartContainer>
```

`ChartTooltipContent` reads the container's `config`, so the series name shown is `config[key].label`, not the raw `dataKey`, and the swatch colour matches the mark. Nothing needs passing through.

## Indicator

`indicator` changes the swatch next to each row:

- `dot` (default) — a filled square; the right choice for bars and areas.
- `line` — a thin bar; matches a line series' stroke.
- `dashed` — an outline; for a projected/comparison series.

With `line` or `dashed` and a single series, the label nests beside the value instead of sitting above — that is intentional, not a layout bug.

## Labels and values

- `hideLabel` drops the header row — use it when the x value is already obvious (a single-category chart).
- `hideIndicator` drops the swatches — use it when there is one series and one colour.
- `labelFormatter(value, payload)` rewrites the header: `labelFormatter={(d) => formatDate(d)}`.
- `formatter(value, name, item, index, payload)` takes over an entire row when you need units or a delta.
- `labelKey` / `nameKey` point at a different config entry when the data's key isn't the series key (common for pie slices, where the name lives in the datum).

Values are rendered `font-mono tabular-nums` and run through `toLocaleString()` already — don't pre-format numbers into strings just to add separators.

## Notes

- The tooltip surface is `bg-popover` with a ring and `shadow-lg`; it is not a `Tooltip` from the overlay family and takes none of its props.
- To pin the tooltip open (a screenshot, a demo, a keyboard-driven readout), pass `active` with `defaultIndex={n}` on `ChartTooltip` and `isAnimationActive={false}`.
- `cursor={false}` removes the highlight band behind the hovered category; keep it on for bar charts, where it is the only hit-target feedback.
