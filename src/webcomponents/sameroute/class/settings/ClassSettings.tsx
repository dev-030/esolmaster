/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertTriangle,
  CalendarClock,
  ClipboardList,
  Loader2,
  Pencil,
  Plus,
  Settings,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { DeleteDialog } from "../dialogs";
import { toast } from "sonner";
import { InfoRow } from "./InfoRow";
import {
  useGetClassByIdQuery,
  useScheduleClassTaskMutation,
} from "@/api/class";
import { ClassDetails } from "@/types/class";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ScheduledTask {
  id: string;
  taskName: string; // This is actually the classTaskId (from classTasks array)
  startTime: string; // datetime-local string
  endTime: string; // This will be sent as dueAt to the backend
}
const emptyRow = (): ScheduledTask => ({
  id: Math.random().toString(36).slice(2, 8),
  taskName: "",
  startTime: "",
  endTime: "",
});

// ─── Scheduled Tasks Section ──────────────────────────────────────────────────

// ─── Scheduled Tasks Section ──────────────────────────────────────────────────

// ─── Scheduled Tasks Section ──────────────────────────────────────────────────

const ScheduledTasksSection = ({
  classDetails,
}: {
  classDetails: ClassDetails;
}) => {
  const [rows, setRows] = useState<ScheduledTask[]>([emptyRow()]);
  const [isSaving, setIsSaving] = useState(false);
  const {mutateAsync:scheduleClassTaskMutation} = useScheduleClassTaskMutation(
    classDetails?.id,
  );

  // Get available tasks (not yet scheduled - where scheduled is null)
  const availableTasks = classDetails?.classTasks?.filter(
    ct => ct.scheduled === null
  ) || [];

  const updateRow = (id: string, patch: Partial<ScheduledTask>) =>
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  const addRow = () => {
    if (rows.length >= availableTasks.length) {
      toast.error("No more tasks available to schedule");
      return;
    }
    setRows((prev) => [...prev, emptyRow()]);
  };

  const removeRow = (id: string) =>
    setRows((prev) => prev.filter((r) => r.id !== id));

  const validateRows = (): boolean => {
    // Check if any row is incomplete
    const incomplete = rows.some(
      (r) => !r.taskName || !r.startTime || !r.endTime,
    );
    if (incomplete) {
      toast.error("Please complete all task fields before saving.");
      return false;
    }

    // Check for duplicate tasks
    const taskNames = rows.map(r => r.taskName);
    const hasDuplicates = taskNames.some((name, index) => taskNames.indexOf(name) !== index);
    if (hasDuplicates) {
      toast.error("Cannot schedule the same task multiple times.");
      return false;
    }

    // Validate end time > start time for each row
    const badTime = rows.find((r) => new Date(r.endTime) <= new Date(r.startTime));
    if (badTime) {
      toast.error("End time must be after start time.");
      return false;
    }

    // Validate that tasks are from available tasks
    const invalidTask = rows.find(r => !availableTasks.some(t => t.classTaskId === r.taskName));
    if (invalidTask) {
      toast.error("One or more selected tasks are not available.");
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateRows()) return;

    setIsSaving(true);
    
    try {
      // Schedule each task sequentially
      const schedulePromises = rows.map(async (row) => {
        const payload = {
          classTaskId: row.taskName, // This is the classTaskId
          dueAt: row.endTime, // Using endTime as due date
          isActive: true,
        };
        
        return await scheduleClassTaskMutation(payload);
      });

      await Promise.all(schedulePromises);
      
      toast.success(`${rows.length} task(s) scheduled successfully.`);
      
      // Reset form after successful save
      setRows([emptyRow()]);
      
      // Refetch class details to update the UI
      // You can trigger a refetch here if you have a refetch function
      // For example: refetch();
      
    } catch (error: any) {
      console.error("Schedule error:", error);
      toast.error(error?.response?.data?.message || "Failed to schedule tasks");
    } finally {
      setIsSaving(false);
    }
  };

  // Format datetime-local for display
  const formatDateTimeLocal = (date: Date) => {
    return date.toISOString().slice(0, 16);
  };

  // Set minimum datetime to now
  const getMinDateTime = () => {
    return formatDateTimeLocal(new Date());
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2">
            <CalendarClock className="w-4 h-4 text-muted-foreground" />
            <div>
              <CardTitle className="text-base">Schedule Tasks</CardTitle>
              <CardDescription className="mt-1">
                Assign tasks with start and end times for this class.
              </CardDescription>
            </div>
          </div>
          <Button 
            size="sm" 
            onClick={handleSave} 
            className="shrink-0"
            disabled={isSaving || rows.some(r => !r.taskName) || availableTasks.length === 0}
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Schedule'
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {rows.map((row, idx) => {
          // Get used task names from other rows
          const usedTaskNames = rows
            .filter(r => r.id !== row.id)
            .map(r => r.taskName)
            .filter(Boolean);
          
          return (
            <div
              key={row.id}
              className="relative grid grid-cols-[1fr_1fr_1fr_auto] gap-3 items-end p-4 rounded-xl border border-border bg-muted/30"
            >
              <span className="absolute -top-2.5 left-3 text-[10px] font-semibold text-muted-foreground bg-background border border-border rounded-full px-2 py-0.5">
                Task {idx + 1}
              </span>

              <div className="space-y-1.5">
                <Label className="text-xs">Task</Label>
                <Select
                  value={row.taskName}
                  onValueChange={(val) =>
                    updateRow(row.id, { taskName: val || "" })
                  }
                >
                  <SelectTrigger className="text-sm h-9 w-full">
                    <SelectValue placeholder="Select a task…" />
                  </SelectTrigger>
                  <SelectContent className="max-h-52 w-full">
                    {availableTasks
                      .filter(t => !usedTaskNames.includes(t.classTaskId))
                      .map((ct) => (
                        <SelectItem
                          key={ct.classTaskId}
                          value={ct.classTaskId}
                          className="text-sm"
                        >
                          {ct?.task?.title}
                        </SelectItem>
                      ))}
                    {availableTasks.length === 0 && (
                      <div className="px-3 py-2 text-xs text-muted-foreground">
                        No tasks available
                      </div>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Start Time</Label>
                <Input
                  type="datetime-local"
                  className="h-9 text-sm"
                  value={row.startTime}
                  min={getMinDateTime()}
                  onChange={(e) =>
                    updateRow(row.id, { startTime: e.target.value })
                  }
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Due Date</Label>
                <Input
                  type="datetime-local"
                  className="h-9 text-sm"
                  value={row.endTime}
                  min={row.startTime || getMinDateTime()}
                  onChange={(e) =>
                    updateRow(row.id, { endTime: e.target.value })
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Students must submit by this time
                </p>
              </div>

              <button
                type="button"
                onClick={() => removeRow(row.id)}
                disabled={rows.length === 1}
                className="h-9 w-9 flex items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-destructive hover:border-destructive hover:bg-destructive/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                title="Remove task"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}

        {availableTasks.length > rows.length && (
          <button
            type="button"
            onClick={addRow}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-border text-sm font-medium text-muted-foreground hover:text-primary hover:border-primary hover:bg-primary/5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
            Add Another Task
          </button>
        )}

        {availableTasks.length === 0 && (
          <div className="text-center py-6 text-muted-foreground">
            <ClipboardList className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No tasks available to schedule</p>
            <p className="text-xs mt-1">All tasks have already been scheduled</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// ─── ClassSettings ────────────────────────────────────────────────────────────

export const ClassSettings = () => {
  const { classId } = useParams<{ classId: string }>();
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { data: cls } = useGetClassByIdQuery(classId);

  if (!cls) {
    return (
      <div className="flex items-center justify-center py-24 text-muted-foreground text-sm">
        Class not found.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center gap-2">
        <Settings className="w-5 h-5 text-muted-foreground" />
        <h1 className="text-2xl font-bold text-foreground">Class Settings</h1>
      </div>

      {/* Class Info Card */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-base">Class Information</CardTitle>
              <CardDescription className="mt-1">
                Name, subject, and description shown to students.
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 shrink-0"
              onClick={() => setEditOpen(true)}
            >
              <Pencil className="w-3.5 h-3.5" />
              Edit
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Color + Name */}
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-sm"
              style={{ backgroundColor: cls.color }}
            >
              {cls.name[0]}
            </div>
            <div>
              <p className="font-semibold text-foreground">{cls.name}</p>
              <p className="text-sm text-muted-foreground">{cls.subject}</p>
            </div>
          </div>

          <Separator />

          {/* Details grid */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <InfoRow label="Subject" value={cls.subject} />
            <InfoRow label="Teacher" value={cls.teacherName} />
            <InfoRow
              label="Max Students"
              value={cls.maxStudents ? String(cls.maxStudents) : "—"}
            />
            <InfoRow
              label="Description"
              value={cls.description || "—"}
              className="col-span-2"
            />
            <InfoRow
              label="Created"
              value={new Date(cls.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            />
            <InfoRow label="Class ID" value={cls.id} mono />
          </div>

          <Separator />

          {/* Stats */}
          <div className="flex gap-6 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="w-4 h-4" />
              <span>{cls.studentCount} students enrolled</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <ClipboardList className="w-4 h-4" />
              <span>{cls.taskCount} tasks</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scheduled Tasks */}
      <ScheduledTasksSection classDetails={cls} />

      {/* Danger Zone */}
      <Card className="border-destructive/40">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-destructive" />
            <CardTitle className="text-base text-destructive">
              Danger Zone
            </CardTitle>
          </div>
          <CardDescription>
            Irreversible actions that affect your class and students.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-start justify-between gap-4 p-4 rounded-lg border border-destructive/20 bg-destructive/5">
            <div>
              <p className="text-sm font-semibold text-foreground">
                Delete this class
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Permanently removes the class, all tasks, and student
                enrollment. This cannot be undone.
              </p>
            </div>
            <Button
              variant="destructive"
              size="sm"
              className="gap-1.5 shrink-0"
              onClick={() => setDeleteOpen(true)}
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete Class
            </Button>
          </div>
        </CardContent>
      </Card>

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={`Delete "${cls.name}"?`}
        description="This will permanently remove the class, all tasks, and all student data. This action cannot be undone."
        onConfirm={() => {
          toast.success("Class deleted");
          router.push("/classes");
        }}
      />
    </div>
  );
};
