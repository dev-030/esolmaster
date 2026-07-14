import { getServerAuth } from "@/lib/server";
import { Onboarding } from "@/webcomponents/sameroute";
import { redirect } from "next/navigation";

export default async function OnboardingPage() {
  const auth = await getServerAuth();
  if (!auth) {
    redirect("/login");
  }
  const role = auth.role;

  return <Onboarding role={role as "teacher" | "student"} />;
}
