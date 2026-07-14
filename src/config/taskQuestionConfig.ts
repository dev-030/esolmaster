export const TASK_QUESTION_MAP = {
  grammar: ["mcq"],
  reading: ["mcq", "gap-fill", "question-answer", "ordering"],
  vocabulary: ["mcq", "gap-fill", "matching", "word-spelling"],
} as const;

export const QUESTION_LABEL = {
  mcq: "MCQ",
  "gap-fill": "Gap Fill",
  matching: "Matching",
  "question-answer": "Question & Answer",
  "word-spelling": "Word Spelling",
  ordering: "Ordering",
};
