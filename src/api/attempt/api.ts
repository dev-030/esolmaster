
import { axios } from "@/lib/axios";

export const startAttempt = async (scheduledTaskId: string) => {
  const res = await axios.post("attempts/start", { scheduledTaskId });
  return res.data;
};

export const getAttempt = async (attemptId: string) => {
  const res = await axios.get(`attempts/${attemptId}`);
  return res.data;
};

export const submitAnswer = async ({
  attemptId,
  questionId,
  answerData,
}: {
  attemptId: string;
  questionId: string;
  answerData: unknown;
}) => {
  const res = await axios.post(`attempts/${attemptId}/answer`, {
    questionId,
    answerData,
  });

  return res.data;
};