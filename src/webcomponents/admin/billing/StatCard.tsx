import { Card, CardContent } from "@/components/ui/card";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

export const StatCard = ({
  label,
  value,
  sub,
  trend,
  trendUp,
}: {
  label: string;
  value: string | number;
  sub: string;
  trend?: string;
  trendUp?: boolean;
}) => (
  <Card>
    <CardContent className="p-5 space-y-2">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="text-3xl font-bold tracking-tight">{value}</p>
      <div className="flex items-center gap-2">
        {trend && (
          <span className={`flex items-center gap-0.5 text-xs font-semibold ${trendUp ? "text-emerald-600" : "text-red-500"}`}>
            {trendUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {trend}
          </span>
        )}
        <span className="text-xs text-muted-foreground">{sub}</span>
      </div>
    </CardContent>
  </Card>
);
