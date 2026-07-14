// StudentRow.tsx
import { MoreHorizontal, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from "date-fns";
import { StudentData } from "@/types/class";
import { Progress } from "@/components/ui/progress";

interface StudentRowProps {
  student: StudentData;
  onRemove: () => void;
}

export const StudentRow = ({ student, onRemove }: StudentRowProps) => {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const joinedDate = formatDistanceToNow(new Date(student.joinedAt), { addSuffix: true });

  return (
    <tr className="hover:bg-muted/30 transition-colors">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            {student.avatarUrl ? (
              <img src={student.avatarUrl} alt={student.firstName + " " + student.lastName} />
            ) : (
              <AvatarFallback className="text-xs">
                {getInitials(student.firstName + " " + student.lastName)}
              </AvatarFallback>
            )}
          </Avatar>
          <div>
            <div className="font-medium text-foreground">{student.firstName} {student.lastName}</div>
            <div className="text-xs text-muted-foreground md:hidden">
              {student.email}
            </div>
          </div>
        </div>
      </td>
      <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">
        {student.email}
      </td>
      <td className="px-4 py-3 hidden sm:table-cell text-muted-foreground">
        @{student.username}
      </td>
      <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground">
        {joinedDate}
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2 min-w-[100px]">
          <Progress value={student.progress.progressPercentage} className="h-2" />
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {student.progress.progressPercentage}%
          </span>
        </div>
      </td>
      <td className="px-4 py-3 text-right">
        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium outline-none disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8 p-0">
            <MoreHorizontal className="w-4 h-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem 
              onClick={onRemove} 
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Remove from class
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
};