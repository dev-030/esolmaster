import { GapFillData, MCQData } from "../../question";
import { QuestionItem } from "./VocubularyTask";

 export const buildPayload = ({questionGroups}: { questionGroups: QuestionItem[][] }) => {
  return questionGroups.flat().map((q, index) => {
    switch (q.type) {
      case "mcq": {
        const mcq = q.data as MCQData;

        return {
          type: "MCQ",
          order: index + 1,
          config: JSON.stringify(mcq),
        };
      }

      case "gapfill": {
        const gap = q.data as GapFillData;

        return {
          type: "GAP_FILL",
          order: index + 1,
          config: JSON.stringify(gap),
        };
      }

      case "matching":
        return {
          type: "MATCHING",
          order: index + 1,
          config: JSON.stringify(q.data),
        };

      case "spelling":
        return {
          type: "SPELLING",
          order: index + 1,
          config: JSON.stringify(q.data),
        };

      default:
        return null;
    }
  }).filter(Boolean);
};