import { QrCodeIcon, SmartphoneIcon } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import type { ChartConfig } from "@qr-manager/ui";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
} from "@qr-manager/ui";

const scansPerDay = [
  { day: "Mon", scans: 186, unique: 142 },
  { day: "Tue", scans: 245, unique: 191 },
  { day: "Wed", scans: 173, unique: 128 },
  { day: "Thu", scans: 309, unique: 236 },
  { day: "Fri", scans: 421, unique: 318 },
  { day: "Sat", scans: 268, unique: 205 },
  { day: "Sun", scans: 154, unique: 119 },
];

const twoSeries = {
  scans: { label: "Total scans", color: "var(--chart-1)" },
  unique: { label: "Unique devices", color: "var(--chart-2)" },
} satisfies ChartConfig;

const withIcons = {
  scans: { label: "Total scans", color: "var(--chart-1)", icon: QrCodeIcon },
  unique: {
    label: "Unique devices",
    color: "var(--chart-2)",
    icon: SmartphoneIcon,
  },
} satisfies ChartConfig;

export function Bottom() {
  return (
    <ChartContainer config={twoSeries} className="h-48 w-80">
      <BarChart data={scansPerDay} margin={{ top: 4, right: 4, bottom: 0 }}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar isAnimationActive={false} dataKey="scans" fill="var(--color-scans)" radius={4} />
        <Bar isAnimationActive={false} dataKey="unique" fill="var(--color-unique)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}

export function Top() {
  return (
    <ChartContainer config={twoSeries} className="h-48 w-80">
      <BarChart data={scansPerDay} margin={{ top: 4, right: 4, bottom: 0 }}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
        <ChartLegend verticalAlign="top" content={<ChartLegendContent />} />
        <Bar isAnimationActive={false} dataKey="scans" fill="var(--color-scans)" radius={4} />
        <Bar isAnimationActive={false} dataKey="unique" fill="var(--color-unique)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}

export function WithIcons() {
  return (
    <ChartContainer config={withIcons} className="h-48 w-80">
      <BarChart data={scansPerDay} margin={{ top: 4, right: 4, bottom: 0 }}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar isAnimationActive={false}
          dataKey="unique"
          stackId="a"
          fill="var(--color-unique)"
          radius={[0, 0, 4, 4]}
        />
        <Bar isAnimationActive={false}
          dataKey="scans"
          stackId="a"
          fill="var(--color-scans)"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ChartContainer>
  );
}
