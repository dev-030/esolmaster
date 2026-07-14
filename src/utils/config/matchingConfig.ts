/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseQuestion } from "@/types/question";
import { MatchingQuestionData } from "@/webcomponents/teacher";

export interface MatchingPairConfig {
  id: string;
  left: string;
  right: string;
  isCorrectlyMatched?: boolean;
}

export interface MatchingConfig {
  question: string;
  pairs: MatchingPairConfig[];
  criterionId?: string | null;
}

export const normalizeMatchingFromApi = (
  data: BaseQuestion<any>,
): MatchingQuestionData => {
  const config = data.config ?? {};

  return {
    question: config.question ?? "",
    leftItems: config.leftItems ?? [],
    rightItems: config.rightItems ?? [],
    matches: config.matches ?? {},
    criterionId: data.criterionId ?? config.criterionId ?? "",
  };
};