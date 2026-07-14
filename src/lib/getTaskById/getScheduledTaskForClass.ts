import { cookies } from "next/headers";

export const getScheduledTaskForClass = async (classId: string, scheduledTaskId: string) => {
  // 1️⃣ Get cookies from request
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  // 2️⃣ Call API with Authorization header (recommended)
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/classes/${classId}/scheduled-tasks/${scheduledTaskId}/analytics`,
    {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${accessToken}`, // ✅ use this instead of Cookie
      },
    },
  );

  if (!res.ok) {
    const errorText = await res.text();
    console.error("API ERROR:", errorText);
    throw new Error(`Failed to fetch scheduled task analytics for class: ${res.status}`);
  }

  return res.json();
};
