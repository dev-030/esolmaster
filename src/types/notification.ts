export type NotificationType =
  | "TASK_OPENED"
  | "TASK_ENDING_SOON"
  | "SUBSCRIPTION_EXPIRING"
  | "BADGE_EARNED"
  | "GENERAL";

export interface AppNotification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  relatedId: string | null;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationListResponse {
  data: AppNotification[];
  unreadCount: number;
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
