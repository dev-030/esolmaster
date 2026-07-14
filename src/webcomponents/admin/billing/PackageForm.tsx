"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Save } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useCreatePlanMutation, useUpdatePlanMutation } from "@/api/payment";
import { AdminPlan } from "@/types/payment";

type PlanType = "FREE" | "BASIC" | "PRO";

interface FormState {
  name: string;
  type: PlanType;
  description: string;
  monthlyPrice: string; // dollars, as typed
  annualPrice: string; // dollars, as typed
  maxClasses: string;
  maxStudentsPerClass: string;
  maxScheduledTasksInClass: string;
  isActive: boolean;
}

const toFormState = (pkg?: AdminPlan | null): FormState =>
  pkg
    ? {
        name: pkg.name,
        type: pkg.type as PlanType,
        description: "",
        monthlyPrice: (pkg.monthlyPrice / 100).toFixed(2),
        annualPrice: (pkg.annualPrice / 100).toFixed(2),
        maxClasses: String(pkg.maxClasses),
        maxStudentsPerClass: String(pkg.maxStudentsPerClass),
        maxScheduledTasksInClass: String(pkg.maxScheduledTasksInClass),
        isActive: pkg.isActive,
      }
    : {
        name: "",
        type: "BASIC",
        description: "",
        monthlyPrice: "",
        annualPrice: "",
        maxClasses: "10",
        maxStudentsPerClass: "30",
        maxScheduledTasksInClass: "10",
        isActive: true,
      };

export const PackageDialog = ({
  pkg,
  open,
  onClose,
}: {
  pkg: AdminPlan | null;
  open: boolean;
  onClose: () => void;
}) => {
  const isNew = !pkg?.id;
  const [form, setForm] = useState<FormState>(() => toFormState(pkg));

  const { mutateAsync: createPlan, isPending: creating } = useCreatePlanMutation();
  const { mutateAsync: updatePlan, isPending: updating } = useUpdatePlanMutation();
  const isPending = creating || updating;

  const setField = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleOpenChange = (o: boolean) => {
    if (!o) onClose();
  };

  const handleSave = async () => {
    const toCents = (v: string) => Math.round(parseFloat(v || "0") * 100);

    if (!form.name.trim()) {
      toast.error("Package name is required");
      return;
    }

    try {
      if (isNew) {
        await createPlan({
          name: form.name,
          type: form.type,
          description: form.description || undefined,
          monthlyPrice: toCents(form.monthlyPrice),
          annualPrice: toCents(form.annualPrice),
          maxClasses: Number(form.maxClasses) || 0,
          maxStudentsPerClass: Number(form.maxStudentsPerClass) || 0,
          maxScheduledTasksInClass: Number(form.maxScheduledTasksInClass) || 0,
        });
        toast.success("Package created and synced to Stripe");
      } else if (pkg) {
        await updatePlan({
          planId: pkg.id,
          body: {
            name: form.name,
            description: form.description || undefined,
            monthlyPrice: toCents(form.monthlyPrice),
            annualPrice: toCents(form.annualPrice),
            maxClasses: Number(form.maxClasses) || 0,
            maxStudentsPerClass: Number(form.maxStudentsPerClass) || 0,
            maxScheduledTasksInClass: Number(form.maxScheduledTasksInClass) || 0,
            isActive: form.isActive,
          },
        });
        toast.success("Package updated and synced to Stripe");
      }
      onClose();
    } catch {
      toast.error("Failed to save package");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isNew ? "New Package" : `Edit · ${pkg?.name}`}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2 max-h-[65vh] overflow-y-auto pr-1">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Plan Name</Label>
              <Input
                value={form.name}
                onChange={(e) => setField("name", e.target.value)}
                placeholder="e.g. Pro"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Plan Type</Label>
              <Select
                value={form.type}
                onValueChange={(v) => setField("type", v as PlanType)}
                disabled={!isNew}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FREE">Free</SelectItem>
                  <SelectItem value="BASIC">Basic</SelectItem>
                  <SelectItem value="PRO">Pro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Description</Label>
            <Input
              value={form.description}
              onChange={(e) => setField("description", e.target.value)}
              placeholder="Shown on the Stripe product (optional)"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Monthly Price ($)</Label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={form.monthlyPrice}
                onChange={(e) => setField("monthlyPrice", e.target.value)}
                placeholder="19.99"
                disabled={form.type === "FREE"}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Annual Price ($)</Label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={form.annualPrice}
                onChange={(e) => setField("annualPrice", e.target.value)}
                placeholder="199.99"
                disabled={form.type === "FREE"}
              />
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Max Classes</Label>
              <Input
                type="number"
                min="0"
                value={form.maxClasses}
                onChange={(e) => setField("maxClasses", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Students / Class</Label>
              <Input
                type="number"
                min="0"
                value={form.maxStudentsPerClass}
                onChange={(e) => setField("maxStudentsPerClass", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Tasks / Class</Label>
              <Input
                type="number"
                min="0"
                value={form.maxScheduledTasksInClass}
                onChange={(e) => setField("maxScheduledTasksInClass", e.target.value)}
              />
            </div>
          </div>

          {!isNew && (
            <div className="flex items-center gap-3 pt-1">
              <Switch
                checked={form.isActive}
                onCheckedChange={(v) => setField("isActive", v)}
              />
              <Label className="cursor-pointer">
                {form.isActive ? "Active" : "Inactive"}
              </Label>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isPending} className="gap-2">
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {isNew ? "Create Package" : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
