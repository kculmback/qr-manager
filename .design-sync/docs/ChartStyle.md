---
category: Data display
---

The piece that turns a `ChartConfig` into CSS. It renders a single `<style>` tag — no box, no layout, nothing you can see — declaring one custom property per configured series, scoped to one chart:

```css
[data-chart=chart-abc123] { --color-scans: var(--chart-1); --color-unique: var(--chart-2); }
.dark [data-chart=chart-abc123] { … }
```

That is where `fill="var(--color-scans)"` gets its value.

## You usually don't render it

`ChartContainer` renders `ChartStyle` itself, with a generated id it also puts on its own `data-chart` attribute. Inside a `ChartContainer`, the variables are already there — just use them.

Reach for `ChartStyle` directly only when something outside the chart element needs the same series colours: a custom legend, a stat row under the chart, a table whose rows are colour-keyed to the series. Then you own both halves of the contract — the `id` and a matching `data-chart` on the scoping element:

```jsx
<div data-chart="chart-scan-types">
  <ChartStyle id="chart-scan-types" config={chartConfig} />
  {Object.entries(chartConfig).map(([key, item]) => (
    <span key={key} style={{ backgroundColor: `var(--color-${key})` }} />
  ))}
</div>
```

If the `data-chart` value and the `id` don't match exactly, the selector misses and every variable resolves to nothing — the usual symptom is invisible marks.

## Theme-aware colours

A config entry takes either `color` (one value for both themes) or `theme: { light, dark }` — never both. `ChartStyle` emits the light block on the bare selector and the dark block under `.dark`, so a themed entry switches with the app:

```jsx
url: { label: "URL", theme: { light: "var(--chart-1)", dark: "var(--chart-4)" } }
```

Prefer plain `color: "var(--chart-N)"`; the `--chart-*` tokens are already redefined per theme. `theme` is for the rare series that needs a different *hue* in dark, not a different lightness.

## Notes

- Entries with neither `color` nor `theme` are skipped; if every entry is colourless, `ChartStyle` returns `null` and emits nothing at all.
- The id must be a valid CSS attribute-selector value — `ChartContainer` strips the colons out of `useId()` for exactly this reason. Use a plain kebab-case string.
- Because it is a `<style>` tag, ids are global: two charts sharing an id share (and fight over) one variable block. Give each chart its own.
