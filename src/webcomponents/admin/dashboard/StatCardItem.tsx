import { TrendingDown, TrendingUp } from "lucide-react";
export interface StatCard {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  bgColor: string;
  iconBg: string;
  iconColor: string;
  change: number; // positive = increase, negative = decrease
  direction: "increase" | "decrease" | "neutral";
}
export const StatCardItem = ({ card }: { card: StatCard }) => {
  const isPositive = card.direction === "increase";

  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-3 shadow-sm"
      style={{ backgroundColor: card.bgColor }}
    >
      {/* Top row: title + icon */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-500">{card.title}</span>
        <div
          className="p-2 rounded-md"
          style={{ backgroundColor: card.iconBg }}
        >
          <span style={{ color: card.iconColor }}>{card.icon}</span>
        </div>
      </div>

      {/* Value */}
      <div className="text-2xl font-bold" style={{ color: card.iconColor }}>
        {card.value}
      </div>

      {/* Change from last month */}
      <div className="flex items-center gap-1 text-xs font-medium">
        {isPositive ? (
          <TrendingUp size={14} className="text-emerald-500" />
        ) : (
          <TrendingDown size={14} className="text-red-500" />
        )}
        <span className={isPositive ? "text-emerald-600" : "text-red-500"}>
          {isPositive ? "+" : ""}
          {card.change}%
        </span>
        <span className="text-gray-400 font-normal">from last month</span>
      </div>
    </div>
  );
};
