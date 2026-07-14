import { redirect } from "next/navigation";

const FIRST_QUESTION: Record<string, string> = {
  grammar: "mcq",
  reading: "mcq",
  vocabulary: "mcq",
};

export default async function TaskTypePage({
  params,
}: {
  params: Promise<{ taskId: string; taskType: string }>;
}) {
  const { taskId, taskType } = await params;
  
  const subType = FIRST_QUESTION[taskType as keyof typeof FIRST_QUESTION] || "mcq";

  // This redirects /my-task/123/vocabulary -> /my-task/123/vocabulary/mcq
  redirect(`/my-task/${taskId}/${taskType}/${subType}`);
}