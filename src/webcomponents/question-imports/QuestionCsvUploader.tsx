/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Upload, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { parseQuestionCsv } from "./questionCsvParsers";
import { AppQuestionType, ImportedQuestionData } from "./questionTypes";

export interface Criterion {
  id: string;
  code: string;
  description: string;
}

interface QuestionCsvUploaderProps {
  questionType: AppQuestionType;
  onImport: (questions: ImportedQuestionData[]) => void;
  criteria?: Criterion[];
}

const normalizeText = (value?: string) => {
  return value?.trim().toLowerCase() ?? "";
};

const attachCriterionIds = (
  questions: ImportedQuestionData[],
  criteria: Criterion[] = [],
): ImportedQuestionData[] => {
  return questions.map((question) => {
    const q = question as ImportedQuestionData & {
      criterionText?: string;
      criterion?: string;
    };

    const csvCriterionText = q.criterionText ?? q.criterion;

    if (!csvCriterionText) return question;

    const matchedCriterion = criteria.find(
      (criterion) =>
        normalizeText(criterion.description) ===
          normalizeText(csvCriterionText) ||
        normalizeText(criterion.code) === normalizeText(csvCriterionText),
    );

    const { criterionText, criterion, ...rest } = q;

    return {
      ...rest,
      criterionId: matchedCriterion?.id,
    } as ImportedQuestionData;
  });
};

const templates: Record<AppQuestionType, string> = {
  mcq: `question,optionA,optionB,optionC,optionD,correctIndex,explanation,criterion
What is the writer's main purpose?,Inform,Persuade,Entertain,Describe,0,The passage mainly gives information.,Identify main idea
What does the word rapid mean?,Slow,Fast,Weak,Silent,1,Rapid means fast.,Understand vocabulary in context
What happened first in the passage?,Event A,Event B,Event C,Event D,0,Event A happened first.,Sequence events
Why did the character leave?,To study,To work,To travel,To rest,1,The passage says the character left to work.,Find specific information
What can we infer about the speaker?,Happy,Angry,Nervous,Confident,2,The speaker shows signs of nervousness.,Make inferences`,

  "gap-fill": `question,optionA,optionB,optionC,optionD,correctIndex,explanation,criterion
The boy ___ the answer carefully.,read,reads,reading,reader,1,Reads agrees with the singular subject.,Grammar in context
She was ___ because the test was difficult.,excited,nervous,bored,relaxed,1,Nervous fits the meaning of the sentence.,Understand vocabulary in context
The story took place ___ winter.,on,in,at,by,1,We use in with seasons.,Grammar in context
He ___ the door before leaving.,close,closed,closing,closes,1,Closed is the correct past tense form.,Grammar in context
The train arrived ___ than expected.,early,earlier,earliest,more early,1,Earlier is the correct comparative form.,Understand sentence meaning`,

  "question-answer": `question,answer,criterion
Why did the character go to the city?,To find work,Find specific information
What is the main idea of the passage?,Hard work can lead to success,Identify main idea
What does the word drought mean?,A long period without rain,Understand vocabulary in context
How did the girl feel at the end?,She felt proud,Make inferences
Where did the story take place?,In a small village,Find specific information`,

  matching: `question,left,right,criterion
Match the words with their meanings,Rapid,Fast,Understand vocabulary in context
Match the words with their meanings,Ancient,Very old,Understand vocabulary in context
Match the words with their meanings,Journey,Trip,Understand vocabulary in context
Match the words with their meanings,Silent,Quiet,Understand vocabulary in context
Match the words with their meanings,Brave,Courageous,Understand vocabulary in context`,

  "word-spelling": `question,answer,criterion
Spell the word for a long period without rain,Drought,Understand vocabulary in context
Spell the word meaning very cold,Freezing,Understand vocabulary in context
Spell the word for a place where books are kept,Library,Understand vocabulary in context
Spell the word meaning to receive knowledge,Learn,Understand vocabulary in context
Spell the word for a person who teaches students,Teacher,Understand vocabulary in context`,
  "word-box": `question,word,sentence,explanation,criterion
Fill the blanks using the words,go,He ___ to school every day.,Use correct verb form,Grammar in context
Fill the blanks using the words,eat,They ___ dinner together.,Use correct verb form,Grammar in context
Fill the blanks using the words,drink,She ___ water after running.,Use correct verb form,Grammar in context
Fill the blanks using the words,play,The children ___ football.,Use correct verb form,Grammar in context`,
};

export const QuestionCsvUploader = ({
  questionType,
  onImport,
  criteria = [],
}: QuestionCsvUploaderProps) => {
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const text = await file.text();

    const parsed = parseQuestionCsv(text, questionType);
    const parsedWithCriteria = attachCriterionIds(parsed, criteria);

    onImport(parsedWithCriteria);

    event.target.value = "";
  };

  const downloadTemplate = () => {
    const csv = templates[questionType];

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${questionType}-sample.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  return (
    <div className="rounded-lg border border-dashed bg-white p-4 flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-semibold">Upload CSV</p>

        <p className="text-xs text-muted-foreground">
          Import {questionType.replace("-", " ")} questions
        </p>

        {(questionType === "mcq" || questionType === "gap-fill") && (
          <p className="mt-1 text-[11px] text-muted-foreground">
            correctIndex: 0 = A, 1 = B, 2 = C, 3 = D
          </p>
        )}

        <p className="mt-1 text-[11px] text-muted-foreground">
          For reading tasks, use criterion text or code in the{" "}
          <span className="font-medium">criterion</span> column.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <label className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm cursor-pointer hover:bg-accent hover:text-accent-foreground">
          <Upload className="w-4 h-4 mr-2" />
          Choose CSV
          <input
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={downloadTemplate}
        >
          <Download className="w-4 h-4 mr-2" />
          Sample CSV
        </Button>
      </div>
    </div>
  );
};
