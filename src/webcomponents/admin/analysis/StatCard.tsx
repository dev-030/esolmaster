import { TrendingDown, TrendingUp } from "lucide-react";

export interface StatCard {
  title: string;
  value: number;
  icon: React.ReactNode;
  bgColor: string;
  borderColor: string;
  iconColor: string;
  change: number;
}

export const StatCardItem = ({ card }: { card: StatCard }) => {
  const isPositive = card.change >= 0;
  return (
    <div
      className="rounded-2xl p-5 border flex flex-col gap-3"
      style={{ backgroundColor: card.bgColor, borderColor: card.borderColor }}
    >
      {/* Icon + Title row */}
      <div className="flex items-center gap-3">
        <span style={{ color: card.iconColor }}>{card.icon}</span>
        <span className="text-sm font-medium text-gray-600">{card.title}</span>
      </div>

      {/* Value */}
      <div className="text-2xl font-bold text-gray-900 pl-0.5">
        {card.value.toLocaleString()}
      </div>

      {/* Change */}
      <div className="flex items-center gap-1.5 text-xs font-medium">
        {isPositive ? (
          <TrendingUp size={13} className="text-emerald-500" />
        ) : (
          <TrendingDown size={13} className="text-red-500" />
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
