// import { getTaskById } from "@/lib/getTaskById";
import { getTaskById } from "@/lib/getTaskById";
import { normalizeQuestions } from "@/lib/question";
import { Question } from "@/types/questionvarient";
import { QuestionTypeClient } from "@/webcomponents/teacher";

const QUESTION_MAP = {
  mcq: "MCQ",
  "gap-fill": "GAP_FILL",
  matching: "MATCHING",
  "question-answer": "QUESTION_ANSWER",
  "word-box-match": "WORD_BOX_MATCH",
  ordering: "ORDERING",
} as const;




export default async function Page({
  params,
}: {
  params: Promise<{ taskId: string; taskType: string; questionType: string }>;
}) {
  const { taskId, taskType, questionType } = await params;

  const task = await getTaskById(taskId);

  const questions = await normalizeQuestions(task.questions) as Question[];

  const backendType = QUESTION_MAP[questionType as keyof typeof QUESTION_MAP];
  console.log(
    "All question types:",
    questions.map((q) => q.type),
  );

  console.log("Requested type:", backendType);
  const initialData = questions
    .filter((q) => q.type === backendType)
    .sort((a, b) => a.order - b.order);

  console.log("Initial Data:", initialData);

  console.log("Task ID:", taskId);
  console.log("Filtered questions:", initialData.length);
  

  return (
    <QuestionTypeClient
      questionType={questionType}
      taskType={taskType}
      initialData={initialData}
    />
  );
}