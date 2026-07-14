"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import { Class, CreateClassPayload } from "@/types/class";
import { useGetTasks } from "@/api/task";

// ─── Demo tasks ───────────────────────────────────────────────────────────────

// ─── Schema ───────────────────────────────────────────────────────────────────

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  subject: z.string().min(1, "Subject is required"),
  description: z.string().optional(),
  color: z.string(),
  maxStudents: z
    .number({ invalid_type_error: "Must be a number" })
    .int()
    .min(1, "At least 1 student")
    .max(500, "Maximum 500 students"),
  tasks: z.array(z.string()).min(1, "Select at least one task"),
});

export type ClassFormData = z.infer<typeof schema>;

const COLOR_OPTIONS = [
  "#2F7EDA",
  "#f59e0b",
  "#10b981",
  "#8b5cf6",
  "#ef4444",
  "#06b6d4",
];

// ─── Props ────────────────────────────────────────────────────────────────────

interface ClassDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initial?: Class | null;
  onSave: (cls: CreateClassPayload) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const ClassDialog = ({
  open,
  onOpenChange,
  initial,
  onSave,
}: ClassDialogProps) => {
  const isEdit = !!initial;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<ClassFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      subject: "",
      description: "",
      color: "#2F7EDA",
      tasks: [],
    },
  });
  const { data: tasks } = useGetTasks({
    page: 1,
    limit: 1000,
    status: "APPROVED",
  });

  useEffect(() => {
    if (open) {
      reset({
        name: initial?.name ?? "",
        subject: initial?.subject ?? "",
        description: initial?.description ?? "",
        color: initial?.color ?? "#2F7EDA",
        maxStudents: initial?.maxStudents ?? 30,
        tasks: initial?.classTasks?.map((ct) => ct.task?.id) ?? [],
      });
    }
  }, [open, initial, reset]);

  const selectedColor = watch("color");
  const selectedTasks = watch("tasks") ?? [];

  const allTasks = tasks?.data ?? [];

  const availableTasks = allTasks.filter((t) => !selectedTasks.includes(t.id));

  const addTask = (taskId: string) => {
    if (!selectedTasks.includes(taskId)) {
      setValue("tasks", [...selectedTasks, taskId], { shouldValidate: true });
    }
  };

  const removeTask = (taskId: string) => {
    setValue(
      "tasks",
      selectedTasks.filter((t) => t !== taskId),
      { shouldValidate: true },
    );
  };

  const onSubmit = (data: ClassFormData) => {
    const cls: CreateClassPayload = {
      name: data.name,
      subject: data.subject,
      description: data.description,
      color: data.color,
      taskIds: data.tasks, // Assuming tasks are identified by their names for this example
    };
    console.log(cls, "Classes From Class Dialog");
    onSave(cls);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Class" : "Create New Class"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the class details below."
              : "Fill in the details to create a new class."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-1">
          {/* Name */}
          <div className="space-y-1.5">
            <Label htmlFor="name">Class Name</Label>
            <Input
              id="name"
              placeholder="e.g. Intermediate English B2"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Subject + Max Students — side by side */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                placeholder="e.g. English"
                {...register("subject")}
              />
              {errors.subject && (
                <p className="text-xs text-destructive">
                  {errors.subject.message}
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              placeholder="Brief description of the class..."
              rows={2}
              {...register("description")}
            />
          </div>

          {/* Tasks multi-select */}
          <div className="space-y-2">
            <Label>Tasks</Label>

            {/* Selected task badges */}
            {selectedTasks.length > 0 && (
              <div className="flex flex-wrap gap-1.5 p-2.5 rounded-lg bg-muted/50 border border-border">
                {selectedTasks.map((taskId) => {
                  const task = allTasks.find((t) => t.id === taskId);
                  return (
                    <Badge
                      key={taskId}
                      variant="secondary"
                      className="gap-1.5 pr-1.5 text-xs font-normal"
                    >
                      <span className="max-w-50 truncate">
                        {task?.title ?? taskId}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeTask(taskId)}
                        className="ml-0.5 rounded-full hover:bg-muted transition-colors p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  );
                })}
              </div>
            )}

            {/* Dropdown to add tasks */}
            <Controller
              control={control}
              name="tasks"
              render={() => (
                <Select
                  value=""
                  onValueChange={(val) => {
                    if (val) addTask(val);
                  }}
                  disabled={availableTasks.length === 0}
                >
                  <SelectTrigger className="text-sm text-muted-foreground w-full">
                    <SelectValue
                      placeholder={
                        availableTasks.length === 0
                          ? "All tasks selected"
                          : "Select a task to add…"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent className="max-h-52">
                    {availableTasks?.map((task) => (
                      <SelectItem
                        key={task.id}
                        value={task.id}
                        className="text-sm"
                      >
                        {task.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />

            {errors.tasks && (
              <p className="text-xs text-destructive">{errors.tasks.message}</p>
            )}
          </div>

          {/* Color picker */}
          <div className="space-y-2">
            <Label>Class Color</Label>
            <div className="flex gap-2">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setValue("color", c)}
                  className="w-7 h-7 rounded-full transition-transform hover:scale-110 ring-offset-2"
                  style={{
                    backgroundColor: c,
                    outline: selectedColor === c ? `2px solid ${c}` : "none",
                  }}
                />
              ))}
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {isEdit ? "Save Changes" : "Create Class"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
