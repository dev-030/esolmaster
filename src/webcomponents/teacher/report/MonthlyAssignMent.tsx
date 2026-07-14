/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Line,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Dot,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  rate: {
    label: "Completion Rate (%)",
    color: "#22c55e",
  },
} satisfies ChartConfig;

interface MonthlyDataPoint {
  month: string;
  rate: number;
  totalAssigned?: number;
  totalCompleted?: number;
}

interface MonthlyAssignmentCompletionProps {
  data: MonthlyDataPoint[];
}

// Custom Dot Component
const CustomDot = (props: any) => {
  const { cx, cy, payload } = props;

  const radius = payload.rate > 800 ? 6 : 4; // Adjust threshold based on your data scale

  return (
    <Dot
      cx={cx}
      cy={cy}
      r={radius}
      fill="#22c55e"
      stroke="#fff"
      strokeWidth={2}
    />
  );
};

export const MonthlyAssignmentCompletion = ({ data }: MonthlyAssignmentCompletionProps) => {
  if (!data || data.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Monthly Assignment Completion Rate
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[350px] flex items-center justify-center text-muted-foreground">
            No data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Monthly Assignment Completion Rate
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12, fill: "#64748b" }}
                dy={10}
              />
              <YAxis
                domain={[0, 'auto']}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12, fill: "#64748b" }}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="rate"
                stroke="var(--color-rate)"
                strokeWidth={3}
                dot={<CustomDot />}
                activeDot={{ r: 8, strokeWidth: 0 }}
                animationDuration={1500}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};