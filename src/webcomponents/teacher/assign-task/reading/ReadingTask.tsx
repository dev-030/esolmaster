"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Plus, Crown } from "lucide-react";
import { useRole } from "@/provider/RoleProvider";

import { ReadingPassage, ReadingPassageData } from "./ReadingPassage";
import { MCQData, MCQQuestion } from "../../question/MCQQuestion";
import {
  GapFillData,
  GapFillMCQQuestion,
} from "../../question/GapFillMCQQuestion";
import { QAData, QuestionAnswer } from "../../question/QuestionAnswer";

import {
  useCreateTaskMutation,
  useGetCriterionInfiniteQuery,
} from "@/api/task";

import { toast } from "sonner";
import { buildQuestionsPayload } from "./buildQuestionPayload";
import {
  isEmptyQuestionData,
  QuestionCsvUploader,
} from "@/webcomponents/question-imports";

type QuestionType = "mcq" | "gapfill" | "qa";

interface QuestionItem {
  id: string;
  type: QuestionType;
  data: MCQData | GapFillData | QAData;
}

const getDefaultQuestionData = (
  type: QuestionType,
): MCQData | GapFillData | QAData => {
  switch (type) {
    case "mcq":
      return {
        question: "",
        options: ["", "", "", ""],
        correctIndex: -1,
        explanation: "",
      };

    case "gapfill":
      return {
        question: "",
        options: ["", "", "", ""],
        correctIndex: -1,
        explanation: "",
      };

    case "qa":
      return {
        question: "",
        answer: "",
      };
  }
};

