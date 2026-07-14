// questionTypes.ts
import { GapFillData, MatchingQuestionData, MCQData, QAData, WordBoxConfig } from "../teacher";

export type AppQuestionType =
  | "mcq"
  | "gap-fill"
  | "question-answer"
  | "matching"
  | "word-spelling"
  | "word-box";   // ✅ ADD

export type ImportedQuestionData =
  | MCQData
  | GapFillData
  | QAData
  | MatchingQuestionData
  | WordBoxConfig; // ✅ ADD