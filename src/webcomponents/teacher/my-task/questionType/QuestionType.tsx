/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState } from "react";
import { Plus, Trash2, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import {
  GapFillMCQQuestion,
  MatchingQuestion,
  MatchingQuestionData,
  MCQData,
  MCQQuestion,
  QAData,
  QuestionAnswer,
  WordBoxQuestion,
  WordBoxConfig,
  OrderingQuestion,
  OrderingData,
} from "@/webcomponents/teacher";

import { BaseQuestion, GapFillConfig } from "@/types/question";
import {
  MatchingConfig,
  MCQResponseApi,
  normalizeGapFillFromApi,
  normalizeMatchingFromApi,
  normalizeMCQFromApi,
  normalizeQAFromApi,
  QAResponseApi,
  normalizeWordBoxFromApi,
  WordBoxApiConfig,
  normalizeOrderingFromApi,
} from "@/utils/config";

import { useParams } from "next/navigation";
import { useUpdateTaskMutation } from "@/api/task";
import { toast } from "sonner";
import {
  AppQuestionType,
  QuestionCsvUploader,
} from "@/webcomponents/question-imports";

interface QuestionTypeClientProps {
  questionType: string;
  taskType: string;
  initialData: any[];
}

// Frontend slug -> backend enum
const BACKEND_TYPE: Record<string, string> = {
  mcq: "MCQ",
  "gap-fill": "GAP_FILL",
  matching: "MATCHING",
  "question-answer": "QUESTION_ANSWER",
  "word-box-match": "WORD_BOX_MATCH",
  ordering: "ORDERING",
};

type SaveStatus = "idle" | "saving" | "saved" | "error";

// One row in the editor. `uid` is a stable client key that NEVER changes (used
// as the React key + clientKey), while `id` may switch from a temp value to the
// real DB id after an autosave — without that split the row would remount and
// wipe in-progress edits.
interface QRow {
  uid: string;
  id: string;
  isNew: boolean;
  config?: any;
  [key: string]: any;
}

export const QuestionTypeClient = ({
  questionType,
  taskType,
  initialData,
}: QuestionTypeClientProps) => {
  const params = useParams();
  const taskId = params.taskId as string;
  const { mutateAsync: updateTask } = useUpdateTaskMutation(taskId);
  const isReadingTask = taskType.toLowerCase() === "reading";
  const backendType = BACKEND_TYPE[questionType] ?? "MCQ";

  /** UI STATE */
  const [questions, setQuestions] = useState<QRow[]>(() =>
    (initialData ?? []).map((q) => ({ ...q, uid: q.id, isNew: false })),
  );

  /** TRACK PENDING API CHANGES (keyed by stable uid) */
  const [editedQuestions, setEditedQuestions] = useState<Record<string, any>>(
    {},
  );
  const [newQuestions, setNewQuestions] = useState<Record<string, any>>({});
  const [deleteQuestionIds, setDeleteQuestionIds] = useState<string[]>([]);

  const [status, setStatus] = useState<SaveStatus>("idle");

  // Refs so the debounced saver always sees the latest values.
  const questionsRef = useRef(questions);
  questionsRef.current = questions;
  const savingRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /** DEFAULT CONFIG FOR NEW QUESTIONS */
  const getDefaultConfig = () => {
    if (questionType === "mcq" || questionType === "gap-fill") {
      return { question: "", options: ["", "", "", ""], correctIndex: -1, explanation: "" };
    }
    if (questionType === "question-answer") return { question: "", answer: "" };
    if (questionType === "ordering") return { question: "", items: ["", "", ""] };
    if (questionType === "matching") {
      return {
        question: "",
        leftItems: ["", "", "", ""],
        rightItems: [
          { type: "definition", value: "" },
          { type: "definition", value: "" },
          { type: "definition", value: "" },
          { type: "definition", value: "" },
        ],
        matches: {},
      };
    }
    return {};
  };

  /** ADD QUESTION */
  const handleAddQuestion = () => {
    const uid = `new-${crypto.randomUUID()}`;
    setQuestions((prev) => [
      ...prev,
      { uid, id: uid, isNew: true, config: getDefaultConfig() },
    ]);
  };

  /** DELETE QUESTION */
  const handleDeleteQuestion = (uid: string) => {
    const row = questionsRef.current.find((q) => q.uid === uid);
    setQuestions((prev) => prev.filter((q) => q.uid !== uid));

    if (row && !row.isNew) {
      setDeleteQuestionIds((prev) => [...prev, row.id]);
    }
    setEditedQuestions((prev) => {
      const copy = { ...prev };
      delete copy[uid];
      return copy;
    });
    setNewQuestions((prev) => {
      const copy = { ...prev };
      delete copy[uid];
      return copy;
    });
  };

  /** TRACK A QUESTION EDIT */
  const handleQuestionSave = (
    uid: string,
    id: string,
    type: string,
    data: any,
    isNew: boolean,
  ) => {
    if (isNew) {
      setNewQuestions((prev) => ({ ...prev, [uid]: { uid, type, data } }));
    } else {
      setEditedQuestions((prev) => ({ ...prev, [uid]: { uid, id, type, data } }));
    }
  };

  /** BUILD PAYLOAD (order is recomputed contiguously from display position) */
  const buildPayload = () => {
    const orderMap: Record<string, number> = {};
    questionsRef.current.forEach((q, i) => {
      orderMap[q.uid] = i + 1;
    });

    const updateQuestions = Object.values(editedQuestions)
      .filter((q: any) => !deleteQuestionIds.includes(q.id))
      .map((q: any) => {
        const { criterionId, ...restConfig } = q.data || {};
        return {
          id: q.id,
          type: q.type,
          order: orderMap[q.uid] ?? 0,
          ...(criterionId ? { criterionId } : { criterionId: null }),
          config: JSON.stringify(restConfig),
        };
      });

    const newQuestionsPayload = Object.values(newQuestions).map((q: any) => {
      const { criterionId, ...restConfig } = q.data || {};
      return {
        clientKey: q.uid,
        type: q.type,
        order: orderMap[q.uid] ?? 0,
        ...(criterionId ? { criterionId } : { criterionId: null }),
        config: JSON.stringify(restConfig),
      };
    });

    return {
      updateQuestions,
      newQuestions: newQuestionsPayload,
      deleteQuestionIds,
    };
  };

  const hasPending =
    deleteQuestionIds.length > 0 ||
    Object.keys(editedQuestions).length > 0 ||
    Object.keys(newQuestions).length > 0;

  /** THE ACTUAL SAVE (used by both autosave and the manual button) */
  const performSave = async (silent = true) => {
    if (savingRef.current) return;
    if (
      !deleteQuestionIds.length &&
      !Object.keys(editedQuestions).length &&
      !Object.keys(newQuestions).length
    ) {
      return;
    }

    // Snapshot what we're sending so we can clear exactly these afterwards.
    const sentEdited = { ...editedQuestions };
    const sentNew = { ...newQuestions };
    const sentDeletes = [...deleteQuestionIds];

    savingRef.current = true;
    setStatus("saving");
    try {
      const payload = buildPayload();
      const res: any = await updateTask({ payload: payload as any });
      const created: { clientKey: string; id: string }[] =
        res?.createdQuestions ?? [];
      const createdMap = new Map(created.map((c) => [c.clientKey, c.id]));

      // Reconcile temp rows -> real ids (keep uid stable so no remount).
      if (createdMap.size) {
        setQuestions((prev) =>
          prev.map((q) =>
            createdMap.has(q.uid)
              ? { ...q, id: createdMap.get(q.uid)!, isNew: false }
              : q,
          ),
        );
      }

      // Clear sent edits — but only if untouched since we sent them.
      setEditedQuestions((prev) => {
        const copy = { ...prev };
        for (const uid of Object.keys(sentEdited)) {
          if (copy[uid] === sentEdited[uid]) delete copy[uid];
        }
        return copy;
      });

      // Clear sent new questions. If a new row was edited again while the save
      // was in flight, move it to "edited" under its real id so we UPDATE it
      // next time instead of creating a duplicate.
      setNewQuestions((prev) => {
        const copy = { ...prev };
        for (const uid of Object.keys(sentNew)) {
          const realId = createdMap.get(uid);
          if (copy[uid] === sentNew[uid]) {
            delete copy[uid];
          } else if (realId && copy[uid]) {
            const lingering = copy[uid];
            delete copy[uid];
            setEditedQuestions((e) => ({
              ...e,
              [uid]: {
                uid,
                id: realId,
                type: lingering.type,
                data: lingering.data,
              },
            }));
          }
        }
        return copy;
      });

      setDeleteQuestionIds((prev) => prev.filter((id) => !sentDeletes.includes(id)));

      setStatus("saved");
      if (!silent) toast.success("Questions saved");
    } catch {
      setStatus("error");
      if (!silent) toast.error("Failed to save questions");
    } finally {
      savingRef.current = false;
    }
  };

  /** DEBOUNCED AUTOSAVE — fires ~1.2s after the last change */
  useEffect(() => {
    if (!hasPending || savingRef.current) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      void performSave(true);
    }, 1200);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editedQuestions, newQuestions, deleteQuestionIds]);

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 flex flex-col gap-6 px-3.5">
      <div>
        <QuestionCsvUploader
          questionType={questionType as AppQuestionType}
          onImport={(importedQuestions) => {
            const mapped: QRow[] = importedQuestions.map((config) => ({
              uid: `new-${crypto.randomUUID()}`,
              id: "",
              isNew: true,
              config,
            }));
            mapped.forEach((m) => (m.id = m.uid));

            setQuestions((prev) => [...prev, ...mapped]);
            setNewQuestions((prev) => {
              const next = { ...prev };
              mapped.forEach((q) => {
                next[q.uid] = { uid: q.uid, type: backendType, data: q.config };
              });
              return next;
            });
          }}
        />
      </div>

      {/* QUESTIONS */}
      <div className="px-6 flex flex-col gap-8">
        {questions.map((data: any, index) => {
          const uid = data.uid;
          const isNew = data.isNew;

          const normalizedData =
            !isNew &&
            (questionType === "mcq"
              ? normalizeMCQFromApi(data as BaseQuestion<MCQResponseApi>)
              : questionType === "gap-fill"
                ? normalizeGapFillFromApi(data as BaseQuestion<GapFillConfig>)
                : questionType === "matching"
                  ? normalizeMatchingFromApi(data as BaseQuestion<MatchingConfig>)
                  : questionType === "question-answer"
                    ? normalizeQAFromApi(data as BaseQuestion<QAResponseApi>)
                    : questionType === "word-box-match"
                      ? normalizeWordBoxFromApi(data as BaseQuestion<WordBoxApiConfig>)
                      : questionType === "ordering"
                        ? normalizeOrderingFromApi(data)
                        : null);

          const initial = isNew ? data.config : (normalizedData ?? data.config ?? {});

          return (
            <div key={uid} className="relative group">
              {/* INDEX */}
              <div className="absolute -left-12 top-4 w-8 h-8 rounded-full bg-white border shadow-sm flex items-center justify-center text-xs font-bold">
                {index + 1}
              </div>

              {/* DELETE */}
              <button
                onClick={() => handleDeleteQuestion(uid)}
                className="absolute right-0 top-0 text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              {questionType === "mcq" && (
                <MCQQuestion
                  mode={isNew ? "create" : "edit"}
                  initialData={initial as MCQData}
                  showCriterion={isReadingTask}
                  onSave={(v) => handleQuestionSave(uid, data.id, "MCQ", v, isNew)}
                />
              )}

              {questionType === "gap-fill" && (
                <GapFillMCQQuestion
                  mode={isNew ? "create" : "edit"}
                  initialData={initial as MCQData}
                  showCriterion={isReadingTask}
                  onSave={(v) => handleQuestionSave(uid, data.id, "GAP_FILL", v, isNew)}
                />
              )}

              {questionType === "matching" && (
                <MatchingQuestion
                  mode={isNew ? "create" : "edit"}
                  initialData={initial as MatchingQuestionData}
                  showCriterion={isReadingTask}
                  onSave={(v) => handleQuestionSave(uid, data.id, "MATCHING", v, isNew)}
                />
              )}

              {questionType === "question-answer" && (
                <QuestionAnswer
                  mode={isNew ? "create" : "edit"}
                  initialData={initial as QAData}
                  showCriterion={isReadingTask}
                  onSave={(v) =>
                    handleQuestionSave(uid, data.id, "QUESTION_ANSWER", v, isNew)
                  }
                />
              )}

              {questionType === "word-box-match" && (
                <WordBoxQuestion
                  mode={isNew ? "create" : "edit"}
                  initialData={initial as WordBoxConfig}
                  showCriterion={isReadingTask}
                  onSave={(v) =>
                    handleQuestionSave(uid, data.id, "WORD_BOX_MATCH", v, isNew)
                  }
                />
              )}

              {questionType === "ordering" && (
                <OrderingQuestion
                  mode={isNew ? "create" : "edit"}
                  initialData={initial as OrderingData}
                  showCriterion={isReadingTask}
                  onSave={(v) =>
                    handleQuestionSave(uid, data.id, "ORDERING", v, isNew)
                  }
                />
              )}
            </div>
          );
        })}

        <Separator className="my-4" />

        <Button
          variant="ghost"
          onClick={handleAddQuestion}
          className="w-full border-dashed rounded-lg h-11 flex items-center gap-2 bg-white/50 hover:bg-white"
        >
          <Plus className="w-4 h-4" />
          Add another {questionType.replace("-", " ")}
        </Button>
      </div>

      {/* SAVE BAR */}
      <div className="px-6 mt-10 flex items-center gap-3">
        <Button
          size="sm"
          onClick={() => performSave(false)}
          disabled={status === "saving" || !hasPending}
        >
          {status === "saving" ? "Saving..." : "Save now"}
        </Button>

        <span className="text-xs text-muted-foreground flex items-center gap-1">
          {status === "saving" && (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving changes…
            </>
          )}
          {status === "saved" && !hasPending && (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-500" /> All changes saved
            </>
          )}
          {hasPending && status !== "saving" && "Unsaved changes — autosaving…"}
          {status === "error" && (
            <span className="text-destructive">Save failed — retry</span>
          )}
        </span>
      </div>
    </div>
  );
};
