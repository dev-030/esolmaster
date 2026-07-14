import { getScheduledTaskForClass } from "@/lib/getTaskById";
import { TeacherTaskQuestion } from "@/webcomponents/teacher";

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

const ROUTE_TO_QUESTION_TYPE: Record<string, QuestionType> = {
  mcq: "MCQ",
  "gap-fill": "GAP_FILL",
  matching: "MATCHING",
  "question-answer": "QUESTION_ANSWER",
  "word-box-match": "WORD_BOX_MATCH",
};

interface PageProps {
  params: Promise<{
    classId: string;
    taskId: string;
    questionType: string;
  }>;
}

export default async function QuestionMappingPage({ params }: PageProps) {
  const { classId, taskId, questionType } = await params;

  const selectedType = ROUTE_TO_QUESTION_TYPE[questionType];

  if (!selectedType) {
    return <div>Invalid question type.</div>;
  }

  const scheduledTask = await getScheduledTaskForClass(classId, taskId);

  const questions = scheduledTask.questions.filter(
    (question: ScheduledTaskQuestion) => question.type === selectedType,
  );
  console.log("Filtered Questions:", questions);

  return (
    <TeacherTaskQuestion questionType={questionType} questions={questions} />
  );
}