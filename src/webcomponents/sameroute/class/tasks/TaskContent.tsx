"use client";

import { Button } from "@/components/ui/button";
import { TaskContentSection } from "@/types";

interface TaskContentProps {
  section: TaskContentSection;
  onStart: () => void;
}

export const TaskContent = ({ section, onStart }: TaskContentProps) => {
  return (
    <div className="space-y-6 max-w-3xl">

      <div>
        <h1 className="text-xl font-semibold">
          {section.title}
        </h1>

        {section.description && (
          <p className="text-muted-foreground mt-1">
            {section.description}
          </p>
        )}
      </div>

      <div className="bg-muted rounded-lg p-5 text-sm leading-relaxed whitespace-pre-line">
        {section.content}
      </div>

      <Button onClick={onStart}>
        Start Questions
      </Button>

    </div>
  );
};