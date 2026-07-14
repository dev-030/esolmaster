"use client";

import {
  Pie,
  PieChart,
  Tooltip,
  Legend,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  value: {
    label: "Students",
  },
  excellent: {
    label: "90–100",
    color: "#22c55e",
  },
  good: {
    label: "80–89",
    color: "#3b82f6",
  },
  average: {
    label: "70–79",
    color: "#f97316",
  },
  below: {
    label: "Below 70",
    color: "#ef4444",
  },
} satisfies ChartConfig;

interface ScoreDataPoint {
  range: string;
  label: string;
  value: number;
  fill: string;
}

interface OverallScoreDistributionProps {
  data: ScoreDataPoint[];
}

export const OverallScoreDistribution = ({ data }: OverallScoreDistributionProps) => {
  if (!data || data.length === 0 || data.every(item => item.value === 0)) {
    return (
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle className="text-lg font-semibold">
            Overall Score Distribution
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <div className="h-[350px] flex items-center justify-center text-muted-foreground">
            No data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-lg font-semibold">
          Overall Score Distribution
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[350px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={data}
                dataKey="value"
                nameKey="range"
                innerRadius={70}
                outerRadius={100}
                strokeWidth={5}
                paddingAngle={5}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Legend
                verticalAlign="bottom"
                align="center"
                layout="horizontal"
                iconType="circle"
                formatter={(value) => {
                  const item = data.find(d => d.range === value);
                  return (
                    <span className="text-xs font-medium text-muted-foreground">
                      {item?.label || value}
                    </span>
                  );
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};