export const ReadingTask = () => {
  const { role } = useRole();
  const isAdmin = role === "admin";

  const [questionGroups, setQuestionGroups] = useState<QuestionItem[][]>([]);
  const [selectKey, setSelectKey] = useState(0);
  const [isPremium, setIsPremium] = useState(false);

  const [passageData, setPassageData] = useState<ReadingPassageData>({
    title: "",
    passage: "",
    imageUrl: "",
    imageFile: undefined,
    awardingBody: undefined,
    passMark: undefined,
    entry: { entryTypes: [] },
  });

  const { mutateAsync: createTask, isPending } = useCreateTaskMutation();

  const criteriaQuery = useGetCriterionInfiniteQuery({ limit: 20 });

  const criteria = criteriaQuery.data?.pages.flatMap((page) => page.data) ?? [];

  const handlePassageSave = (data: ReadingPassageData) => {
    setPassageData(data);
  };

  const addGroup = (type: QuestionType) => {
    setQuestionGroups((prev) => [
      ...prev,
      [
        {
          id: crypto.randomUUID(),
          type,
          data: getDefaultQuestionData(type),
        },
      ],
    ]);
  };

  const addToGroup = (groupIndex: number) => {
    setQuestionGroups((prev) =>
      prev.map((group, i) =>
        i === groupIndex
          ? [
              ...group,
              {
                id: crypto.randomUUID(),
                type: group[0].type,
                data: getDefaultQuestionData(group[0].type),
              },
            ]
          : group,
      ),
    );
  };

  const updateQuestionData = (
    groupIdx: number,
    questionId: string,
    data: MCQData | GapFillData | QAData,
  ) => {
    setQuestionGroups((prev) =>
      prev.map((group, i) =>
        i === groupIdx
          ? group.map((q) => (q.id === questionId ? { ...q, data } : q))
          : group,
      ),
    );
  };

  const removeFromGroup = (groupIndex: number, questionId: string) => {
    setQuestionGroups((prev) =>
      prev
        .map((group, i) =>
          i === groupIndex ? group.filter((q) => q.id !== questionId) : group,
        )
        .filter((group) => group.length > 0),
    );
  };

  const handleSubmit = async () => {
    try {
      const questions = buildQuestionsPayload(questionGroups);

      const formData = new FormData();

      formData.append("title", passageData.title);
      formData.append("type", "READING");
      formData.append("content", passageData.passage);

      if (passageData.awardingBody) {
        formData.append("awardingBody", passageData.awardingBody);
      }

      if (passageData.passMark !== undefined) {
        formData.append("passMark", String(passageData.passMark));
      }

      formData.append(
        "entryType",
        JSON.stringify(passageData.entry.entryTypes),
      );

      formData.append(
        "questions",
        JSON.stringify(
          questions.map((q) => ({
            ...q,
            config: JSON.stringify(q.config),
          })),
        ),
      );

      if (passageData.imageFile) {
        formData.append("passageImage", passageData.imageFile);
      }

      if (isAdmin) {
        formData.append("isPremium", String(isPremium));
      }

      await createTask(formData, {
        onSuccess: () => {
          toast.success("Task created successfully!");
        },
      });
    } catch (error) {
      console.error("❌ Failed to create task:", error);
      toast.error("Failed to create task");
    }
  };

  const usedTypes = questionGroups.map((g) => g[0].type);

  const remainingTypes = (["mcq", "gapfill", "qa"] as QuestionType[]).filter(
    (t) => !usedTypes.includes(t),
  );

  const getUploaderQuestionType = (type: QuestionType) => {
    switch (type) {
      case "gapfill":
        return "gap-fill";
      case "qa":
        return "question-answer";
      case "mcq":
        return "mcq";
    }
  };

  const renderQuestion = (q: QuestionItem, groupIndex: number) => {
    switch (q.type) {
      case "gapfill":
        return (
          <GapFillMCQQuestion
            key={q.id}
            mode="create"
            initialData={q.data as GapFillData}
            showCriterion
            onSave={(newData) => updateQuestionData(groupIndex, q.id, newData)}
          />
        );

      case "qa":
        return (
          <QuestionAnswer
            key={q.id}
            mode="create"
            initialData={q.data as QAData}
            showCriterion
            onSave={(newData) => updateQuestionData(groupIndex, q.id, newData)}
          />
        );

      case "mcq":
        return (
          <MCQQuestion
            key={q.id}
            mode="create"
            initialData={q.data as MCQData}
            showCriterion
            onSave={(newData) => updateQuestionData(groupIndex, q.id, newData)}
          />
        );
    }
  };

  const getAddLabel = (type: QuestionType) => {
    switch (type) {
      case "gapfill":
        return "Add Gap Fill Question";
      case "qa":
        return "Add Question Answer";
      case "mcq":
        return "Add MCQ Question";
    }
  };

  return (
    <div className="space-y-10">
      <ReadingPassage onSave={handlePassageSave} />

      {isAdmin && (
        <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
          <Checkbox
            id="isPremium"
            checked={isPremium}
            onCheckedChange={(v) => setIsPremium(v === true)}
          />
          <Crown className="w-4 h-4 text-amber-500" />
          <Label htmlFor="isPremium" className="cursor-pointer text-sm font-medium">
            Mark as premium task (only available to teachers on a package that
            includes it)
          </Label>
        </div>
      )}

      {questionGroups.map((group, groupIndex) => (
        <div key={group[0].id + "-group"} className="space-y-6">
          <QuestionCsvUploader
            questionType={getUploaderQuestionType(group[0].type)}
            criteria={criteria}
            onImport={(importedQuestions) => {
              setQuestionGroups((prev) =>
                prev.map((existingGroup, i) => {
                  if (i !== groupIndex) return existingGroup;

                  const mappedQuestions = importedQuestions.map((data) => ({
                    id: crypto.randomUUID(),
                    type: group[0].type,
                    data: data as MCQData | GapFillData | QAData,
                  }));

                  const firstQuestion = existingGroup[0];

                  const shouldReplaceFirst =
                    firstQuestion && isEmptyQuestionData(firstQuestion.data);

                  if (shouldReplaceFirst) {
                    return [
                      {
                        ...firstQuestion,
                        id: crypto.randomUUID(),
                        data: mappedQuestions[0].data,
                      },
                      ...mappedQuestions.slice(1),
                    ];
                  }

                  return [...existingGroup, ...mappedQuestions];
                }),
              );
            }}
          />

          {group.map((q) => (
            <div key={q.id} className="relative">
              {renderQuestion(q, groupIndex)}

              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 text-red-400 hover:text-red-600"
                onClick={() => removeFromGroup(groupIndex, q.id)}
              >
                Remove
              </Button>
            </div>
          ))}

          <Button
            variant="outline"
            className="w-full border-dashed rounded-lg h-11 flex items-center gap-2"
            onClick={() => addToGroup(groupIndex)}
          >
            <Plus className="w-4 h-4" />
            {getAddLabel(group[0].type)}
          </Button>
        </div>
      ))}

      {remainingTypes.length > 0 && (
        <Select
          key={selectKey}
          onValueChange={(v) => {
            if (!v) return;
            addGroup(v as QuestionType);
            setSelectKey((k) => k + 1);
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Question Type" />
          </SelectTrigger>

          <SelectContent>
            {remainingTypes.includes("mcq") && (
              <SelectItem value="mcq">MCQ</SelectItem>
            )}

            {remainingTypes.includes("gapfill") && (
              <SelectItem value="gapfill">Gap Fill</SelectItem>
            )}

            {remainingTypes.includes("qa") && (
              <SelectItem value="qa">Question Answer</SelectItem>
            )}
          </SelectContent>
        </Select>
      )}

      <Button onClick={handleSubmit} disabled={isPending} className="w-full">
        {isPending ? "Creating..." : "Create Task"}
      </Button>
    </div>
  );
};
