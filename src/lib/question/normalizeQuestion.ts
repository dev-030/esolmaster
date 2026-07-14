/* eslint-disable @typescript-eslint/no-explicit-any */
import { Question } from "@/types/questionvarient";

export async function normalizeQuestions(questions: any[]): Promise<Question[]> {
  return await Promise.all(
    questions.map(async (q) => ({
      ...q,
      config:
        typeof q.config === "string"
          ? JSON.parse(q.config)
          : q.config,
    }))
  );
}