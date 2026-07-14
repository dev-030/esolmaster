"use client";

import { ReactNode } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useRole } from "@/provider/RoleProvider";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClassHeader } from "./ClassHeader";
import { Award, Check, Clipboard, Users } from "lucide-react";
import { StateCard } from "@/webcomponents/reusable";
import { useGetClassByIdQuery } from "@/api/class";
import { ClassDetails } from "@/types/class";

interface Props {
  children: ReactNode;
}

export default function ClassLayout({ children }: Props) {
  const { role } = useRole();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  const classId = params.classId as string;

  const { data: cls, isLoading } = useGetClassByIdQuery(classId);

  const isTeacher = role === "teacher" || role === "admin";

  const segments = pathname.split("/").filter(Boolean);

  // tab = students | tasks | settings
  const currentTab = segments[2];

  // detect nested pages like /tasks/taskId
  const isNestedPage = segments.length > 3;

  const stats = [
    { icon: Users, title: "Students", value: cls?.studentCount || 0 },
    { icon: Clipboard, title: "Tasks", value: cls?.taskCount || 0 },
    { icon: Check, title: "Submissions", value: 140 },
  ];

  return (
    <div className="space-y-6">
      {/* Top Class Header */}
      {!isNestedPage && (
        <>
          <ClassHeader classDetails={cls as ClassDetails} />

          {isTeacher && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {stats.map((item, index) => (
                <StateCard
                  key={index}
                  icon={item.icon}
                  title={item.title}
                  value={item.value}
                />
              ))}
            </div>
          )}

          {isTeacher && (
            <Tabs
              value={currentTab}
              onValueChange={(value) =>
                router.push(`/classes/${classId}/${value}`)
              }
            >
              <TabsList
                variant="line"
                className="border-b w-full justify-start"
              >
                <TabsTrigger value="students">Students</TabsTrigger>
                <TabsTrigger value="tasks">Tasks</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
            </Tabs>
          )}
        </>
      )}

      {/* Route Content */}
      <div>{children}</div>
    </div>
  );
}
