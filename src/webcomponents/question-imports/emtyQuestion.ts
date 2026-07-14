/* eslint-disable @typescript-eslint/no-explicit-any */
export const isEmptyQuestionData = (data: any) => {
  if (!data) return true;

  if ("options" in data) {
    return (
      !data.question?.trim() &&
      data.options?.every((option: string) => !option?.trim()) &&
      data.correctIndex === -1 &&
      !data.explanation?.trim()
    );
  }

  if ("pairs" in data) {
    return (
      !data.question?.trim() &&
      data.pairs?.every(
        (pair: any) => !pair.left?.trim() && !pair.right?.trim(),
      )
    );
  }

  if ("answer" in data) {
    return !data.question?.trim() && !data.answer?.trim();
  }

  if ("words" in data && "sentences" in data) {
    return (
      !data.question?.trim() &&
      data.words?.every((w: string) => !w?.trim()) &&
      data.sentences?.every((s: any) => !s.text?.trim())
    );
  }

  return true;
};
