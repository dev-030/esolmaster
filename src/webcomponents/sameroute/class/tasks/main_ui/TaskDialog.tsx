"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TaskType } from "@/types/task"
import { toast } from "sonner"
import { ClassTaskWithClass } from "@/types/class"
import { Task } from "@/types/task"

const schema = z.object({
  title: z.string().min(2, "Title is required"),
  taskType: z.enum(["GRAMMAR", "READING", "VOCABULARY"]),
  description: z.string().optional(),
  dueDate: z.string().optional(),
})
type FormData = z.infer<typeof schema>
const genId = () => Math.random().toString(36).slice(2, 10)

interface Props {
  open: boolean; onOpenChange: (v: boolean) => void
  initial?: ClassTaskWithClass | null; onSave: (task: ClassTaskWithClass) => void
}

export const TaskDialog=({ open, onOpenChange, initial, onSave }: Props)=> {
  const isEdit = !!initial
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { title: "", taskType: "GRAMMAR",  dueDate: "", description: "" },
  })

  // useEffect(() => {
  //   if (open) reset({
  //     title: initial?.task?.title ?? "", taskType: (initial?.task?.type as TaskType) ?? "GRAMMAR",
  //     dueDate: initial?.scheduled?.dueAt ?? "",
  //   })
  // }, [open, initial])

  const taskType = watch("taskType")
  const onSubmit = (data: FormData) => {
    const nowIso = new Date().toISOString()
    const baseTask: { questionCount: number } & Task = {
      questionCount: initial?.task.questionCount ?? 0,
      id: initial?.task.id ?? genId(),
      title: data.title,
      type: data.taskType as unknown as TaskType,
      status: initial?.task.status ?? "DRAFT",
      isPublic: initial?.task.isPublic ?? false,
      createdById: initial?.task.createdById ?? "",
      createdAt: initial?.task.createdAt ?? nowIso,
      updatedAt: nowIso,
      createdBy: initial?.task.createdBy ?? { email: "" },
    }

    onSave({
      classTaskId: initial?.classTaskId ?? genId(),
      addedAt: initial?.addedAt ?? nowIso,
      task: baseTask,
      scheduled: data.dueDate
        ? { id: initial?.scheduled?.id ?? genId(), dueAt: data.dueDate, isActive: initial?.scheduled?.isActive }
        : (initial?.scheduled ?? null),
      class: initial?.class ?? { id: "", name: "" },
      totalStudents: initial?.totalStudents ?? 0,
      completedStudents: initial?.completedStudents ?? 0,
      completionRate: initial?.completionRate ?? 0,
      totalQuestions: initial?.totalQuestions ?? 0,
      answeredQuestions: initial?.answeredQuestions ?? 0,
      progressPercentage: initial?.progressPercentage ?? 0,
    })
    toast.success(isEdit ? "Task updated" : "Task created")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Task" : "Create New Task"}</DialogTitle>
          <DialogDescription>{isEdit ? "Update the task details." : "Create a new task for students."}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-1">
          <div className="space-y-1.5">
            <Label>Title</Label>
            <Input placeholder="e.g. Present Perfect Tense" {...register("title")} />
            {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Task Type</Label>
            <Select value={taskType} onValueChange={(v:unknown) => setValue("taskType", v as FormData["taskType"])}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="GRAMMAR">📝 Grammar</SelectItem>
                <SelectItem value="READING">📖 Reading</SelectItem>
                <SelectItem value="VOCABULARY">💬 Vocabulary</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Description (optional)</Label>
            <Textarea placeholder="Brief description…" rows={2} {...register("description")} />
          </div>
          <div className="space-y-1.5">
            <Label>Due Date (optional)</Label>
            <Input type="date" {...register("dueDate")} />
          </div>
          <div className="flex items-center justify-between rounded-lg border p-3.5">
            <div>
              <p className="text-sm font-medium">Published</p>
              <p className="text-xs text-muted-foreground mt-0.5">Students can see and attempt this task</p>
            </div>
            {/* <Switch checked={published} onCheckedChange={(v) => setValue("published", v)} /> */}
          </div>
          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit">{isEdit ? "Save Changes" : "Create Task"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}