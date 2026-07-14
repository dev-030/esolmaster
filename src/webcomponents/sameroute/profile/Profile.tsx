'use client';
import { useRole } from "@/provider/RoleProvider";
import { Profile as StudentProfile } from "@/webcomponents/student";

export const Profile = () => {
  const { role } = useRole();
  // Prevent returning null during the initial localStorage check
  if (role === "student") return <StudentProfile />;

 
};
