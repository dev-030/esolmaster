import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { EngagementTooltip } from "./ToolTip"


interface EngageMent{
  day: string;
  activeUsers: number;
  taskCompletions: number;
}

export const EngagementChartCard = ({engagementData}: { engagementData: EngageMent[] }) => (
  <Card className="rounded-2xl border border-gray-100 shadow-sm">
    <CardHeader className="pb-2">
      <CardTitle className="text-base font-semibold text-gray-800">User Engagement Overview</CardTitle>
    </CardHeader>
    <CardContent>
      {/* Legend */}
      <div className="flex items-center gap-5 mb-4">
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <span className="w-3 h-2 rounded-sm inline-block bg-indigo-500" />
          Active Users
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <span className="w-3 h-2 rounded-sm inline-block bg-emerald-500" />
          Task Completions
        </div>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={engagementData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="indigo" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#6366F1" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#6366F1" stopOpacity={0.01} />
            </linearGradient>
            <linearGradient id="green" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#10B981" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#10B981" stopOpacity={0.01} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          <XAxis
            dataKey="day"
            tick={{ fontSize: 12, fill: "#9CA3AF" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "#9CA3AF" }}
            axisLine={false}
            tickLine={false}
            width={40}
            tickFormatter={(v) => v >= 1000 ? `${(v/1000).toFixed(1)}k` : v}
          />
          <Tooltip content={<EngagementTooltip />} />
          <Area
            type="monotone"
            dataKey="activeUsers"
            name="Active Users"
            stroke="#6366F1"
            strokeWidth={2.5}
            fill="url(#indigo)"
            dot={false}
            activeDot={{ r: 5, strokeWidth: 0, fill: "#6366F1" }}
          />
          <Area
            type="monotone"
            dataKey="taskCompletions"
            name="Task Completions"
            stroke="#10B981"
            strokeWidth={2.5}
            fill="url(#green)"
            dot={false}
            activeDot={{ r: 5, strokeWidth: 0, fill: "#10B981" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
)
