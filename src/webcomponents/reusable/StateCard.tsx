import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StateCardProps {
  title: string;
  icon: LucideIcon;
  value: string | number;
}

export const StateCard = ({ title, icon: Icon, value }: StateCardProps) => {
  return (
    <Card className="rounded-lg shadow-sm">
      <CardContent className="px-5 py-4 space-y-1">
        {/* Icon + Title */}
        <div className="flex items-center gap-2 text-gray-400">
          <Icon className="w-4 h-4" />
          <span className="text-sm">{title}</span>
        </div>

        {/* Value */}
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </CardContent>
    </Card>
  );
};
