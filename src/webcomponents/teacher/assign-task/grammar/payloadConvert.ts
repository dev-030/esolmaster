/* eslint-disable @typescript-eslint/no-explicit-any */
import { CreateGrammarTaskPayload, EntryType, TaskType } from "@/types/task";

export const transformGrammarDataToPayload = (
  grammarInfo: {
    title: string;
    explanation: string;
    entry: { entryTypes: EntryType[] };
  },
  questionGroups: any[],
): CreateGrammarTaskPayload => {

  const questions = [];
  let orderCounter = 1;

  for (const group of questionGroups) {
    for (const question of group) {

      let configObject: any = {};
      let backendType = "";

      if (question.type === "mcq") {

        const mcqData = question.data;

        configObject = {
          question: mcqData.question,
          options: mcqData.options,
          correctIndex: mcqData.correctIndex,
          explanation: mcqData.explanation || "",
        };

        backendType = "MCQ";
      }

      else if (question.type === "gapfill") {

        const gapFillData = question.data;

        configObject = {
          question: gapFillData.question,
          options: gapFillData.options,
          correctIndex: gapFillData.correctIndex,
          explanation: gapFillData.explanation || "",
        };

        backendType = "GAP_FILL";
      }

      else if (question.type === "qa") {

        const qaData = question.data;

        configObject = {
          question: qaData.question,
          answer: qaData.answer,
          explanation: qaData.explanation || "",
        };

        backendType = "QUESTION_ANSWER";
      }

      else if (question.type === "wordbox") {

        const wordBoxData = question.data;

        configObject = {
          question: wordBoxData.question,
          words: wordBoxData.words,
          sentences: wordBoxData.sentences,
          explanation: wordBoxData.explanation || "",
        };

        backendType = "WORD_BOX_MATCH";
      }

      questions.push({
        type: backendType,
        order: orderCounter++,
        config: JSON.stringify(configObject),
      });

    }
  }

  return {
    title: grammarInfo.title,
    type: TaskType.GRAMMAR,
    content: grammarInfo.explanation,
    entryType: grammarInfo.entry.entryTypes,
    questions,
  };
};