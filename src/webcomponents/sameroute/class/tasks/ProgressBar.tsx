"use client";

import { cn } from "@/lib/utils";

interface ProgressBarProps {
  current: number;
  total: number;
  answered: boolean[];
  onNavigate?: (index: number) => void;
}

export const  ProgressBar = ({ current, total, answered, onNavigate }: ProgressBarProps) => {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold text-foreground">
          Question {current + 1}
          <span className="text-muted-foreground font-normal"> / {total}</span>
        </span>
        <span className="text-xs text-muted-foreground">
          {answered.filter(Boolean).length} of {total} answered
        </span>
      </div>

      {/* Dot track */}
      <div className="flex gap-1.5 items-center flex-wrap">
        {Array.from({ length: total }).map((_, i) => (
          <button
            key={i}
            onClick={() => onNavigate?.(i)}
            title={`Question ${i + 1}`}
            className={cn(
              "rounded-full transition-all duration-200 focus:outline-none",
              i === current
                ? "bg-primary w-6 h-2"
                : answered[i]
                ? "bg-primary/40 w-2 h-2 hover:bg-primary/60"
                : "bg-border w-2 h-2 hover:bg-muted-foreground/40",
              onNavigate ? "cursor-pointer" : "cursor-default"
            )}
          />
        ))}
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-border rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-500"
          style={{ width: `${((current + 1) / total) * 100}%` }}
        />
      </div>
    </div>
  );
}