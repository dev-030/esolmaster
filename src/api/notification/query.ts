import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getMyNotifications,
  getUnreadNotificationCount,
  markAllNotificationsRead,
  markNotificationRead,
} from "./api";
import { NotificationListResponse } from "@/types/notification";

export const useGetMyNotifications = (page = 1, limit = 20) => {
  return useQuery({
    queryKey: ["notifications", page, limit],
    queryFn: async (): Promise<NotificationListResponse> =>
      getMyNotifications(page, limit),
  });
};

export const useGetUnreadNotificationCount = () => {
  return useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: async () => getUnreadNotificationCount(),
    refetchInterval: 60_000,
  });
};

export const useMarkNotificationReadMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["notifications", "mark-read"],
    mutationFn: async (id: string) => markNotificationRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};

export const useMarkAllNotificationsReadMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["notifications", "mark-all-read"],
    mutationFn: async () => markAllNotificationsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};
