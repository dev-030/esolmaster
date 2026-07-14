"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";

interface NavigationButtonsProps {
  isFirst: boolean;
  isLast: boolean;
  canProceed: boolean;
  onPrev: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

export const NavigationButtons = ({
  isFirst, isLast, canProceed, onPrev, onNext, onSubmit,
}: NavigationButtonsProps) => {
  return (
    <div className="flex items-center justify-between pt-5 border-t">
      <Button
        variant="ghost"
        size="sm"
        onClick={onPrev}
        disabled={isFirst}
        className="gap-1.5"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </Button>

      {isLast ? (
        <Button
          onClick={onSubmit}
          disabled={!canProceed}
          className="gap-1.5"
        >
          <CheckCircle className="w-4 h-4" />
          Submit Task
        </Button>
      ) : (
        <Button
          onClick={onNext}
          disabled={!canProceed}
          className="gap-1.5"
        >
          Next
          <ArrowRight className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
}