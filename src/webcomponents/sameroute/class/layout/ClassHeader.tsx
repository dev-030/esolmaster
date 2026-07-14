import { BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ClassDetails } from "@/types/class";

export const ClassHeader = ({ classDetails }: { classDetails: ClassDetails }) => {

  if (!classDetails) return null;

  return (
    <Card className="overflow-hidden rounded-2xl shadow-md border-0 p-0">
      {/* Color Banner */}
      <div
        className="h-6 w-full"
        style={{ backgroundColor: classDetails.color }}
      />

      {/* Content */}
      <CardContent className="px-6 py-4 space-y-1">
        {/* Class Name */}
        <h2 className="text-xl font-bold text-gray-900 leading-tight">
          {classDetails.name}
        </h2>

        {/* Subject + Teacher */}
        <div className="flex items-center gap-1.5 text-sm text-gray-500">
          <BookOpen className="w-4 h-4 shrink-0 text-gray-400" />
          <span>{classDetails.subject}</span>
          <span className="text-gray-300">·</span>
          <span>{classDetails.teacherName}</span>
        </div>
      </CardContent>
    </Card>
  );
};
