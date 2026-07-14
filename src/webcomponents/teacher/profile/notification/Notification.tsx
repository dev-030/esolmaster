"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

type NotificationItem = {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
};

const initialNotifications: NotificationItem[] = [
  { id: "new_assignment", title: "New Assignment", description: "Get notified when a new assignment is posted.", enabled: true },
  { id: "submission", title: "Student Submission", description: "Receive alerts when a student submits their work.", enabled: true },
  { id: "due_reminder", title: "Due Date Reminder", description: "Reminders 24 hours before an assignment is due.", enabled: false },
  { id: "grade_update", title: "Grade Published", description: "Notify students when grades are published.", enabled: true },
  { id: "messages", title: "New Messages", description: "Alert when you receive a new message from a student.", enabled: true },
  { id: "class_update", title: "Class Updates", description: "Announcements and updates related to your classes.", enabled: false },
  { id: "system", title: "System Notifications", description: "Platform maintenance and important system alerts.", enabled: true },
  { id: "weekly_report", title: "Weekly Report", description: "Receive a weekly summary of class performance.", enabled: false },
];

export const Notification = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);

  const toggle = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, enabled: !n.enabled } : n))
    );
  };

  return (
    <Card className="w-full">
      <CardHeader className="bg-gray-50 rounded-t-lg px-6 py-4">
        <CardTitle className="text-base font-semibold">Notifications</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {notifications.map((item, idx) => (
          <div key={item.id}>
            <div className="flex items-center justify-between px-6 py-4">
              <div>
                <p className="text-sm font-medium">{item.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
              </div>
              <Switch
                checked={item.enabled}
                onCheckedChange={() => toggle(item.id)}
              />
            </div>
            {idx < notifications.length - 1 && <Separator />}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};