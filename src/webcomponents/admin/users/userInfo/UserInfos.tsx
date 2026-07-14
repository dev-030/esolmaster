'use client';
import { useGetAdminUserInfoQuery } from "@/api/admin";
import { StudentData, TeacherData } from "./interface";
import { StudentDashboard } from "./StudentDashboard";
import { TeacherDashboard } from "./TeacherDashboard";
import { unknown } from "zod";


type DashboardData = StudentData | TeacherData;

export interface DashboardProps {
  data: DashboardData;
}

export const getInitials = (name: string) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};
export const UserInfo = ({ id }: { id: string }) => {
  const { data: userInfo, isLoading, error } = useGetAdminUserInfoQuery(id);
  if (userInfo?.role === 'student') {
    return <StudentDashboard data={userInfo as unknown as StudentData} />;
  } else if (userInfo?.role === 'teacher') {
    return <TeacherDashboard data={userInfo as unknown as TeacherData} />;
  }
};
