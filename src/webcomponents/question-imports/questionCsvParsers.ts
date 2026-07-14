// questionCsvParsers.ts

import { AppQuestionType, ImportedQuestionData } from "./questionTypes";

const parseCsvLine = (line: string) => {
  return line.split(",").map((cell) => cell.trim());
};

const readCsvRows = (text: string) => {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const [headerLine, ...dataLines] = lines;

  const headers = parseCsvLine(headerLine);

  return dataLines.map((line) => {
    const values = parseCsvLine(line);

    return headers.reduce<Record<string, string>>((acc, header, index) => {
      acc[header] = values[index] ?? "";
      return acc;
    }, {});
  });
};

export const parseQuestionCsv = (
  text: string,
  questionType: AppQuestionType,
): ImportedQuestionData[] => {
  const rows = readCsvRows(text);

  if (questionType === "mcq") {
    return rows.map((row) => ({
      question: row.question,
      options: [row.optionA, row.optionB, row.optionC, row.optionD],
      correctIndex: Number(row.correctIndex),
      explanation: row.explanation ?? "",
      criterionText: row.criterion || undefined,
    }));
  }

  if (questionType === "gap-fill") {
    return rows.map((row) => ({
      question: row.question,
      options: [row.optionA, row.optionB, row.optionC, row.optionD],
      correctIndex: Number(row.correctIndex),
      explanation: row.explanation ?? "",
      criterionText: row.criterion || undefined,
    }));
  }

  if (questionType === "question-answer") {
    return rows.map((row) => ({
      question: row.question,
      answer: row.answer,
      criterionText: row.criterion || undefined,
    }));
  }

  // if (questionType === "matching") {
  //   const grouped = new Map<
  //     string,
  //     {
  //       question: string;
  //       criterionText?: string;
  //       pairs: {
  //         id: string;
  //         left: string;
  //         right: string;
  //         isCorrectlyMatched: boolean;
  //       }[];
  //     }
  //   >();

  //   rows.forEach((row) => {
  //     const key = row.question;

  //     if (!grouped.has(key)) {
  //       grouped.set(key, {
  //         question: row.question,
  //         criterionText: row.criterion || undefined,
  //         pairs: [],
  //       });
  //     }

  //     grouped.get(key)!.pairs.push({
  //       id: crypto.randomUUID(),
  //       left: row.left,
  //       right: row.right,
  //       isCorrectlyMatched: true,
  //     });
  //   });

  //   return Array.from(grouped.values());
  // }

  if (questionType === "word-box") {
    const grouped = new Map<
      string,
      {
        question: string;
        explanation?: string;
        criterionText?: string;
        words: string[];
        sentences: {
          id: string;
          text: string;
          answer: string;
        }[];
      }
    >();

    rows.forEach((row) => {
      const key = row.question;

      if (!grouped.has(key)) {
        grouped.set(key, {
          question: row.question,
          explanation: row.explanation ?? "",
          criterionText: row.criterion || undefined,
          words: [],
          sentences: [],
        });
      }

      const item = grouped.get(key)!;

      item.words.push(row.word);

      item.sentences.push({
        id: crypto.randomUUID(),
        text: row.sentence,
        answer: row.word,
      });
    });

    return Array.from(grouped.values()).map((q) => ({
      ...q,
      explanation: q.explanation ?? "",
    }));
  }

  return [];
};
