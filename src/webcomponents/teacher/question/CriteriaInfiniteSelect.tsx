"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetCriterionInfiniteQuery } from "@/api/task";
import { cn } from "@/lib/utils";

interface CriteriaInfiniteSelectProps {
  value?: string;
  onChange: (criterionId?: string) => void;
  disabled?: boolean;
  className?: string;
}

const getCriterionLabel = (criterion: {
  id: string;
  title?: string;
  code?: string;
  description?: string;
  name?: string;
}) => {
  return (
    criterion.title?.trim() ||
    criterion.description?.trim() ||
    criterion.name?.trim() ||
    criterion.code?.trim() ||
    criterion.id
  );
};

export const CriteriaInfiniteSelect = ({
  value,
  onChange,
  disabled = false,
  className,
}: CriteriaInfiniteSelectProps) => {
  const criteriaQuery = useGetCriterionInfiniteQuery({ limit: 20 });
  const criteria = criteriaQuery.data?.pages.flatMap((page) => page.data) ?? [];

  const selectedCriterion = criteria.find((criterion) => criterion.id === value);
  const selectedCriterionLabel = selectedCriterion
    ? getCriterionLabel(selectedCriterion)
    : undefined;

  return (
    <div className={cn("space-y-1.5", className)}>
      <Label className={cn("text-xs font-semibold", disabled && "text-muted-foreground")}>
        Criterion
      </Label>

      {disabled ? (
        <div className="rounded-md bg-muted/60 border px-3 py-2 text-sm">
          {selectedCriterionLabel ?? value ?? (
            <span className="text-muted-foreground/50 italic">No criterion selected</span>
          )}
        </div>
      ) : (
        <>
          <Select value={value ?? ""} onValueChange={(next) => onChange(next || undefined)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select criterion">
                {selectedCriterionLabel ?? value}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {criteria.map((criterion) => (
                <SelectItem key={criterion.id} value={criterion.id}>
                  {getCriterionLabel(criterion)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {criteriaQuery.hasNextPage && (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="px-0 text-xs"
              onClick={() => criteriaQuery.fetchNextPage()}
              disabled={criteriaQuery.isFetchingNextPage}
            >
              {criteriaQuery.isFetchingNextPage ? "Loading more..." : "Load more criteria"}
            </Button>
          )}
        </>
      )}
    </div>
  );
};
