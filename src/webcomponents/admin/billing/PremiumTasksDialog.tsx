"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Crown, X } from "lucide-react";
import { toast } from "sonner";
import {
  useAttachPremiumTasksMutation,
  useDetachPremiumTaskMutation,
  useGetPlanPremiumTasksQuery,
} from "@/api/payment";
import { useGetTasks } from "@/api/task";
import { AdminPlan, PlanPremiumTaskLink } from "@/types/payment";
import { Task } from "@/types/task";

export const PremiumTasksDialog = ({
  pkg,
  open,
  onClose,
}: {
  pkg: AdminPlan | null;
  open: boolean;
  onClose: () => void;
}) => {
  const planId = pkg?.id ?? "";
  const { data: attached, isLoading: loadingAttached } =
    useGetPlanPremiumTasksQuery(planId);
  const { data: premiumTasksPage, isLoading: loadingPremium } = useGetTasks({
    isPremium: true,
    limit: 50,
  });

  const { mutateAsync: attachTasks, isPending: attaching } =
    useAttachPremiumTasksMutation();
  const { mutateAsync: detachTask, isPending: detaching } =
    useDetachPremiumTaskMutation();

  const [selected, setSelected] = useState<string[]>([]);

  const attachedIds = new Set(
    (attached ?? []).map((a: PlanPremiumTaskLink) => a.taskId),
  );
  const availableTasks = (premiumTasksPage?.data ?? []).filter(
    (t: Task) => !attachedIds.has(t.id),
  );

  const toggleSelected = (taskId: string) => {
    setSelected((prev) =>
      prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId],
    );
  };

  const handleAttach = async () => {
    if (!selected.length) return;
    try {
      await attachTasks({ planId, taskIds: selected });
      toast.success("Premium tasks added to package");
      setSelected([]);
    } catch {
      toast.error("Failed to attach tasks");
    }
  };

  const handleDetach = async (taskId: string) => {
    try {
      await detachTask({ planId, taskId });
      toast.success("Task removed from package");
    } catch {
      toast.error("Failed to remove task");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Crown className="h-4 w-4 text-amber-500" />
            Premium Tasks · {pkg?.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 max-h-[65vh] overflow-y-auto pr-1">
          {/* Attached tasks */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Included in this package
            </p>
            {loadingAttached && (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            )}
            {!loadingAttached && (attached ?? []).length === 0 && (
              <p className="text-sm text-muted-foreground italic">
                No premium tasks attached yet.
              </p>
            )}
            <div className="space-y-1.5">
              {(attached ?? []).map((link: PlanPremiumTaskLink) => (
                <div
                  key={link.id}
                  className="flex items-center justify-between rounded-md border px-3 py-2 text-sm"
                >
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-[10px]">
                      {link.task.type}
                    </Badge>
                    <span>{link.task.title}</span>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6 text-muted-foreground hover:text-destructive"
                    disabled={detaching}
                    onClick={() => handleDetach(link.taskId)}
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Available premium tasks */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Available premium tasks
            </p>
            {loadingPremium && (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            )}
            {!loadingPremium && availableTasks.length === 0 && (
              <p className="text-sm text-muted-foreground italic">
                No unattached premium tasks. Mark a task as premium when
                creating it (admin only) to see it here.
              </p>
            )}
            <div className="space-y-1.5">
              {availableTasks.map((t: Task) => (
                <label
                  key={t.id}
                  className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm cursor-pointer hover:bg-muted/50"
                >
                  <Checkbox
                    checked={selected.includes(t.id)}
                    onCheckedChange={() => toggleSelected(t.id)}
                  />
                  <Badge variant="secondary" className="text-[10px]">
                    {t.type}
                  </Badge>
                  <span>{t.title}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button
            onClick={handleAttach}
            disabled={!selected.length || attaching}
            className="gap-2"
          >
            {attaching && <Loader2 className="h-4 w-4 animate-spin" />}
            Add {selected.length > 0 ? `${selected.length} ` : ""}to Package
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
