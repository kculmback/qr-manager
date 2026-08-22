---
category: Data display
---

The series key for a chart. `ChartLegend` is recharts' `Legend` re-exported unchanged; the DS styling is in `ChartLegendContent`, which you pass as its `content`. Both require a surrounding `ChartContainer` — the labels and colours come from its `config`.

## Composition

```jsx
<ChartContainer config={chartConfig} className="h-48 w-full">
  <BarChart data={scansPerDay}>
    <CartesianGrid vertical={false} />
    <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
    <ChartLegend content={<ChartLegendContent />} />
    <Bar dataKey="scans"  fill="var(--color-scans)"  radius={4} />
    <Bar dataKey="unique" fill="var(--color-unique)" radius={4} />
  </BarChart>
</ChartContainer>
```

Entries are generated from the chart's series, in render order, and labelled with `config[key].label`. There is no `payload` to build by hand.

## When to include one

Only when there is more than one series. A single-series chart with a legend is noise — name the series in the surrounding `CardTitle` instead.

## Placement

`verticalAlign="top"` moves the legend above the plot and swaps its padding automatically (`pb-3` instead of `pt-3`); the default is `bottom`. Put it on top when the chart sits directly under a heading and the legend reads as part of it.

## Icons

A `config` entry can carry an `icon` component, which replaces the colour swatch for that series:

```jsx
const chartConfig = {
  scans:  { label: "Total scans", color: "var(--chart-1)", icon: QrCodeIcon },
  unique: { label: "Unique devices", color: "var(--chart-2)", icon: SmartphoneIcon },
} satisfies ChartConfig;
```

Icons render at `size-3` in `text-muted-foreground` — so they identify the series but no longer encode its colour. Only use them when the marks are already distinguishable some other way, or pass `hideIcon` to force swatches back on.

## Notes

- The legend is a static key, not a filter. Clicking it does nothing; if series need toggling, that is app state driving the `Bar`/`Line`'s `hide` prop.
- Entries with `type: "none"` are filtered out, which is how you keep a helper series (a reference band, a stacked total) out of the key.
- `nameKey` points at a different config entry when the series' `dataKey` isn't the config key — the usual case for pie charts.
