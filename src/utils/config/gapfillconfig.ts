// utils/normalizeGapFill.ts

import { BaseQuestion } from "@/types/question";
import { MCQData } from "@/webcomponents/teacher";

interface GapFillConfig {
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
  criterionId?: string | null;
}

export const normalizeGapFillFromApi = (
  data: BaseQuestion<GapFillConfig>,
): MCQData => {
  return {
    question: data.config?.question ?? "",
    options: data.config?.options ?? ["", "", "", ""],
    correctIndex: data.config?.correctIndex ?? -1,
    explanation: data.config?.explanation ?? "",
    criterionId: data.criterionId ?? "",
  };
};