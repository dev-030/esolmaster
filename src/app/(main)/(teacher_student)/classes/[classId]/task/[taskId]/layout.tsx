// app/(main)/(teacher_student)/classes/[classId]/task/[taskId]/layout.tsx

import { getScheduledTaskForClass } from "@/lib/getTaskById";
import { getServerAuth } from "@/lib/server";
import Link from "next/link";
import { redirect } from "next/navigation";

type QuestionType =
  | "MCQ"
  | "GAP_FILL"
  | "MATCHING"
  | "QUESTION_ANSWER"
  | "WORD_BOX_MATCH";

type ScheduledTaskQuestion = {
  questionId: string;
  type: QuestionType;
  config: unknown;
  order: number;
  totalAnswers: number;
  correctAnswers: number;
  correctPercentage: number;
};

type ScheduledTaskAnalytics = {
  task: {
    id: string;
    title: string;
    type: string;
  };
  totalStudents: number;
  completedStudents: number;
  completionRate: number;
  questions: ScheduledTaskQuestion[];
};

const QUESTION_TYPE_CONFIG: Record<
  QuestionType,
  { label: string; route: string }
> = {
  MCQ: {
    label: "MCQ",
    route: "mcq",
  },
  GAP_FILL: {
    label: "Gap Fill",
    route: "gap-fill",
  },
  MATCHING: {
    label: "Matching",
    route: "matching",
  },
  QUESTION_ANSWER: {
    label: "Question Answer",
    route: "question-answer",
  },
  WORD_BOX_MATCH: {
    label: "Word Box Match",
    route: "word-box-match",
  },
};

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ classId: string; taskId: string }>;
}) {
  const { classId, taskId } = await params;

  const auth = await getServerAuth();

  if (!auth) redirect("/login");

  if (auth.role === "student") {
    return children;
  }

  const scheduledTasks = (await getScheduledTaskForClass(
    classId,
    taskId,
  )) as ScheduledTaskAnalytics;

  const questionTypes: QuestionType[] = Array.from(
    new Set<QuestionType>(
      scheduledTasks.questions.map(
        (question: ScheduledTaskQuestion) => question.type,
      ),
    ),
  );

  const tabs = questionTypes.map((type) => ({
    type,
    label: QUESTION_TYPE_CONFIG[type].label,
    route: QUESTION_TYPE_CONFIG[type].route,
  }));

  return (
    <div className="space-y-6">
      <div className="border-b flex gap-2 overflow-x-auto">
        {tabs.map((tab) => (
          <Link
            key={tab.type}
            href={`/classes/${classId}/task/${taskId}/${tab.route}`}
            className="px-5 py-2 text-sm rounded-t-lg bg-muted hover:bg-muted/70 whitespace-nowrap"
          >
            {tab.label}
          </Link>
        ))}
      </div>

      <div className="pt-4">{children}</div>
    </div>
  );
}
