import { cn } from "@/lib/utils";

export const PercentageBar=({ percentage }: { percentage: number })=> {
  const clamped = Math.max(0, Math.min(100, percentage));
  const color =
    clamped >= 70 ? "bg-emerald-500"
    : clamped >= 40 ? "bg-amber-500"
    : "bg-rose-500";

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-[11px]">
        <span className="text-muted-foreground font-medium">Student accuracy</span>
        <span className={cn(
          "font-bold tabular-nums",
          clamped >= 70 ? "text-emerald-600"
          : clamped >= 40 ? "text-amber-600"
          : "text-rose-600"
        )}>{clamped}%</span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-700", color)}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
