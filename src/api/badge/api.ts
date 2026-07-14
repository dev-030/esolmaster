import { axios } from "@/lib/axios";

export type BadgeConditionType =
  | "COMPLETE_TASKS_WITHIN_DAYS"
  | "SCORE_PERCENTAGE"
  | "CONSECUTIVE_SCORE_PERCENTAGE"
  | "SCORE_PERCENTAGE_IN_TASKS_WITHIN_DAYS"
  | "XP_WITHIN_TIME"
  | "STREAK_DAYS"
  | "ATTEMPT_COUNT";

export type CreateBadgePayload = {
  name: string;
  description: string;
  iconName: string;
  conditionType: BadgeConditionType;
  conditionConfig: Record<string, number>;
  isActive?: boolean;
};

export const createBadge = async (payload: CreateBadgePayload) => {
  const res = await axios.post("/badge", payload);
  return res.data;
};

export const getMyBadges = async () => {
  const res = await axios.get("/badge/my-badges");
  return res.data;
};

export const deleteBadge = async (id: string) => {
  const res = await axios.delete(`/admin/badges/${id}`);
  return res.data;
};