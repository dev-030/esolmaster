// ─── Core Data Models ────────────────────────────────────────────────────────

import { BaseQuestion } from "./question";

export type Option = {
  id: string;
  text: string;
};

export type MatchPair = {
  left: string;
  right: string;
};

export type QuestionType =
  | "mcq"
  | "gap_mcq"
  | "text_input"
  | "matching"
  | "flashcard";
export type TaskType = "grammar" | "reading" | "vocabulary";

export type Question = {
  id: string;
  type: QuestionType;

  // Generic
  question?: string;
  note?: string;
  image?: string;

  // Vocabulary / Flashcard
  word?: string;
  definition?: string;

  // MCQ / Gap MCQ
  options?: Option[];

  // Validation
  correctAnswers?: string[];

  // Matching
  pairs?: MatchPair[];
};

export type TaskContentSection = {
  title: string;
  description?: string;
  content: string;
};

export type Task = {
  id: string;
  title: string;
  taskType: TaskType;
  questions: Question[];
  dueDate?: string;
  contentSection?: TaskContentSection;
  description?: string;
  published?: boolean;
  currentStudentProgress?: number;
};

export type UserAnswer = {
  questionId: string;
  answer: string | string[];
};

// ─── Result Models ────────────────────────────────────────────────────────────

export type QuestionResult = {
  questionId: string;
  correct: boolean;
  userAnswer: string | string[];
  correctAnswers: string[];
  note?: string;
  question: Question;
};

export type TaskResult = {
  taskId: string;
  score: number;
  total: number;
  percentage: number;
  results: QuestionResult[];
  completedAt: string;
};

// ─── Class & User Models ──────────────────────────────────────────────────────

export type UserRole = "teacher" | "student";

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
};

export type ClassStudent = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  joinedAt: string;
  progress?: number;
};

export type ClassTask = {
  id: string;
  title: string;
  taskType: TaskType;
  dueDate?: string;
  questionCount: number;
  completedBy?: number;
  totalStudents?: number;
};

export type Classroom = {
  id: string;
  name: string;
  subject: string;
  teacherId: string;
  teacherName: string;
  studentCount: number;
  taskCount: number;
  color: string;
  description?: string;
  createdAt: string;
  // new fields
  maxStudents?: number;
  tasks?: string[];
};

// ─── Component Props Interfaces ───────────────────────────────────────────────

export interface MCQConfig {
  options: string[];
  question: string;
  explanation: string;
  correctIndex: number;
}
export interface QuestionComponentProps {
  question: BaseQuestion<MCQConfig>;
  userAnswer?: string | string[];
  setAnswer: (answer: string | string[]) => void;
  submitted?: boolean;
}
