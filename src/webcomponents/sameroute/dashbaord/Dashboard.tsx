"use client";

import { useRole } from "@/provider/RoleProvider";
import { AdminDashboard } from "@/webcomponents/admin";
import { StudentDashboard } from "@/webcomponents/student";
import { TeacherDashboard } from "@/webcomponents/teacher";

export const Dashboard = () => {
  const { role } = useRole();
  console.log("Dashboard Role:", role);
  // Prevent returning null during the initial localStorage check

  if (role === "student") return <StudentDashboard />;
  if (role === "teacher") return <TeacherDashboard />;
  if( role === "admin") return <AdminDashboard />; // Assuming admin has the same dashboard as teacher

  return null;
};
