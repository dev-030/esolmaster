"use client";

import { useEffect, useState } from "react";
import Xarrow, { Xwrapper } from "react-xarrows";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, X } from "lucide-react";

import { VocabSuggestionInput } from "../wrapper/VocubularySuggestion";
import { PercentageBar } from "../wrapper/PercentageBar";
import { EditorMode, VocabSuggestion } from "../wrapper/allShared";
import { CriteriaInfiniteSelect } from "./CriteriaInfiniteSelect";

type RightItem =
  | { type: "definition"; value: string }
  | { type: "image"; value: string };

export interface MatchingQuestionData {
  question: string;
  leftItems: string[];
  rightItems: RightItem[];
  matches: Record<number, number>;
  criterionId?: string;
}

interface Props {
  mode?: EditorMode;
  initialData?: MatchingQuestionData;
  percentage?: number;
  onSave?: (data: MatchingQuestionData) => void;
  onCancel?: () => void;
  vocabSuggestions?: VocabSuggestion[];
  onSearchSuggestion?: (value: string) => void;
  showCriterion?: boolean;
}

const DEFAULT: MatchingQuestionData = {
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

export const MatchingQuestion = ({
  mode = "create",
  initialData = DEFAULT,
  percentage,
  onSave,
  onCancel,
  vocabSuggestions,
  onSearchSuggestion,
  showCriterion = false,
}: Props) => {
  const [currentMode, setCurrentMode] = useState<EditorMode>(mode);
  const [data] = useState(initialData);
  const [draft, setDraft] = useState(initialData);

  // The left item currently "armed" for connecting (chosen by clicking its dot).
  const [activeLeft, setActiveLeft] = useState<number | null>(null);

  const isDisabled = currentMode === "disabled";
  const isEditing = currentMode === "edit" || currentMode === "create";

  // Clear the armed selection with Escape for keyboard users.
  useEffect(() => {
    if (activeLeft === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveLeft(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeLeft]);

  const handleSave = (updates: Partial<MatchingQuestionData>) => {
    const updated = { ...draft, ...updates };
    setDraft(updated);
    onSave?.(updated);
  };

  const setLeft = (i: number, value: string) => {
    const left = [...draft.leftItems];
    left[i] = value;
    handleSave({ leftItems: left });
  };

  const setRight = (i: number, value: RightItem) => {
    const right = [...draft.rightItems];
    right[i] = value;
    handleSave({ rightItems: right });
  };

  const handleAddPair = () => {
    const newLeftItems = [...draft.leftItems, ""];
    const newRightItems = [
      ...draft.rightItems,
      { type: "definition" as const, value: "" },
    ];
    handleSave({ leftItems: newLeftItems, rightItems: newRightItems });
  };

  // Which right index a given left is matched to (or undefined).
  const rightOfLeft = (leftIndex: number): number | undefined =>
    draft.matches[leftIndex];

  // Which left index is matched to a given right (or null).
  const leftOfRight = (rightIndex: number): number | null => {
    const entry = Object.entries(draft.matches).find(
      ([, r]) => r === rightIndex,
    );
    return entry ? Number(entry[0]) : null;
  };

  const removeMatchForLeft = (leftIndex: number) => {
    if (draft.matches[leftIndex] === undefined) return;
    const newMatches = { ...draft.matches };
    delete newMatches[leftIndex];
    handleSave({ matches: newMatches });
  };

  // Clicking a LEFT connector dot arms/disarms that row.
  const onLeftDot = (i: number) => {
    if (!isEditing) return;
    setActiveLeft((prev) => (prev === i ? null : i));
  };

  // Clicking a RIGHT connector dot either connects the armed left, or (if
  // nothing is armed) unmatches whatever is currently linked to it.
  const onRightDot = (j: number) => {
    if (!isEditing) return;

    if (activeLeft === null) {
      // No left armed → treat a click on a linked right dot as "disconnect".
      const linkedLeft = leftOfRight(j);
      if (linkedLeft !== null) removeMatchForLeft(linkedLeft);
      return;
    }

    // If this exact pair already exists, clicking again disconnects it.
    if (draft.matches[activeLeft] === j) {
      removeMatchForLeft(activeLeft);
      setActiveLeft(null);
      return;
    }

    // Build the new match, freeing both endpoints first (one-to-one).
    const newMatches = { ...draft.matches };
    const previousOwner = leftOfRight(j); // some other left owning this right
    if (previousOwner !== null) delete newMatches[previousOwner];
    delete newMatches[activeLeft]; // drop the armed left's old target
    newMatches[activeLeft] = j;

    handleSave({ matches: newMatches });
    setActiveLeft(null);
  };

  const active = isDisabled ? data : draft;

  const dotBase =
    "shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors";

  return (
    <Card className="w-full">
      <CardHeader className="flex justify-between items-center">
        <div>
          <p className="text-sm font-semibold">Matching Question</p>
          <p className="text-xs text-muted-foreground">
            Click a dot on the left, then a dot on the right to connect them.
            Click a connected dot (or the ✕) to remove a link.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant={isDisabled ? "secondary" : "success"}>
            {currentMode === "create"
              ? "New"
              : currentMode === "edit"
                ? "Editing"
                : "Saved"}
          </Badge>

          {isDisabled && (
            <Button
              size="icon"
              variant="ghost"
              onClick={() => {
                setDraft(data);
                setCurrentMode("edit");
              }}
            >
              <Pencil className="w-3.5 h-3.5" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Question */}
        <div className="space-y-1">
          <Label className="text-xs font-semibold">Instruction</Label>

          {isDisabled ? (
            <div className="border rounded px-3 py-2 bg-muted/60 text-sm">
              {active.question}
            </div>
          ) : (
            <Input
              value={draft.question}
              onChange={(e) => handleSave({ question: e.target.value })}
              placeholder="Match words with definitions"
            />
          )}
        </div>

        {showCriterion && (
          <CriteriaInfiniteSelect
            value={draft.criterionId}
            disabled={isDisabled}
            onChange={(criterionId) => handleSave({ criterionId })}
          />
        )}

        {isEditing && activeLeft !== null && (
          <p className="text-xs text-emerald-600 font-medium">
            Item {activeLeft + 1} selected — now click a dot on the right to
            connect, or press Esc to cancel.
          </p>
        )}

        <Xwrapper>
          <div className="grid grid-cols-2 gap-16 relative">
            {/* LEFT */}
            <div className="space-y-3">
              <p className="text-xs font-bold text-center text-muted-foreground">
                LEFT
              </p>

              {active.leftItems.map((item, i) => {
                const matchedRight = rightOfLeft(i);
                const isMatched = matchedRight !== undefined;
                const isArmed = activeLeft === i;

                return (
                  <div
                    key={i}
                    className={`flex items-center gap-2 border rounded px-3 py-2 bg-white relative ${
                      isArmed ? "ring-2 ring-emerald-500" : ""
                    } ${isMatched ? "border-emerald-500 border-2" : ""}`}
                  >
                    <div className="flex-1">
                      {isDisabled ? (
                        item
                      ) : (
                        <VocabSuggestionInput
                          value={item}
                          suggestions={vocabSuggestions}
                          onSearchSuggestion={onSearchSuggestion}
                          onSelectSuggestion={(s) => setLeft(i, s.wordName)}
                          onChange={(newValue) => setLeft(i, newValue)}
                          placeholder={`Word ${i + 1}`}
                          disabled={isDisabled}
                        />
                      )}
                    </div>

                    {isMatched && (
                      <span className="text-[10px] font-semibold text-emerald-600">
                        → {matchedRight! + 1}
                      </span>
                    )}

                    {/* Connector dot (also the arrow anchor) */}
                    <button
                      type="button"
                      id={`left-${i}`}
                      disabled={!isEditing}
                      onClick={(e) => {
                        e.stopPropagation();
                        onLeftDot(i);
                      }}
                      title={
                        isMatched
                          ? "Click to reconnect this item"
                          : "Click to start a connection"
                      }
                      className={`${dotBase} ${
                        isArmed
                          ? "bg-emerald-500 border-emerald-500"
                          : isMatched
                            ? "border-emerald-500 bg-emerald-50"
                            : "border-slate-300 bg-white hover:border-emerald-400"
                      } ${isEditing ? "cursor-pointer" : "cursor-default"}`}
                    >
                      {isMatched && !isArmed && (
                        <span
                          role="button"
                          tabIndex={-1}
                          aria-label="Remove connection"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeMatchForLeft(i);
                          }}
                          className="flex items-center justify-center w-full h-full"
                        >
                          <X className="w-3 h-3 text-emerald-600" />
                        </span>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* RIGHT */}
            <div className="space-y-3">
              <p className="text-xs font-bold text-center text-muted-foreground">
                RIGHT
              </p>

              {active.rightItems.map((item, i) => {
                const matchedLeftIndex = leftOfRight(i);
                const isMatched = matchedLeftIndex !== null;

                return (
                  <div
                    key={i}
                    className={`flex items-center gap-2 border rounded px-3 py-2 bg-white relative ${
                      isMatched ? "border-emerald-500 border-2" : ""
                    } ${
                      activeLeft !== null
                        ? "ring-1 ring-emerald-300"
                        : ""
                    }`}
                  >
                    {/* Connector dot (also the arrow anchor) */}
                    <button
                      type="button"
                      id={`right-${i}`}
                      disabled={!isEditing}
                      onClick={(e) => {
                        e.stopPropagation();
                        onRightDot(i);
                      }}
                      title={
                        activeLeft !== null
                          ? "Click to connect the selected item here"
                          : isMatched
                            ? "Click to disconnect"
                            : "Select a left item first"
                      }
                      className={`${dotBase} ${
                        isMatched
                          ? "border-emerald-500 bg-emerald-50"
                          : "border-slate-300 bg-white hover:border-emerald-400"
                      } ${isEditing ? "cursor-pointer" : "cursor-default"}`}
                    >
                      {isMatched && (
                        <span className="text-[10px] font-semibold text-emerald-600">
                          {matchedLeftIndex! + 1}
                        </span>
                      )}
                    </button>

                    <div className="flex-1">
                      {item.type === "definition" ? (
                        <VocabSuggestionInput
                          value={item.value}
                          suggestions={vocabSuggestions}
                          onSearchSuggestion={onSearchSuggestion}
                          onSelectSuggestion={(suggestion, type) => {
                            if (type === "definition") {
                              setRight(i, {
                                type: "definition",
                                value: suggestion.definition,
                              });
                            } else if (type === "image") {
                              setRight(i, {
                                type: "image",
                                value: suggestion.imageUrl || "",
                              });
                            }
                          }}
                          onChange={(newValue) => {
                            setRight(i, { type: "definition", value: newValue });
                          }}
                          placeholder={`Option ${i + 1}`}
                          disabled={isDisabled}
                        />
                      ) : (
                        <div className="relative">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.value}
                            alt="Vocabulary"
                            className="h-20 w-full object-contain"
                          />
                          {isEditing && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="absolute top-0 right-0"
                              onClick={() =>
                                setRight(i, { type: "definition", value: "" })
                              }
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ARROWS */}
            {Object.entries(active.matches).map(([l, r]) => (
              <Xarrow
                key={`${l}-${r}`}
                start={`left-${l}`}
                end={`right-${r}`}
                strokeWidth={2}
                path="smooth"
                curveness={0.6}
                color="#10b981"
              />
            ))}
          </div>
        </Xwrapper>

        {isEditing && (
          <Button
            size="sm"
            variant="outline"
            onClick={handleAddPair}
            className="w-full"
          >
            + Add another pair
          </Button>
        )}

        {isDisabled && typeof percentage === "number" && (
          <PercentageBar percentage={percentage} />
        )}

        {isEditing && currentMode === "edit" && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setDraft(data);
              setActiveLeft(null);
              setCurrentMode("disabled");
              onCancel?.();
            }}
          >
            <X className="w-3.5 h-3.5 mr-1" />
            Cancel
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
