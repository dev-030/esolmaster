import { BaseQuestion, GapFillConfig, MatchingConfig, MCQConfig, QAConfig, WordBoxMatchConfig } from "./question";

export type MCQQuestion = BaseQuestion<MCQConfig> & {
  type: "MCQ";
};

export type GapFillQuestion = BaseQuestion<GapFillConfig> & {
  type: "GAP_FILL";
};

export type QAQuestion = BaseQuestion<QAConfig> & {
  type: "QUESTION_ANSWER";
};

export type MatchingQuestion = BaseQuestion<MatchingConfig> & {
  type: "MATCHING";
};

export type WordBoxMatchQuestion = BaseQuestion<WordBoxMatchConfig> & {
  type: "WORD_BOX_MATCH";
};

export type Question =
  | MCQQuestion
  | GapFillQuestion
  | QAQuestion
  | MatchingQuestion
  | WordBoxMatchQuestion;