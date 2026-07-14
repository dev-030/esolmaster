import AssignTaskLayout from "@/webcomponents/teacher/assign-task/AssignTask";

export default function AssignTaskMainLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return <AssignTaskLayout>{children}</AssignTaskLayout>;
}
