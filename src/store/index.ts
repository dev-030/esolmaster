import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  Task,
  UserAnswer,
  TaskResult,
  QuestionResult,
  Classroom,
} from "@/types";
import { evaluateAnswer } from "@/lib/answer-evaluator";

// ─── Task Store ───────────────────────────────────────────────────────────────

interface TaskState {
  task: Task | null;
  answers: UserAnswer[];
  result: TaskResult | null;
  currentQuestionIndex: number;
  submitted: boolean;
  setTask: (task: Task) => void;
  setAnswer: (questionId: string, answer: string | string[]) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  submitTask: () => void;
  resetTask: () => void;
  goToQuestion: (index: number) => void;
  getCurrentAnswer: (questionId: string) => string | string[] | undefined;
  isAnswered: (questionId: string) => boolean;
  getProgress: () => number;
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      task: null,
      answers: [],
      result: null,
      currentQuestionIndex: -1,
      submitted: false,

      setTask: (task: Task) => {
        const currentTask = get().task;
        if (currentTask?.id !== task.id) {
          set({
            task,
            answers: [],
            result: null,
            currentQuestionIndex: task.contentSection ? -1 : 0,
            submitted: false,
          });
        } else {
          set({ task });
        }
      },

      setAnswer: (questionId: string, answer: string | string[]) => {
        set((state) => {
          const existing = state.answers.findIndex(
            (a) => a.questionId === questionId,
          );
          if (existing >= 0) {
            const updated = [...state.answers];
            updated[existing] = { questionId, answer };
            return { answers: updated };
          }
          return { answers: [...state.answers, { questionId, answer }] };
        });
      },

      nextQuestion: () => {
        set((state) => {
          const total = state.task?.questions.length ?? 0;

          if (state.currentQuestionIndex < total - 1) {
            return { currentQuestionIndex: state.currentQuestionIndex + 1 };
          }

          return state;
        });
      },

      prevQuestion: () => {
        set((state) => {
          if (state.currentQuestionIndex > -1) {
            return { currentQuestionIndex: state.currentQuestionIndex - 1 };
          }
          return state;
        });
      },

      goToQuestion: (index: number) => {
        const total = get().task?.questions.length ?? 0;

        if (index === -1) {
          set({ currentQuestionIndex: -1 });
          return;
        }

        if (index >= 0 && index < total) {
          set({ currentQuestionIndex: index });
        }
      },
      submitTask: () => {
        const { task, answers } = get();
        if (!task) return;
        const results: QuestionResult[] = task.questions.map((question) => {
          const userAnswerObj = answers.find(
            (a) => a.questionId === question.id,
          );
          const userAnswer = userAnswerObj?.answer ?? "";
          return {
            questionId: question.id,
            correct: evaluateAnswer(question, userAnswer),
            userAnswer,
            correctAnswers: question.correctAnswers ?? [],
            note: question.note,
            question,
          };
        });
        const correct = results.filter((r) => r.correct).length;
        const total = results.length;
        set({
          submitted: true,
          result: {
            taskId: task.id,
            score: correct,
            total,
            percentage: total > 0 ? Math.round((correct / total) * 100) : 0,
            results,
            completedAt: new Date().toISOString(),
          },
        });
      },

      resetTask: () => {
        set({
          task: null,
          answers: [],
          result: null,
          currentQuestionIndex: -1,
          submitted: false,
        });
      },

      getCurrentAnswer: (questionId: string) =>
        get().answers.find((a) => a.questionId === questionId)?.answer,

      isAnswered: (questionId: string) => {
        const answer = get().answers.find(
          (a) => a.questionId === questionId,
        )?.answer;
        if (!answer) return false;
        if (Array.isArray(answer)) return answer.length > 0;
        return answer.trim().length > 0;
      },

      getProgress: () => {
        const { task, answers } = get();
        if (!task) return 0;
        return (answers.length / task.questions.length) * 100;
      },
    }),
    {
      name: "task-runner-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        task: state.task,
        answers: state.answers,
        currentQuestionIndex: state.currentQuestionIndex,
        submitted: state.submitted,
        result: state.result,
      }),
    },
  ),
);

// ─── Class Store ──────────────────────────────────────────────────────────────
// Your existing ClassState + CRUD actions needed by pages

interface ClassState {
  classes: Classroom[];
  tasks: Task[];
  activeClassId: string | null;
  // Existing
  setClasses: (classes: Classroom[]) => void;
  setActiveClass: (id: string) => void;
  // CRUD — used by pages
  addClass: (c: Classroom) => void;
  updateClass: (id: string, data: Partial<Classroom>) => void;
  deleteClass: (id: string) => void;
  setTasks: (tasks: Task[]) => void;
  addTask: (t: Task) => void;
  updateTask: (id: string, data: Partial<Task>) => void;
  deleteTask: (id: string) => void;
}

export const useClassStore = create<ClassState>()(
  persist(
    (set) => ({
      classes: [],
      tasks: [],
      activeClassId: null,

      setClasses: (classes) => set({ classes }),
      setActiveClass: (id) => set({ activeClassId: id }),

      addClass: (c) => set((s) => ({ classes: [...s.classes, c] })),
      updateClass: (id, data) =>
        set((s) => ({
          classes: s.classes.map((c) => (c.id === id ? { ...c, ...data } : c)),
        })),
      deleteClass: (id) =>
        set((s) => ({ classes: s.classes.filter((c) => c.id !== id) })),

      setTasks: (tasks) => set({ tasks }),
      addTask: (t) => set((s) => ({ tasks: [...s.tasks, t] })),
      updateTask: (id, data) =>
        set((s) => ({
          tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...data } : t)),
        })),
      deleteTask: (id) =>
        set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) })),
    }),
    {
      name: "class-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

// ─── UI Store (not persisted) ─────────────────────────────────────────────────

interface UIState {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>()((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}));
