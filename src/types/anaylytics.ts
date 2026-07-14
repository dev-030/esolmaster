export interface ConnectedClass {
  id: string;
  name: string;
}

export type StudentStatus = "PROBLEMATIC" | "NORMAL" | "GOOD";

export interface StudentProgress {
  studentId: string;
  name: string;
  email: string;
  connectedClasses: ConnectedClass[];

  totalScheduledTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  notStartedTasks: number;

  progressPercentage: number;
  avgScore: number;

  status: StudentStatus;

  lastAttemptAt: string; // ISO date string
}

export interface DashboardStats {
  totalStudents: number;
  totalClasses: number;
  totalTasks: number;
  completedAttempts: number;
  overallAvgScore: number;
}