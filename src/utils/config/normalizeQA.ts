import { BaseQuestion } from "@/types/question";
import { QAData } from "@/webcomponents/teacher";

export interface QAResponseApi {
  question: string;
  answer: string;
  criterionId?: string | null;
}

export const normalizeQAFromApi = (
  data: BaseQuestion<QAResponseApi>,
): QAData => {
  return {
    question: data.config?.question ?? "",
    answer: data.config?.answer ?? "",
    criterionId: data.criterionId ?? "",
  };
};