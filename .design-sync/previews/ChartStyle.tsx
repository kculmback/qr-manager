import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import type { ChartConfig } from "@qr-manager/ui";
import { ChartContainer, ChartStyle } from "@qr-manager/ui";

const scansPerDay = [
  { day: "Mon", url: 186, wifi: 92, vcard: 41 },
  { day: "Tue", url: 245, wifi: 88, vcard: 55 },
  { day: "Wed", url: 173, wifi: 74, vcard: 38 },
  { day: "Thu", url: 309, wifi: 101, vcard: 62 },
  { day: "Fri", url: 421, wifi: 133, vcard: 71 },
];

const byType = {
  url: { label: "URL", color: "var(--chart-1)" },
  wifi: { label: "Wi-Fi", color: "var(--chart-2)" },
  vcard: { label: "vCard", color: "var(--chart-3)" },
} satisfies ChartConfig;

const themed = {
  url: { label: "URL", theme: { light: "var(--chart-1)", dark: "var(--chart-4)" } },
  wifi: { label: "Wi-Fi", theme: { light: "var(--chart-2)", dark: "var(--chart-5)" } },
} satisfies ChartConfig;

export function Swatches() {
  return (
    <div data-chart="chart-scan-types" className="w-72">
      <ChartStyle id="chart-scan-types" config={byType} />
      <div className="flex flex-col gap-2 text-sm">
        {Object.entries(byType).map(([key, item]) => (
          <div key={key} className="flex items-center gap-2">
            <span
              className="size-3 shrink-0 rounded-sm"
              style={{ backgroundColor: `var(--color-${key})` }}
            />
            <span>{item.label}</span>
            <code className="text-muted-foreground ml-auto font-mono text-xs">
              --color-{key}
            </code>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ThemeAware() {
  return (
    <div data-chart="chart-scan-types-themed" className="w-72">
      <ChartStyle id="chart-scan-types-themed" config={themed} />
      <div className="flex flex-col gap-2 text-sm">
        {Object.entries(themed).map(([key, item]) => (
          <div key={key} className="flex items-center gap-2">
            <span
              className="size-3 shrink-0 rounded-sm"
              style={{ backgroundColor: `var(--color-${key})` }}
            />
            <span>{item.label}</span>
            <code className="text-muted-foreground ml-auto font-mono text-xs">
              light / dark
            </code>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DrivingAChart() {
  return (
    <ChartContainer config={byType} className="h-48 w-80">
      <BarChart data={scansPerDay} margin={{ top: 4, right: 4, bottom: 0 }}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
        <Bar isAnimationActive={false} dataKey="url" stackId="a" fill="var(--color-url)" />
        <Bar isAnimationActive={false} dataKey="wifi" stackId="a" fill="var(--color-wifi)" />
        <Bar isAnimationActive={false}
          dataKey="vcard"
          stackId="a"
          fill="var(--color-vcard)"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ChartContainer>
  );
}
