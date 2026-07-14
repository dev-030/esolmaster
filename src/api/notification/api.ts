import { axios } from "@/lib/axios";

export const getMyNotifications = async (page = 1, limit = 20) => {
  const { data } = await axios.get("/notifications", { params: { page, limit } });
  return data;
};

export const getUnreadNotificationCount = async () => {
  const { data } = await axios.get("/notifications/unread-count");
  return data as { unreadCount: number };
};

export const markNotificationRead = async (id: string) => {
  const { data } = await axios.patch(`/notifications/${id}/read`);
  return data;
};

export const markAllNotificationsRead = async () => {
  const { data } = await axios.patch("/notifications/read-all");
  return data;
};
