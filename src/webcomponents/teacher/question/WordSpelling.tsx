"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Save, X, Keyboard } from "lucide-react";
import { cn } from "@/lib/utils";
import { VocabSuggestionInput } from "../wrapper/VocubularySuggestion";
import { PercentageBar } from "../wrapper/PercentageBar";
import { EditorMode, VocabSuggestion } from "../wrapper/allShared";
import { DisabledField } from "@/webcomponents/reusable";
import { CriteriaInfiniteSelect } from "./CriteriaInfiniteSelect";
// ── Types ──────────────────────────────────────────────────────────────────────

export interface WordSpellingData {
  /** What the student sees — can be the definition OR word (teacher chooses) */
  prompt: string;
  /** The exact spelling the student must type */
  answer: string;
  /** Whether the prompt is the definition (show word) or the word (type definition) */
  promptType: "definition" | "word";
  criterionId?: string;
}

interface WordSpellingProps {
  mode?: EditorMode;
  initialData?: WordSpellingData;
  percentage?: number;
  onSave?: (data: WordSpellingData) => void;
  onCancel?: () => void;
  showCriterion?: boolean;
}

const DEFAULT: WordSpellingData = {
  prompt: "",
  answer: "",
  promptType: "definition",
};

// ── Component ─────────────────────────────────────────────────────────────────

export const WordSpelling = ({
  mode = "create",
  initialData = DEFAULT,
  percentage,
  onSave,
  onCancel,
  showCriterion = false,
}: WordSpellingProps) => {
  const [currentMode, setCurrentMode] = useState<EditorMode>(mode);
  const [data, setData]   = useState<WordSpellingData>(initialData);
  const [draft, setDraft] = useState<WordSpellingData>(initialData);

  const isDisabled = currentMode === "disabled";
  const isEditing  = currentMode === "edit" || currentMode === "create";

  const handleDraftUpdate = (updates: Partial<WordSpellingData>) => {
    const next = { ...draft, ...updates };
    setDraft(next);
    onSave?.(next);
  };

  const handleSave = () => {
    setData(draft);
    onSave?.(draft);
    if (currentMode === "edit") setCurrentMode("disabled");
  };

  const promptLabel  = draft.promptType === "definition" ? "Definition (shown to student)" : "Word (shown to student)";
  const answerLabel  = draft.promptType === "definition" ? "Correct Spelling (student types)" : "Correct Definition (student types)";
  const promptPlaceholder  = draft.promptType === "definition"
    ? "e.g. Any form of water falling from the sky"
    : "e.g. Precipitation";
  const answerPlaceholder  = draft.promptType === "definition"
    ? "e.g. Precipitation"
    : "e.g. Any form of water falling from the sky";

  return (
    <Card className={cn("transition-all", isDisabled && "bg-muted/30")}>
      <CardHeader className="pb-3 flex flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
            <Keyboard className="w-4 h-4 text-orange-600" />
          </div>
          <div>
            <p className="text-sm font-semibold">Word Spelling</p>
            <p className="text-xs text-muted-foreground">Type the word or definition from memory</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Badge variant={isDisabled ? "secondary" : "warning"} className="text-[10px]">
            {currentMode === "create" ? "New" : currentMode === "edit" ? "Editing" : "Saved"}
          </Badge>
          {isDisabled && (
            <Button size="icon" variant="ghost" className="h-7 w-7"
              onClick={() => { setDraft(data); setCurrentMode("edit"); }}>
              <Pencil className="w-3.5 h-3.5" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Prompt type toggle */}
        {isEditing && (
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Quiz direction</Label>
            <div className="flex gap-1 p-0.5 bg-muted rounded-lg w-fit">
              {(["definition", "word"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => handleDraftUpdate({ promptType: t })}
                  className={cn(
                    "px-3 py-1 rounded-md text-xs font-medium transition-all",
                    draft.promptType === t
                      ? "bg-background shadow text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {t === "definition" ? "Show definition → type word" : "Show word → type definition"}
                </button>
              ))}
            </div>
          </div>
        )}

        {showCriterion && (
          <CriteriaInfiniteSelect
            value={draft.criterionId}
            disabled={isDisabled}
            onChange={(criterionId) => handleDraftUpdate({ criterionId })}
          />
        )}

        {/* Prompt */}
        <div className="space-y-1.5">
          <Label className={cn("text-xs font-semibold", isDisabled && "text-muted-foreground")}>
            {isDisabled
              ? (data.promptType === "definition" ? "Definition shown to student" : "Word shown to student")
              : promptLabel}
          </Label>
          {isDisabled ? (
            <DisabledField value={data.prompt} placeholder="No prompt set" multiline />
          ) : (
            <VocabSuggestionInput
              value={draft.prompt}
              onChange={(v) => handleDraftUpdate({ prompt: v })}
              onSelectSuggestion={(s: VocabSuggestion) =>
                handleDraftUpdate({
                  prompt:
                    draft.promptType === "definition"
                      ? s.definition
                      : s.wordName,
                  answer:
                    draft.promptType === "definition"
                      ? s.wordName
                      : s.definition,
                })
              }
              placeholder={promptPlaceholder}
            />
          )}
        </div>

        {/* Expected answer */}
        <div className="space-y-1.5">
          <Label className={cn("text-xs font-semibold", isDisabled && "text-muted-foreground")}>
            {isDisabled
              ? (data.promptType === "definition" ? "Expected word spelling" : "Expected definition")
              : answerLabel}
          </Label>
          {isDisabled ? (
            <div className="rounded-md bg-emerald-50 border border-emerald-200 px-3 py-2 text-sm text-emerald-800 font-semibold tracking-wide">
              {data.answer || <span className="font-normal text-muted-foreground/50 italic text-xs">No answer set</span>}
            </div>
          ) : (
            <VocabSuggestionInput
              value={draft.answer}
              onChange={(v) => handleDraftUpdate({ answer: v })}
              onSelectSuggestion={(s: VocabSuggestion) =>
                handleDraftUpdate({
                  answer:
                    draft.promptType === "definition"
                      ? s.wordName
                      : s.definition,
                })
              }
              placeholder={answerPlaceholder}
              className="border-emerald-200 focus-visible:ring-emerald-400"
            />
          )}
        </div>

        {/* Student answer preview (disabled mode) */}
        {isDisabled && (
          <div className="rounded-lg border border-dashed border-border p-3 bg-muted/20">
            <p className="text-[11px] text-muted-foreground font-medium mb-1.5 uppercase tracking-wide">
              Student sees →
            </p>
            <p className="text-sm text-foreground leading-relaxed">
              {data.prompt || <span className="italic text-muted-foreground/50">No prompt</span>}
            </p>
            <p className="text-[11px] text-muted-foreground mt-2">
              …and types their answer in an input field.
            </p>
          </div>
        )}

        {/* Percentage bar */}
        {isDisabled && typeof percentage === "number" && <PercentageBar percentage={percentage} />}

        {/* Actions */}
        {isEditing && (
          <div className="flex gap-2 pt-1">
            {currentMode === "edit" && (
              <Button size="sm" variant="ghost" onClick={() => { setDraft(data); setCurrentMode("disabled"); onCancel?.(); }} className="gap-1.5">
                <X className="w-3.5 h-3.5" /> Cancel
              </Button>
            )}
            <Button size="sm" onClick={handleSave} className="gap-1.5 ml-auto"
              disabled={!draft.prompt.trim() || !draft.answer.trim()}>
              <Save className="w-3.5 h-3.5" />
              {currentMode === "create" ? "Save" : "Update"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};