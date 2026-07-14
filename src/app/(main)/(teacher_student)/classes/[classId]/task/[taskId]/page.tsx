import { getScheduledTaskForClass } from "@/lib/getTaskById";
import { getServerAuth } from "@/lib/server";
import { TaskRunner } from "@/webcomponents/sameroute";
import { redirect } from "next/navigation";

type QuestionType =
  | "MCQ"
  | "GAP_FILL"
  | "MATCHING"
  | "QUESTION_ANSWER"
  | "WORD_BOX_MATCH";

const QUESTION_TYPE_ROUTES: Record<QuestionType, string> = {
  MCQ: "mcq",
  GAP_FILL: "gap-fill",
  MATCHING: "matching",
  QUESTION_ANSWER: "question-answer",
  WORD_BOX_MATCH: "word-box-match",
};

interface PageProps {
  params: Promise<{
    classId: string;
    taskId: string;
  }>;
}

export default async function TaskRunnerPage({ params }: PageProps) {
  const { classId, taskId } = await params;

  const auth = await getServerAuth();
  if (!auth) redirect("/login");

  if (auth.role === "student") {
    return <TaskRunner />;
  }

  const scheduledTask = await getScheduledTaskForClass(classId, taskId);

  const firstQuestion = scheduledTask.questions?.[0];

  if (!firstQuestion) {
    return <div>No questions found for this task.</div>;
  }

  const firstRoute =
    QUESTION_TYPE_ROUTES[firstQuestion.type as QuestionType] ?? "mcq";

  redirect(`/classes/${classId}/task/${taskId}/${firstRoute}`);
}
