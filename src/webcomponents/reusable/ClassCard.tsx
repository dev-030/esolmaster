import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Class } from "@/types/class";
import { ArrowRight, ClipboardList, Pencil, Trash2, Users } from "lucide-react";
import Link from "next/link";

export const ClassCard = ({
  cls,
  isTeacher,
  onEdit,
  onDelete,
  role,
}: {
  cls: Class;
  isTeacher: boolean;
  role: "teacher" | "student" | "admin";
  onEdit: () => void;
  onDelete: () => void;
}) => {
  return (
    <Card
      className="group hover:shadow-md transition-all duration-200 overflow-hidden p-0
    "
    >
      {/* Color bar */}
      <div className="h-2.5 w-full" style={{ backgroundColor: cls.color }} />

      <CardContent className="p-5 space-y-4">
        {/* Top row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-sm"
              style={{ backgroundColor: cls.color }}
            >
              {cls.name[0]}
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-sm text-foreground leading-tight truncate">
                {cls.name}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {cls.subject}
              </p>
            </div>
          </div>

          {isTeacher && (
            <div className="flex gap-1 shrink-0">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.preventDefault();
                  onEdit();
                }}
              >
                <Pencil className="w-3.5 h-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity hover:text-destructive hover:bg-destructive/10"
                onClick={(e) => {
                  e.preventDefault();
                  onDelete();
                }}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          )}
        </div>

        {/* Description */}
        {cls.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {cls.description}
          </p>
        )}

        {/* Stats */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          {role === "teacher" && (
            <span className="flex items-center gap-1.5">
              <ClipboardList className="w-3.5 h-3.5" />
              {cls.taskCount} tasks
            </span>
          )}
        </div>

        {/* Teacher name */}
        <p className="text-[11px] text-muted-foreground/70">
          {cls.teacherName}
        </p>

        {/* CTA */}
        <Link
          href={
            role === "teacher"
              ? `/classes/${cls.id}/students`
              : `/classes/${cls.id}/tasks`
          }
          className="block"
        >
          <Button variant="outline" size="sm" className="w-full gap-2 mt-1">
            Open Class
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};
