import { getServerAuth } from "@/lib/server";
import { AdminBadge } from "@/webcomponents/admin";
import { Badges } from "@/webcomponents/student";

export default async function BadgesPage() {
  const auth = await getServerAuth();
  const role = auth?.role;

  if (role === "student") {
    return <Badges />;
  }
  if (role === "admin") {
    return <AdminBadge />;
  }
}
