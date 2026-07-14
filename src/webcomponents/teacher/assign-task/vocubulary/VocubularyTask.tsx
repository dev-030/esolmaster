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
import { Plus } from "lucide-react";

import {
  GapFillData,
  GapFillMCQQuestion,
} from "../../question/GapFillMCQQuestion";

import {
  MatchingQuestion,
  MatchingQuestionData,
} from "../../question/MatchingQustion";

import { WordSpelling, WordSpellingData } from "../../question/WordSpelling";

import { MCQData, MCQQuestion } from "../../question/MCQQuestion";

import { VocabularyWord, VocabWordData } from "./VocubularyWord";

import {
  useAddQuestionsMutation,
  useCreateTaskMutation,
  useGetTaskWordsForSearch,
} from "@/api/task";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useRouter, useSearchParams } from "next/navigation";

import { TaskWordsList } from "./TaskWords";
import { useDebounce } from "@/hooks/useDebounce";
import { buildPayload } from "./buildpayload";
import { toast } from "sonner";

import { QAData } from "../..";
import {
  isEmptyQuestionData,
  QuestionCsvUploader,
} from "@/webcomponents/question-imports";

type QuestionType = "mcq" | "gapfill" | "matching" | "spelling" | "qa";

export interface QuestionItem {
  id: string;
  type: QuestionType;
  data:
    | MCQData
    | GapFillData
    | MatchingQuestionData
    | WordSpellingData
    | QAData;
}

const DEFAULT_QUESTIONS: QuestionItem[][] = [];
const DEFAULT_VOCAB_DATA: VocabWordData[] = [];

const getDefaultQuestionData = (
  type: QuestionType,
): MCQData | GapFillData | MatchingQuestionData | WordSpellingData | QAData => {
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

   case "matching":
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

    case "spelling":
      return {
        question: "",
        answer: "",
      };

    case "qa":
      return {
        question: "",
        answer: "",
      };

    default:
      return {
        question: "",
        answer: "",
      };
  }
};

