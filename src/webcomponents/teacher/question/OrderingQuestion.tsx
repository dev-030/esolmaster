"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, X, ArrowUp, ArrowDown, Plus, ListOrdered } from "lucide-react";
import { cn } from "@/lib/utils";
import { EditorMode } from "../wrapper/allShared";
import { PercentageBar } from "../wrapper/PercentageBar";
import { CriteriaInfiniteSelect } from "./CriteriaInfiniteSelect";

export interface OrderingData {
  question: string;
  items: string[];
  criterionId?: string;
}

interface Props {
  mode?: EditorMode;
  initialData?: OrderingData;
  percentage?: number;
  onSave?: (data: OrderingData) => void;
  onCancel?: () => void;
  showCriterion?: boolean;
}

const DEFAULT: OrderingData = { question: "", items: ["", "", ""] };

export const OrderingQuestion = ({
  mode = "create",
  initialData = DEFAULT,
  percentage,
  onSave,
  onCancel,
  showCriterion = false,
}: Props) => {
  const [currentMode, setCurrentMode] = useState<EditorMode>(mode);
  const [data] = useState<OrderingData>(initialData);
  const [draft, setDraft] = useState<OrderingData>(initialData);

  const isDisabled = currentMode === "disabled";
  const isEditing = currentMode === "edit" || currentMode === "create";

  const active = isDisabled ? data : draft;

  const handleSave = (updates: Partial<OrderingData>) => {
    const updated = { ...draft, ...updates };
    setDraft(updated);
    onSave?.(updated);
  };

  const setItem = (i: number, value: string) => {
    const items = [...draft.items];
    items[i] = value;
    handleSave({ items });
  };

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= draft.items.length) return;
    const items = [...draft.items];
    [items[i], items[j]] = [items[j], items[i]];
    handleSave({ items });
  };

  const addItem = () => handleSave({ items: [...draft.items, ""] });

  const removeItem = (i: number) => {
    if (draft.items.length <= 2) return;
    handleSave({ items: draft.items.filter((_, idx) => idx !== i) });
  };

  return (
    <Card className={cn("transition-all", isDisabled && "bg-muted/30")}>
      <CardHeader className="pb-3 flex flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
            <ListOrdered className="w-4 h-4 text-indigo-600" />
          </div>
          <div>
            <p className="text-sm font-semibold">Ordering</p>
            <p className="text-xs text-muted-foreground">
              Enter items in the correct order — students see them shuffled and
              reorder to match.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Badge variant={isDisabled ? "secondary" : "info"} className="text-[10px]">
            {currentMode === "create" ? "New" : currentMode === "edit" ? "Editing" : "Saved"}
          </Badge>
          {isDisabled && (
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7"
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

      <CardContent className="space-y-4">
        {/* Instruction */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Instruction</Label>
          {isDisabled ? (
            <div className="rounded-md border bg-muted/60 px-3 py-2 text-sm">
              {active.question || (
                <span className="text-muted-foreground/60 italic">No instruction</span>
              )}
            </div>
          ) : (
            <Input
              placeholder="e.g. Put the steps of the water cycle in order"
              value={draft.question}
              onChange={(e) => handleSave({ question: e.target.value })}
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

        {/* Items */}
        <div className="space-y-2">
          <Label className="text-xs font-semibold">Correct Order</Label>
          {active.items.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="w-6 h-6 shrink-0 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold flex items-center justify-center">
                {i + 1}
              </span>
              {isDisabled ? (
                <div className="flex-1 rounded-md border bg-white px-3 py-1.5 text-sm">
                  {item || <span className="text-muted-foreground/50 italic">Empty</span>}
                </div>
              ) : (
                <>
                  <Input
                    className="flex-1"
                    value={item}
                    onChange={(e) => setItem(i, e.target.value)}
                    placeholder={`Item ${i + 1}`}
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7"
                    disabled={i === 0}
                    onClick={() => move(i, -1)}
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7"
                    disabled={i === active.items.length - 1}
                    onClick={() => move(i, 1)}
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 text-muted-foreground hover:text-destructive"
                    disabled={active.items.length <= 2}
                    onClick={() => removeItem(i)}
                  >
                    <X className="w-3.5 h-3.5" />
                  </Button>
                </>
              )}
            </div>
          ))}

          {isEditing && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={addItem}
              className="w-full border-dashed gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Add item
            </Button>
          )}
        </div>

        {isDisabled && typeof percentage === "number" && (
          <PercentageBar percentage={percentage} />
        )}

        {isEditing && currentMode === "edit" && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setDraft(data);
              setCurrentMode("disabled");
              onCancel?.();
            }}
            className="gap-1.5"
          >
            <X className="w-3.5 h-3.5" /> Cancel
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
