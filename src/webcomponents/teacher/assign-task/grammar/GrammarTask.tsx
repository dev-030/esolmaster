"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { GrammarLearning, GrammarLearningData } from "./GrammarLearning";
import { MCQData, MCQQuestion } from "../../question/MCQQuestion";
import {
  GapFillData,
  GapFillMCQQuestion,
  QAData,
  QuestionAnswer,
} from "../../question";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { transformGrammarDataToPayload } from "./payloadConvert";
import { useCreateTaskMutation } from "@/api/task";
import {
  isEmptyQuestionData,
  QuestionCsvUploader,
} from "@/webcomponents/question-imports";
import { WordBoxConfig, WordBoxQuestion } from "../../question/WordBoxMatch";

type QuestionType = "mcq" | "gapfill" | "qa" | "wordbox";

export type QuestionItem = {
  id: string;
  type: QuestionType;
  data: MCQData | GapFillData | QAData | WordBoxConfig;
};

const DEFAULT_GRAMMAR: GrammarLearningData = {
  title: "",
  explanation: "",
  entry: { entryTypes: [] },
};

const DEFAULT_QUESTIONS: QuestionItem[][] = [];

const getDefaultQuestionData = (
  type: QuestionType,
): MCQData | GapFillData | QAData | WordBoxConfig => {
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
    case "wordbox":
      return {
        question: "",
        words: ["", "", "", ""],
        sentences: [{ id: crypto.randomUUID(), text: "", answer: "" }],
        explanation: "",
      };

    default:
      return {
        question: "",
        answer: "",
      };
  }
};

export const GrammarTask = () => {
  const [questionGroups, setQuestionGroups] = useState<QuestionItem[][]>([]);
  const [selectKey, setSelectKey] = useState(0);

  const [grammarInfo, setGrammarInfo] =
    useState<GrammarLearningData>(DEFAULT_GRAMMAR);

  const { mutate: createTaskMutation } = useCreateTaskMutation();

  const handleGrammarSave = (data: GrammarLearningData) => {
    setGrammarInfo(data);
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
    data: MCQData | GapFillData | QAData | WordBoxConfig,
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

  const handleGlobalSubmit = () => {
    if (!grammarInfo.title) {
      toast.error("Please add title");
      return;
    }

    if (!grammarInfo.explanation) {
      toast.error("Please add explanation");
      return;
    }

    const payload = transformGrammarDataToPayload(grammarInfo, questionGroups);

    createTaskMutation(payload, {
      onSuccess: () => {
        toast.success("Grammar task created");

        setGrammarInfo(DEFAULT_GRAMMAR);
        setQuestionGroups(DEFAULT_QUESTIONS);
        setSelectKey((k) => k + 1);
      },
    });
  };

  const usedTypes = questionGroups.map((g) => g[0].type);

  const remainingTypes = (
    ["mcq", "gapfill", "qa", "wordbox"] as QuestionType[]
  ).filter((t) => !usedTypes.includes(t));

  const renderQuestion = (q: QuestionItem, groupIndex: number) => {
    switch (q.type) {
      case "gapfill":
        return (
          <GapFillMCQQuestion
            key={q.id}
            mode="create"
            initialData={q.data as GapFillData}
            onSave={(newData) => updateQuestionData(groupIndex, q.id, newData)}
          />
        );

      case "qa":
        return (
          <QuestionAnswer
            key={q.id}
            mode="create"
            initialData={q.data as QAData}
            onSave={(newData) => updateQuestionData(groupIndex, q.id, newData)}
          />
        );

      case "mcq":
        return (
          <MCQQuestion
            key={q.id}
            mode="create"
            initialData={q.data as MCQData}
            onSave={(newData) => updateQuestionData(groupIndex, q.id, newData)}
          />
        );

      case "wordbox":
        return (
          <WordBoxQuestion
            key={q.id}
            mode="create"
            initialData={q.data as WordBoxConfig}
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
      case "wordbox":
        return "Add Word Box Question";
    }
  };

  return (
    <div className="space-y-6 w-full">
      <GrammarLearning
        onChange={handleGrammarSave}
        mode="create"
        value={grammarInfo}
      />

      {questionGroups.map((group, groupIndex) => (
        <div key={group[0].id + "-group"} className="space-y-6">
          <QuestionCsvUploader
            questionType={
              group[0].type === "gapfill"
                ? "gap-fill"
                : group[0].type === "qa"
                  ? "question-answer"
                  : group[0].type === "wordbox"
                    ? "word-box"
                    : "mcq"
            }
            onImport={(importedQuestions) => {
              setQuestionGroups((prev) =>
                prev.map((existingGroup, i) => {
                  if (i !== groupIndex) return existingGroup;

                  const mappedQuestions = importedQuestions.map((data) => ({
                    id: crypto.randomUUID(),
                    type: group[0].type,
                    data: data as
                      | MCQData
                      | GapFillData
                      | QAData
                      | WordBoxConfig,
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

          {group[0].type !== "wordbox" && (
            <Button
              variant="outline"
              className="w-full border-dashed rounded-lg h-11 flex items-center gap-2"
              onClick={() => addToGroup(groupIndex)}
            >
              <Plus className="w-4 h-4" />
              {getAddLabel(group[0].type)}
            </Button>
          )}
        </div>
      ))}

      {remainingTypes.length > 0 && (
        <Select
          key={selectKey}
          onValueChange={(v: QuestionType | null) => {
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
            {remainingTypes.includes("wordbox") && (
              <SelectItem value="wordbox">Word Box</SelectItem>
            )}
          </SelectContent>
        </Select>
      )}

      <div className="flex justify-end p-6 border-t">
        <Button size="lg" onClick={handleGlobalSubmit}>
          Create Grammar Task
        </Button>
      </div>
    </div>
  );
};
