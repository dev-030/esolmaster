import { LucideIcon } from "lucide-react";

type Props = {
  title: string;
  value: string | number;
  change?: number;
  trend?: "increase" | "decrease" | "neutral";
  icon: LucideIcon;
  gradient: string;
  strokeColor: string;
  iconBg: string;
};

export const DashboardStatCard = ({
  title,
  value,
  change,
  icon: Icon,
  gradient,
  strokeColor,
  iconBg,
}: Props) => {
  const isPositive = change !== undefined && change > 0;

  return (
    <div
      className={`relative overflow-hidden rounded-2xl p-5 flex flex-col gap-3 shadow-sm ${gradient}`}
    >
      <div
        className="absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-20"
        style={{ background: strokeColor }}
      />

      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-xs font-medium text-white/70 uppercase tracking-widest">
            {title}
          </p>
          <p className="text-3xl font-extrabold text-white mt-1">{value}</p>
        </div>

        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center shadow-md"
          style={{
            background: iconBg,
            border: `2px solid ${strokeColor}`,
          }}
        >
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>

      <div className="flex items-center gap-1 relative z-10">
        {change !== undefined && (
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/20 text-white">
            {isPositive ? "▲" : "▼"} {Math.abs(change)}%
          </span>
        )}

        <span className="text-xs text-white/60">vs last month</span>
      </div>
    </div>
  );
};
