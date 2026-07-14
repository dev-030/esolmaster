import { Separator } from "@/components/ui/separator";
import { ActivityType, RecentActivity } from "@/types/admin";
import { Award, CheckCircle2, Clock, TrendingUp } from "lucide-react";

export interface Activity {
  id: number;
  title: string;
  timeAgo: string;
}

const getActivityIcon = (type: ActivityType) => {
  switch (type) {
    case "TASK_COMPLETED":
      return <CheckCircle2 size={16} className="text-green-500" />;
    case "LEVEL_UP":
      return <TrendingUp size={16} className="text-purple-500" />;
    case "BADGE_EARNED":
      return <Award size={16} className="text-amber-500" />;
    default:
      return <Clock size={16} className="text-gray-400" />;
  }
};

const getActivityBgColor = (type: ActivityType) => {
  switch (type) {
    case "TASK_COMPLETED":
      return "bg-green-50";
    case "LEVEL_UP":
      return "bg-purple-50";
    case "BADGE_EARNED":
      return "bg-amber-50";
    default:
      return "bg-gray-50";
  }
};

export const RecentActivityPanel = ({
  activities,
}: {
  activities: RecentActivity[];
}) => {
  console.log("RecentActivityPanel received activities:", activities);
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col gap-4 h-full">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Clock size={18} className="text-gray-400" />
        <h3 className="text-base font-semibold text-gray-800">
          Recent Activity
        </h3>
      </div>

      <Separator />

      {/* Activity list */}
      <div className="flex flex-col gap-4 flex-1">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3">
          
            <div
              className={`p-2 rounded-lg ${getActivityBgColor(activity.type)} flex-shrink-0`}
            >
              {getActivityIcon(activity.type)}
            </div>

            <div className="flex-1 flex flex-col gap-0.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-semibold text-gray-800">
                  {activity.name}
                </span>
                {activity.xpEarned > 0 && (
                  <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                    +{activity.xpEarned} XP
                  </span>
                )}
              </div>
              <span className="text-sm text-gray-600 leading-snug">
                {activity.message}
              </span>
              <span className="text-xs text-gray-400 capitalize">
                {activity.type.toLowerCase().replace("_", " ")}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
