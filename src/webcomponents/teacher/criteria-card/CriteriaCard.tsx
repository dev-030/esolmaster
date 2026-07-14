"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

export const CriteriaCard = ({
  data,
  onEdit,
  onDelete,
}: {
  data: any;
  onEdit: (data: any) => void;
  onDelete: (id: string) => void;
}) => {
  return (
    <Card className="p-4 flex flex-col gap-3 hover:shadow-md transition">
      {/* Header */}
      <div>
        <h3 className="font-semibold text-base">{data.code}</h3>
        <p className="text-sm text-muted-foreground">
          {data.description}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => onEdit(data)}
        >
          <Pencil className="w-4 h-4 mr-1" />
          Edit
        </Button>

        <Button
          size="sm"
          variant="destructive"
          onClick={() => onDelete(data.id)}
        >
          <Trash2 className="w-4 h-4 mr-1" />
          Delete
        </Button>
      </div>
    </Card>
  );
};