import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";
import { VocabSuggestionInput } from "./VocubularySuggestion";
import { VocabSuggestion } from "./allShared";

interface CorrectToggleInputProps {
  value: string;
  onChange: (value: string) => void;
  isCorrect: boolean;
  onToggleCorrect: () => void;
  placeholder?: string;
  disabled?: boolean;
  useVocabSuggestion?: boolean;
  onSelectSuggestion?: (s: VocabSuggestion) => void;
  suggestions?: VocabSuggestion[];
  onSearchSuggestion?: (value: string) => void;
}

export function CorrectToggleInput({
  value, onChange, isCorrect, onToggleCorrect,
  placeholder, disabled, useVocabSuggestion, onSelectSuggestion, suggestions, onSearchSuggestion,
}: CorrectToggleInputProps) {
  return (
    <div className="relative flex items-center gap-2 w-full">
      <div className="flex-1">
        {useVocabSuggestion ? (
          <VocabSuggestionInput
            value={value}
            onChange={onChange}
            onSelectSuggestion={onSelectSuggestion}
            placeholder={placeholder}
            disabled={disabled}
            suggestions={suggestions}
            onSearchSuggestion={onSearchSuggestion}
            className={cn(
              "pr-2 transition-all",
              isCorrect && "border-emerald-500 bg-emerald-50 text-emerald-800 font-medium focus-visible:ring-emerald-500"
            )}
          />
        ) : (
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
              "transition-all",
              isCorrect && "border-emerald-500 bg-emerald-50 text-emerald-800 font-medium focus-visible:ring-emerald-500"
            )}
          />
        )}
      </div>
      <button
        type="button"
        onClick={onToggleCorrect}
        disabled={disabled}
        title={isCorrect ? "Unmark as correct" : "Mark as correct answer"}
        className={cn(
          "shrink-0 w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all",
          isCorrect
            ? "border-emerald-500 bg-emerald-500 text-white shadow-sm"
            : "border-border text-muted-foreground/40 hover:border-emerald-400 hover:text-emerald-500",
          disabled && "opacity-50 pointer-events-none"
        )}
      >
        <CheckCircle2 className="w-4 h-4" />
      </button>
    </div>
  );
}
