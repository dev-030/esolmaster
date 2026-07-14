import { BaseQuestion } from "@/types/question";
import { WordBoxConfig } from "@/webcomponents/teacher";

export interface WordBoxApiConfig {
  question: string;
  words: string[];
  sentences: Array<{
    id: string;
    text: string;
    answer: string;
  }>;
  explanation: string;
  criterionId?: string | null;
}

export const normalizeWordBoxFromApi = (
  data: BaseQuestion<WordBoxApiConfig>,
): WordBoxConfig => {
  return {
    question: data.config?.question ?? "",
    words: data.config?.words ?? [],
    sentences: data.config?.sentences ?? [],
    explanation: data.config?.explanation ?? "",
    criterionId: data.criterionId ?? "",
  };
};
