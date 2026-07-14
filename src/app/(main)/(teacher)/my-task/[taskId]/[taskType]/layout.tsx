import { getTaskById } from "@/lib/getTaskById";
import TaskTypeClientLayout from "@/webcomponents/layouts/TaskTypeLayOutClient";

export default async function TaskTypeLayout({ children, params }: { children: React.ReactNode; params: Promise<{ taskId: string; taskType: string }> }) {
  const resolvedParams = await params;
  const task = await getTaskById(resolvedParams.taskId);

    return <TaskTypeClientLayout initialTask={task}>{children}</TaskTypeClientLayout>
}