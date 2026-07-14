import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { TasksTooltip } from "./ToolTip"

interface PopularTask {
  name: string;
  completions: number;
}


export const PopularTasksCard = ({ popularTasksData }: { popularTasksData: PopularTask[] }) => (
  <Card className="rounded-2xl border border-gray-100 shadow-sm">
    <CardHeader className="pb-2">
      <CardTitle className="text-base font-semibold text-gray-800">Most Popular Tasks</CardTitle>
    </CardHeader>
    <CardContent>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={popularTasksData}
          layout="vertical"
          margin={{ top: 4, right: 24, left: 8, bottom: 4 }}
          barCategoryGap="28%"
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
          <XAxis
            type="number"
            tick={{ fontSize: 11, fill: "#9CA3AF" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => v >= 1000 ? `${(v/1000).toFixed(1)}k` : v}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fontSize: 12, fill: "#4B5563" }}
            axisLine={false}
            tickLine={false}
            width={148}
          />
          <Tooltip content={<TasksTooltip />} cursor={{ fill: "#f5f3ff" }} />
          <Bar
            dataKey="completions"
            fill="#6366F1"
            radius={[0, 6, 6, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
)
