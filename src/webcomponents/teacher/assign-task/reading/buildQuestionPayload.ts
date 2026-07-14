import { QuestionItem } from "../vocubulary";


const TYPE_MAP: Record<QuestionItem["type"], string> = {
  mcq: "MCQ",
  gapfill: "GAP_FILL",
  qa: "QUESTION_ANSWER",
  matching: "MATCHING",
  spelling: "SPELLING",
};

export const buildQuestionsPayload = (questionGroups: QuestionItem[][]) => {
  let order = 0;

  return questionGroups.flatMap((group) =>
    group.map((q) => {
      order++;
      const questionData = q.data as unknown as {
        criterionId?: string;
      } & Record<string, unknown>;
      const { criterionId, ...config } = questionData;

      return {
        type: TYPE_MAP[q.type],
        order,
        criterionId,
        config,
      };
    })
  );
};