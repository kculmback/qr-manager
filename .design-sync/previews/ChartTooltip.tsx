import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import type { ChartConfig } from "@qr-manager/ui";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
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

export function Dot() {
  return (
    <ChartContainer config={twoSeries} className="h-48 w-80">
      <BarChart data={scansPerDay} margin={{ top: 4, right: 4, bottom: 0 }}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip
          active
          defaultIndex={4}
          isAnimationActive={false}
          content={<ChartTooltipContent />}
        />
        <Bar isAnimationActive={false} dataKey="unique" fill="var(--color-unique)" radius={4} />
        <Bar isAnimationActive={false} dataKey="scans" fill="var(--color-scans)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}

export function LineIndicator() {
  return (
    <ChartContainer config={twoSeries} className="h-48 w-80">
      <BarChart data={scansPerDay} margin={{ top: 4, right: 4, bottom: 0 }}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip
          active
          defaultIndex={1}
          isAnimationActive={false}
          content={<ChartTooltipContent indicator="line" />}
        />
        <Bar isAnimationActive={false} dataKey="scans" fill="var(--color-scans)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}

export function Formatted() {
  return (
    <ChartContainer config={twoSeries} className="h-48 w-80">
      <BarChart data={scansPerDay} margin={{ top: 4, right: 4, bottom: 0 }}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip
          active
          defaultIndex={3}
          isAnimationActive={false}
          content={
            <ChartTooltipContent
              indicator="dashed"
              labelFormatter={(value) => `${String(value)} · week 12`}
            />
          }
        />
        <Bar isAnimationActive={false} dataKey="scans" fill="var(--color-scans)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}
