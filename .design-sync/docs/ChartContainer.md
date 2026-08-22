---
category: Data display
---

The root of every chart. It owns the config, sizes the chart responsively, injects the per-series CSS variables, and restyles recharts' hard-coded SVG defaults to DS tokens. A recharts chart that is not inside a `ChartContainer` will render with `#ccc` gridlines and browser-default text — always wrap.

## Config first

`config` maps each `dataKey` to a label and a colour, and it is what every other part of the chart family reads:

```jsx
const chartConfig = {
  scans:  { label: "Total scans",    color: "var(--chart-1)" },
  unique: { label: "Unique devices", color: "var(--chart-2)" },
} satisfies ChartConfig;
```

Colours come from the DS's five categorical tokens `--chart-1` … `--chart-5`, in order. Don't reach for raw hex or Tailwind palette colours — they won't survive the theme switch.

Each key becomes a CSS variable scoped to this chart, so series colours are referenced as `var(--color-<key>)` inside the recharts elements:

```jsx
<ChartContainer config={chartConfig} className="h-48 w-full">
  <BarChart data={scansPerDay}>
    <CartesianGrid vertical={false} />
    <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
    <Bar dataKey="scans" fill="var(--color-scans)" radius={4} />
  </BarChart>
</ChartContainer>
```

For a colour that must differ between themes, use `theme: { light, dark }` instead of `color`.

## Sizing

The container is `aspect-video` by default and wraps a recharts `ResponsiveContainer`, so it fills its parent's width. Give it a height (`className="h-48"`, `h-64"`) or let the aspect ratio do it — but the parent must have a definite width, or recharts measures zero and nothing paints.

`initialDimension` (default 320×200) is the size used before the first measurement; raise it if a server-rendered chart flashes at the wrong size.

## Axis conventions

The container styles ticks to `fill-muted-foreground` and the grid to `stroke-border/50` for you. On top of that, the house style is:

- `<CartesianGrid vertical={false} />` — horizontal rules only.
- `tickLine={false} axisLine={false} tickMargin={8}` on every axis.
- Drop the `YAxis` entirely when a tooltip already gives exact values.

## Notes

- Children must be a single recharts chart element (`BarChart`, `LineChart`, `AreaChart`, `PieChart`, …) — `ResponsiveContainer` clones exactly one child.
- Import the recharts pieces from `recharts`; only the wrappers (`ChartContainer`, `ChartTooltip`, `ChartLegend`, `ChartStyle` and their `*Content` parts) come from the DS.
- `ChartTooltipContent` and `ChartLegendContent` call `useChart()`, so they throw outside a `ChartContainer`. That is the guardrail working.
- Every series needs an entry in `config` — a `dataKey` with no config entry gets no colour variable and no legend/tooltip label.
