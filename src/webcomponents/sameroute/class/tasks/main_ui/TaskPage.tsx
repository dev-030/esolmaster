"use client";
import { Button } from "@/components/ui/button";
import { useRole } from "@/provider/RoleProvider";
import { ClipboardList, Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { TaskRow } from "./TaskRow";
import { useGetScheduledTasksForClassQuery } from "@/api/class";

export const TaskMainPage = () => {
  const { classId } = useParams<{ classId: string }>();
  const { role } = useRole();
  const router = useRouter();
  const { data: scheduledTasks, isLoading } =
    useGetScheduledTasksForClassQuery(classId);

  const isTeacher = role === "teacher" || role === "admin";

  return (
    <div className="space-y-6 ">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Tasks</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {scheduledTasks?.length ?? 0} ·{" "}
            {scheduledTasks?.length !== 1 ? "tasks" : "task"}
          </p>
        </div>
      </div>

      {/* Task list */}
      {scheduledTasks?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
            <ClipboardList className="w-8 h-8 text-muted-foreground" />
          </div>
          <div>
            <p className="font-semibold text-foreground">No tasks yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              {isTeacher
                ? "Create your first task to assign to students."
                : "No tasks have been assigned yet."}
            </p>
          </div>
          {isTeacher && (
            <Button
              className="gap-2"
              onClick={() => router.push(`/assign-task/grammar`)}
            >
              <Plus className="w-4 h-4" /> Create Task
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {scheduledTasks?.map((task) => (
            <TaskRow
              key={task.classTaskId}
              task={task}
              classId={classId}
              isTeacher={isTeacher}
              // onEdit={() => setTaskDialog({ open: true, initial: {...task, classTaskId: task.classTaskId} })}
              // onDelete={() =>
              //   setDeleteDialog({ open: true, id: task.classTaskId, title: task.task.title })
              // }
            />
          ))}
        </div>
      )}

      {/* Dialogs */}
      {/* <TaskDialog
        open={taskDialog.open}
        onOpenChange={(v) => setTaskDialog((s) => ({ ...s, open: v }))}
        initial={taskDialog.initial}
        onSave={(task) => {
          if (taskDialog.initial) updateTask(task.id, task);
          else addTask(task);
        }}
      /> */}

      {/* <DeleteDialog
        open={deleteDialog.open}
        onOpenChange={(v) => setDeleteDialog((s) => ({ ...s, open: v }))}
        title={`Delete "${deleteDialog.title}"?`}
        description="This will permanently remove the task and all its questions."
        onConfirm={() => {
          if (deleteDialog.id) {
            toast.success("Task deleted");
          }
        }}
      /> */}
    </div>
  );
};
