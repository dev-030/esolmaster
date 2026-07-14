import React from "react";
import { Progress } from "@/components/ui/progress";
import { Lock, CheckCircle2 } from "lucide-react";

export interface BadgeItem {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  completed: boolean;
  progress?: number;
  progressLabel?: string;
  iconColor?: string;
}

export const BadgeCard = ({ badge }: { badge: BadgeItem }) => {
  return (
    <div
      className={`rounded-2xl p-5 flex flex-col items-center gap-3 shadow-sm border transition ${
        badge.completed
          ? "bg-gradient-to-br from-yellow-100 to-orange-100 border-yellow-300"
          : "bg-muted/40 border-border opacity-75"
      }`}
    >
      <div
        className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm ${
          badge.completed
            ? "bg-gradient-to-br from-yellow-50 to-orange-100"
            : "bg-muted"
        }`}
      >
        {badge.completed ? (
          <span
            className={`${badge.iconColor ?? "text-amber-500"} [&>svg]:w-7 [&>svg]:h-7`}
          >
            {badge.icon}
          </span>
        ) : (
          <Lock className="w-7 h-7 text-muted-foreground" />
        )}
      </div>

      <div className="text-center">
        <p
          className={`text-sm font-bold ${
            badge.completed ? "text-amber-700" : "text-muted-foreground"
          }`}
        >
          {badge.title}
        </p>

        <p
          className={`text-xs mt-0.5 ${
            badge.completed ? "text-amber-700/80" : "text-muted-foreground"
          }`}
        >
          {badge.subtitle}
        </p>
      </div>

      {badge.completed ? (
        <span className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full bg-amber-600 text-white">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Unlocked
        </span>
      ) : (
        <div className="w-full">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>{badge.progressLabel ?? "Progress"}</span>
            <span>{badge.progress ?? 0}%</span>
          </div>
          <Progress value={badge.progress ?? 0} className="h-1.5" />
        </div>
      )}
    </div>
  );
};