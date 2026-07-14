import ClassLayout from "@/webcomponents/sameroute/class/layout/ClassLayout";

export default function ClassMainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClassLayout>{children}</ClassLayout>;
}
