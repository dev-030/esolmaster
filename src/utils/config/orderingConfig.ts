import { OrderingData } from "@/webcomponents/teacher/question/OrderingQuestion";

export interface OrderingApiConfig {
  question?: string;
  // In the teacher/edit context items is a string[] (correct order).
  items?: (string | { text?: string })[];
  criterionId?: string | null;
}

export const normalizeOrderingFromApi = (data: {
  config?: OrderingApiConfig;
  criterionId?: string | null;
}): OrderingData => {
  const rawItems = Array.isArray(data.config?.items) ? data.config!.items : [];
  const items = rawItems.map((it) =>
    typeof it === "string" ? it : (it?.text ?? ""),
  );
  return {
    question: data.config?.question ?? "",
    items: items.length ? items : ["", "", ""],
    criterionId: data.criterionId ?? "",
  };
};