export const VocubularyTask = () => {
  const [words, setWords] = useState([{ id: crypto.randomUUID() }]);

  const [questionGroups, setQuestionGroups] = useState<QuestionItem[][]>([]);

  const [selectKey, setSelectKey] = useState(0);

  const [vocabData, setVocabData] =
    useState<VocabWordData[]>(DEFAULT_VOCAB_DATA);

  const [title, setTitle] = useState("");

  const { mutateAsync: createTask, isPending: isCreatingTask } =
    useCreateTaskMutation();

  const router = useRouter();
  const searchParams = useSearchParams();

  const taskId = searchParams.get("taskId");

  const [search, setSearch] = useState("");

  const debouncedSearch = useDebounce(search, 300);

  const { data: wordsInTask } = useGetTaskWordsForSearch(
    taskId ?? "",
    debouncedSearch,
  );

  const { mutateAsync: addQuestions, isPending } = useAddQuestionsMutation(
    taskId ?? "",
  );

  const addWord = () => {
    setWords((prev) => [...prev, { id: crypto.randomUUID() }]);
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

  const removeFromGroup = (groupIndex: number, questionId: string) => {
    setQuestionGroups((prev) =>
      prev
        .map((group, i) =>
          i === groupIndex ? group.filter((q) => q.id !== questionId) : group,
        )
        .filter((group) => group.length > 0),
    );
  };

  const handleWordSave = (data: VocabWordData) => {
    setVocabData((prev) => {
      const exists = prev.find((w) => w.id === data.id);

      if (exists) {
        return prev.map((w) => (w.id === data.id ? data : w));
      }

      return [...prev, data];
    });
  };

  const updateQuestionData = (
    groupIdx: number,
    questionId: string,
    data:
      | MCQData
      | GapFillData
      | MatchingQuestionData
      | WordSpellingData
      | QAData,
  ) => {
    setQuestionGroups((prev) =>
      prev.map((group, i) =>
        i === groupIdx
          ? group.map((q) => (q.id === questionId ? { ...q, data } : q))
          : group,
      ),
    );
  };

  const handleSubmit = async () => {
    const formData = new FormData();

    formData.append("title", title);
    formData.append("type", "VOCABULARY");

    vocabData.forEach((word, index) => {
      formData.append(`words[${index}][wordName]`, word.word);

      formData.append(`words[${index}][definition]`, word.definition);

      if (word.imageFile) {
        formData.append(`images`, word.imageFile);
      }
    });

    createTask(formData, {
      onSuccess: (data) => {
        setVocabData(DEFAULT_VOCAB_DATA);

        toast.success("Vocabulary Task created successfully!");

        router.replace(`vocubulary/?taskId=${data.id}`);
      },
    });
  };

  const handleAddQuestions = async () => {
    const payload = buildPayload({
      questionGroups,
    });

    await addQuestions(payload, {
      onSuccess: () => {
        setQuestionGroups(DEFAULT_QUESTIONS);

        toast.success("Questions added successfully!");

        router.replace("vocubulary");
      },
    });
  };

  const usedTypes = questionGroups.map((g) => g[0].type);

  const remainingTypes = (
    ["mcq", "gapfill", "matching", "spelling"] as QuestionType[]
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
            vocabSuggestions={wordsInTask ?? []}
            onSearchSuggestion={setSearch}
            useVocabSuggestions
          />
        );

      case "matching":
        return (
          <MatchingQuestion
            key={q.id}
            mode="create"
            initialData={q.data as MatchingQuestionData}
            onSave={(newData) => updateQuestionData(groupIndex, q.id, newData)}
            vocabSuggestions={wordsInTask ?? []}
            onSearchSuggestion={setSearch}
          />
        );

      case "spelling":
        return (
          <WordSpelling
            key={q.id}
            mode="create"
            initialData={q.data as WordSpellingData}
            onSave={(newData) => updateQuestionData(groupIndex, q.id, newData)}
          />
        );

      case "mcq":
      default:
        return (
          <MCQQuestion
            key={q.id}
            mode="create"
            initialData={q.data as MCQData}
            useVocabSuggestions
            vocabSuggestions={wordsInTask ?? []}
            onSearchSuggestion={setSearch}
            onSave={(newData) => updateQuestionData(groupIndex, q.id, newData)}
          />
        );
    }
  };

  const getAddLabel = (type: QuestionType) => {
    switch (type) {
      case "gapfill":
        return "Add Gap Fill Question";

      case "matching":
        return "Add Matching Question";

      case "spelling":
        return "Add Word Spelling Question";

      default:
        return "Add MCQ Question";
    }
  };

  return (
    <div className="space-y-10">
      {!taskId ? (
        <>
          <div className="space-y-2 bg-white p-4 rounded-lg shadow">
            <Label>Title</Label>

            <Input
              placeholder="Task Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-4">
            {words.map((w) => (
              <VocabularyWord
                key={w.id}
                initialData={{
                  id: w.id,
                  word: "",
                  definition: "",
                  imageUrl: "",
                }}
                onSave={handleWordSave}
              />
            ))}

            <Button
              variant="outline"
              className="w-full border-dashed rounded-lg h-12 flex items-center gap-2"
              onClick={addWord}
            >
              <Plus className="w-4 h-4" />
              Add Vocabulary Word
            </Button>

            <Button
              onClick={handleSubmit}
              className={vocabData.length === 0 ? "hidden" : ""}
              disabled={vocabData.length === 0 || isCreatingTask}
            >
              {isCreatingTask ? "Saving..." : "Save All Words"}
            </Button>
          </div>
        </>
      ) : (
        <TaskWordsList />
      )}

      {taskId && (
        <div className="space-y-10">
          {questionGroups.map((group, groupIndex) => (
            <div key={group[0].id + "-group"} className="space-y-6">
              <QuestionCsvUploader
                questionType={
                  group[0].type === "gapfill"
                    ? "gap-fill"
                    : group[0].type === "spelling"
                      ? "word-spelling"
                      : group[0].type === "qa"
                        ? "question-answer"
                        : group[0].type
                }
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
                        firstQuestion &&
                        isEmptyQuestionData(firstQuestion.data);

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

                {remainingTypes.includes("matching") && (
                  <SelectItem value="matching">Matching</SelectItem>
                )}

                {remainingTypes.includes("spelling") && (
                  <SelectItem value="spelling">Word Spelling</SelectItem>
                )}
              </SelectContent>
            </Select>
          )}

          <div className="flex justify-end p-6 border-t">
            <Button
              size="lg"
              onClick={handleAddQuestions}
              disabled={questionGroups.length === 0 || isPending}
            >
              {isPending ? "Creating..." : "Create Vocabulary Task"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
