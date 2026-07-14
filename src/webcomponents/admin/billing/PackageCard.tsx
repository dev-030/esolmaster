import { Shield, Star, Zap, Pencil, Crown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AdminPlan } from "@/types/payment";

export type BillingPackage = AdminPlan;

const PLAN_ICONS: Record<string, React.ElementType> = {
  FREE: Shield,
  BASIC: Star,
  PRO: Zap,
};

const formatPrice = (value: number) =>
  (value / 100).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export const PackageCard = ({
  pkg,
  onEdit,
  onManagePremiumTasks,
}: {
  pkg: BillingPackage;
  onEdit?: () => void;
  onManagePremiumTasks?: () => void;
}) => {
  const Icon = PLAN_ICONS[pkg.type] ?? Star;
  const premiumCount = pkg.premiumTasks?.length ?? 0;

  return (
    <Card className="overflow-hidden group hover:shadow-md transition-shadow">
      <CardContent className="p-5 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-muted">
              <Icon className="h-4 w-4 text-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">{pkg.name}</h3>
              <p className="text-xs text-muted-foreground">{pkg.type} plan</p>
            </div>
          </div>
          {onEdit && (
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={onEdit}
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>

        <div>
          <span className="text-2xl font-bold">${formatPrice(pkg.monthlyPrice)}</span>
          <span className="text-xs text-muted-foreground ml-1">/mo</span>
          <span className="text-xs text-muted-foreground ml-2">· ${formatPrice(pkg.annualPrice)}/yr</span>
        </div>

        <Separator />

        <ul className="space-y-1.5">
          <li className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="w-1.5 h-1.5 rounded-full shrink-0 bg-foreground/50" />
            Up to {pkg.maxClasses} classes
          </li>
          <li className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="w-1.5 h-1.5 rounded-full shrink-0 bg-foreground/50" />
            {pkg.maxStudentsPerClass} students per class
          </li>
          <li className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="w-1.5 h-1.5 rounded-full shrink-0 bg-foreground/50" />
            {pkg.maxScheduledTasksInClass} scheduled tasks per class
          </li>
        </ul>

        <div className="flex items-center justify-between pt-1">
          <Badge variant={pkg.isActive ? "default" : "secondary"}>
            {pkg.isActive ? "Active" : "Inactive"}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {pkg._count?.subscriptions ?? 0} subscriber
            {pkg._count?.subscriptions === 1 ? "" : "s"}
          </span>
        </div>

        {onManagePremiumTasks && pkg.type !== "FREE" && (
          <Button
            size="sm"
            variant="outline"
            className="w-full gap-1.5"
            onClick={onManagePremiumTasks}
          >
            <Crown className="h-3.5 w-3.5 text-amber-500" />
            Premium Tasks
            {premiumCount > 0 && (
              <Badge variant="secondary" className="text-[10px] ml-auto">
                {premiumCount}
              </Badge>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
