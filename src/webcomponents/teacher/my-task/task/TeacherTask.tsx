"use client";

import { WordBoxMatchQuestion } from "@/types/questionvarient";
import {
  MCQQuestion,
  GapFillMCQQuestion,
  MatchingQuestion,
  QuestionAnswer,
  MCQData,
  MatchingQuestionData,
  QAData,
  WordSpellingData,
  WordBoxQuestion,
  WordBoxConfig,
} from "@/webcomponents/teacher";

type TeacherQuestion = {
  questionId: string;
  type: string;
  config: unknown;
  order: number;
  totalAnswers: number;
  correctAnswers: number;
  correctPercentage: number;
};

type TeacherTaskQuestionProps = {
  questionType: string;
  questions: TeacherQuestion[];
};

const parseConfig = <T,>(config: unknown): T => {
  if (typeof config === "string") {
    try {
      return JSON.parse(config) as T;
    } catch {
      return {} as T;
    }
  }

  return config as T;
};

export const TeacherTaskQuestion = ({
  questionType,
  questions,
}: TeacherTaskQuestionProps) => {
  if (!questions.length) {
    return <div>No questions found for this type.</div>;
  }

  console.log("Rendering questions of type:", questions);

  return (
    <div className="space-y-6">
      {questions.map((question) => {
        const percentage = question.correctPercentage;

        switch (questionType) {
          case "mcq":
            return (
              <MCQQuestion
                key={question.questionId}
                mode="disabled"
                initialData={parseConfig<MCQData>(question.config)}
                percentage={percentage}
              />
            );

          case "gap-fill":
            return (
              <GapFillMCQQuestion
                key={question.questionId}
                mode="disabled"
                initialData={parseConfig<MCQData>(question.config)}
                percentage={percentage}
              />
            );

          case "matching":
            return (
              <MatchingQuestion
                key={question.questionId}
                mode="disabled"
                initialData={parseConfig<MatchingQuestionData>(question.config)}
                percentage={percentage}
              />
            );

          case "question-answer":
            return (
              <QuestionAnswer
                key={question.questionId}
                mode="disabled"
                initialData={parseConfig<QAData>(question.config)}
                percentage={percentage}
              />
            );

          case "word-box-match":
          case "word-spelling":
            return (
              <WordBoxQuestion
                key={question.questionId}
                mode="disabled"
                initialData={parseConfig<WordBoxConfig>(question.config)}
                percentage={percentage}
              />
            );

          default:
            return null;
        }
      })}
    </div>
  );
};
