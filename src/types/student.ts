import {  TaskType } from ".";
import { PaginationQuery } from "./pagintaion";
import { EntryType } from "./task";

export interface MonthlyStat {
  currentMonth: number;
  changePercentage: number;
  trend: "increase" | "decrease" | "neutral";
}

export interface DashboardStats {
  totalScheduledTasks: MonthlyStat;
  completedTasks: MonthlyStat;
  xpEarned: MonthlyStat;
  currentStreak: number;
}

export interface LevelInfo {
  level: number;
  totalXp: number;
  xpIntoLevel: number;
  xpNeededForNextLevel: number;
}
export interface RecentActivity {
  id: string;
  xpEarned: number;
  taskTitle: string;
  className: string;
  createdAt: string;
  taskType: string;
}

export interface StudentDashboardResponse {
  stats: DashboardStats;
  level: LevelInfo;
  recentActivity: RecentActivity[];
}

export interface StudentSkillProgress {
  grammar: number;
  reading: number;
  vocabulary: number;
  overall: number;
}

export interface ScheduledTaskQuery extends PaginationQuery {
  taskType?: TaskType;
  entryType?:EntryType;
  
}

export interface BrowseTask {
  classId: string;
  className: string;
  classSubject: string;

  entryType: EntryType[];

  classTaskId: string;
  scheduledTaskId: string;
  taskId: string;

  taskTitle: string;
  taskType: TaskType;

  xpPerQuestion: number;
  totalQuestions: number;
  totalXp: number;

  questionTypes: string[] ;

  scheduledAt: string; // ISO date string
  dueAt: string;
   attemptStatus: "COMPLETED" | "IN_PROGRESS",       // ISO date string

  isActive: boolean;
}