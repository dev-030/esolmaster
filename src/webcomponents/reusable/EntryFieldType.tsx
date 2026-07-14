"use client";

import * as React from "react";
import { Label } from "@/components/ui/label";
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox";

import { cn } from "@/lib/utils";
import { DisabledField } from "./DisabledField";
import { EntryType } from "@/types/task";


export interface EntryFieldData {
  entryTypes: EntryType[];
}

export const ENTRY_TYPE_OPTIONS: { value: EntryType; label: string }[] = [
  { value: "ENTRY1", label: "Entry 1" },
  { value: "ENTRY2", label: "Entry 2" },
  { value: "ENTRY3", label: "Entry 3" },

  { value: "LEVEL1", label: "Level 1" },
  { value: "LEVEL2", label: "Level 2" },
];
interface EntryFieldProps {
  value: EntryFieldData;
  onChange: (data: EntryFieldData) => void;
  disabled?: boolean;
  className?: string;
}

export const EntryField = ({
  value,
  onChange,
  disabled = false,
  className,
}: EntryFieldProps) => {
  const anchor = useComboboxAnchor();

  const entryTypes = value.entryTypes ?? [];

  const selectedLabels = ENTRY_TYPE_OPTIONS.filter((o) =>
    entryTypes.includes(o.value),
  ).map((o) => o.label);

  return (
    <div className={cn("w-full", className)}>
      <div className="space-y-1.5">
        <Label
          className={cn(
            "text-xs font-semibold",
            disabled && "text-muted-foreground",
          )}
        >
          Entry Type
        </Label>

        {disabled ? (
          <DisabledField
            value={selectedLabels.join(", ")}
            placeholder="No entry type set"
          />
        ) : (
          <Combobox
            multiple
            autoHighlight
            items={ENTRY_TYPE_OPTIONS.map((o) => o.value)}
            value={entryTypes}
            defaultValue={[ENTRY_TYPE_OPTIONS[0].value]}
            onValueChange={(vals) =>
              onChange({ ...value, entryTypes: vals as EntryType[] })
            }
          >
            <ComboboxChips ref={anchor} className="w-full">
              <ComboboxValue>
                {(values) => (
                  <>
                    {values.length === 0 && (
                      <span className="text-muted-foreground text-sm px-1">
                        Select entry types...
                      </span>
                    )}

                    {values.map((v: string) => {
                      const label =
                        ENTRY_TYPE_OPTIONS.find((o) => o.value === v)?.label ??
                        v;

                      return <ComboboxChip key={v}>{label}</ComboboxChip>;
                    })}

                    <ComboboxChipsInput />
                  </>
                )}
              </ComboboxValue>
            </ComboboxChips>

            <ComboboxContent anchor={anchor}>
              <ComboboxEmpty>No items found.</ComboboxEmpty>
              <ComboboxList>
                {(item) => {
                  const label =
                    ENTRY_TYPE_OPTIONS.find((o) => o.value === item)?.label ??
                    item;

                  return (
                    <ComboboxItem key={item} value={item}>
                      {label}
                    </ComboboxItem>
                  );
                }}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        )}
      </div>
    </div>
  );
};
