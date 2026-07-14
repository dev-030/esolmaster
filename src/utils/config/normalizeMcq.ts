// types/mcq.ts

import { BaseQuestion } from "@/types/question";
import { MCQData } from "@/webcomponents/teacher";


export interface MCQResponseApi {
  question: string;
  options: string[];
  explanation?: string;
  correctIndex: number;
}

// this is the shape your component already likes
export interface MCQViewData {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  criterionId?: string | null;
}

export const normalizeMCQFromApi = (
  data: BaseQuestion<MCQResponseApi>,
): MCQData => {
  const options = data.config?.options ?? [];;

  return {
    question: data.config?.question ?? "",
    options: options,
    correctIndex: data.config?.correctIndex,
    explanation: data.config?.explanation ?? "",
    criterionId: data.criterionId ?? "",
  };
};
