import {
  BookOpen,
  FileText,
  Languages,
  SpellCheck,
} from "lucide-react";
import { typeColor } from "./data";
import { RecentActivity as RecentActivityInterface } from "@/types/student";
import { formatDistanceToNow } from "date-fns";

export const RecentActivity = ({
  items,
}: {
  items: RecentActivityInterface[];
}) => (
  <div className="bg-card border border-border rounded-2xl p-5">
    <h3 className="font-semibold text-base text-foreground mb-2">
      Recent Activity
    </h3>

    {items.map((item, i) => {
      // const Icon = item.icon;

      return (
        <div
          key={i}
          className="flex items-center gap-3 py-3 border-b border-border last:border-0"
        >
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground shrink-0">
            {item.taskType === "GRAMMAR" ? (
              <SpellCheck />
            ) : item.taskType === "READING" ? (
              <BookOpen />
            ) : item.taskType === "VOCABULARY" ? (
              <Languages />
            ) : (
              <FileText /> // Default icon
            )}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {item.taskTitle}
            </p>

            <span
              className={`text-xs font-semibold ${
                typeColor[item.taskType] ?? "text-muted-foreground"
              }`}
            >
              {item.taskType}
            </span>
          </div>

          <div className="text-right shrink-0">
            <p className="text-sm font-bold text-primary">
              +{item.xpEarned} XP
            </p>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(item.createdAt), {
                addSuffix: true,
              })}
            </p>
          </div>
        </div>
      );
    })}
  </div>
);
