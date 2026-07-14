"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Performer {
  id: string;
  name: string;
  className: string;
  score: number;
  completedTasks?: number;
  email?: string;
}

interface TopPerformersProps {
  data: Performer[];
}

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

export const TopPerformers = ({ data }: TopPerformersProps) => {
  if (!data || data.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Top Performers</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div className="text-center py-8 text-muted-foreground">
            No performers data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Top Performers</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {data.map((performer, index) => (
          <div
            key={performer.id}
            className="flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3 flex-1">
              <div className="relative">
                <Avatar className="bg-gray-200 h-10 w-10">
                  <AvatarFallback className="bg-gray-200 text-gray-800 font-bold text-sm">
                    {getInitials(performer.name)}
                  </AvatarFallback>
                </Avatar>
                {index < 3 && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center text-[8px] font-bold text-white">
                    {index + 1}
                  </div>
                )}
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <span className="font-semibold text-sm leading-tight truncate">
                  {performer.name}
                </span>
                <span className="text-xs text-muted-foreground truncate">
                  {performer.className}
                </span>
                {performer.completedTasks && (
                  <span className="text-[10px] text-muted-foreground">
                    {performer.completedTasks} tasks completed
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="bg-green-100 text-green-600 text-sm font-semibold px-3 py-1 rounded-full">
                {Math.round(performer.score)}%
              </span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};