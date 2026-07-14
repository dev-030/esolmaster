'use client';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend,
  TooltipProps,
} from "recharts";
import { SectionHeading } from "../../reusable/SectionHeading";
import { ProgressCard } from "./ProgressCard";
import { useGetStudentProgressQuery, useGetStudentScoreTrendQuery, useGetStudentSkillDistributionQuery } from "@/api/student";

// Types for tooltip payload
interface TooltipPayload {
  name: string;
  value: number;
  color: string;
  dataKey: string;
}

interface CustomTooltipProps extends TooltipProps<number, string> {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}

// Custom tooltip for line chart - moved outside component
const CustomLineTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border border-border rounded-lg shadow-lg p-3">
        <p className="text-sm font-semibold text-foreground mb-2">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-xs" style={{ color: entry.color }}>
            {entry.name}: {entry.value}%
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Custom tooltip for pie chart - moved outside component
const CustomPieTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border border-border rounded-lg shadow-lg p-3">
        <p className="text-sm font-semibold text-foreground">
          {payload[0].name}
        </p>
        <p className="text-xs text-muted-foreground">
          Value: {payload[0].value}%
        </p>
      </div>
    );
  }
  return null;
};

export const Progress = () => {
  const { data: studentProgress } = useGetStudentProgressQuery();
  const { data: score } = useGetStudentScoreTrendQuery();
  const { data: skillDistribution } = useGetStudentSkillDistributionQuery();
  
  const PROGRESS_CARDS = [
  { title: "Grammar Mastery", gradient: "bg-[linear-gradient(135deg,#6699FF_0%,#799EE9_100%,#4A86FF_49%)]", value: studentProgress?.grammar || 0, label: "Grammar" },
  { title: "Reading Comprehension", gradient: "bg-[linear-gradient(135deg,#0ABA10_0%,#3DC141_100%,#00C006_100%)]", value: studentProgress?.reading || 0, label: "Reading" },
  { title: "Vocabulary", gradient: "bg-[linear-gradient(135deg,#09BAAB_0%,#3EC2B7_100%,#00BFAF_100%)]", value: studentProgress?.vocabulary || 0, label: "Vocabulary" },
  { title: "Overall Progress", gradient: "bg-[linear-gradient(135deg,#F0C102_0%,#FFCC02_100%,#FFD428_100%)]", value: studentProgress?.overall || 0, label: "Overall" },
];

  return (
    <div className="space-y-8">
      {/* Heading */}
      <SectionHeading
        heading="Progress Tracker"
        subheading="Monitor your learning journey across all skill areas."
      />

      {/* 4 progress cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {PROGRESS_CARDS.map((card, index) => (
          <ProgressCard key={index} {...card} />
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-foreground">
              Score Trend
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Performance over the last 6 weeks
            </p>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={score} margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
                strokeOpacity={0.5}
              />
              <XAxis 
                dataKey="week" 
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                axisLine={{ stroke: "hsl(var(--border))" }}
                tickLine={{ stroke: "hsl(var(--border))" }}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                domain={[0, 100]}
                axisLine={{ stroke: "hsl(var(--border))" }}
                tickLine={{ stroke: "hsl(var(--border))" }}
                label={{ 
                  value: "Score (%)", 
                  angle: -90, 
                  position: "insideLeft",
                  style: { fontSize: 12, fill: "hsl(var(--muted-foreground))" }
                }}
              />
              <Tooltip content={<CustomLineTooltip />} />
              <Legend 
                wrapperStyle={{ fontSize: 12, paddingTop: 12 }}
                iconType="circle"
                iconSize={8}
              />
              <Line
                type="monotone"
                dataKey="Grammar"
                stroke="#3B82F6"
                strokeWidth={2.5}
                dot={{ r: 4, strokeWidth: 2 }}
                activeDot={{ r: 6 }}
                strokeOpacity={0.9}
              />
              <Line
                type="monotone"
                dataKey="Reading"
                stroke="#10B981"
                strokeWidth={2.5}
                dot={{ r: 4, strokeWidth: 2 }}
                activeDot={{ r: 6 }}
                strokeOpacity={0.9}
              />
              <Line
                type="monotone"
                dataKey="Vocabulary"
                stroke="#F59E0B"
                strokeWidth={2.5}
                dot={{ r: 4, strokeWidth: 2 }}
                activeDot={{ r: 6 }}
                strokeOpacity={0.9}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Donut Chart */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-foreground">
              Skill Distribution
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Current proficiency breakdown
            </p>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={skillDistribution}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
              >
                {(skillDistribution ?? []).map((entry: { name: string; color: string }, index: number) => (
                  <Cell
                    key={entry.name ?? index}
                    fill={entry.color}
                    className="cursor-pointer hover:opacity-80 transition-opacity"
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomPieTooltip />} />
              <Legend 
                wrapperStyle={{ fontSize: 12, paddingTop: 12 }}
                iconType="circle"
                iconSize={8}
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};