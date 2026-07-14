import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Star } from "lucide-react";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// const topTeachers = [
//   {
//     id: 1,
//     name: "Sophie Laurent",
//     avatar: "",
//     students: 142,
//     tasksCreated: 87,
//     avgScore: 88,
//     rating: 4.9,
//   },
//   {
//     id: 2,
//     name: "James Owens",
//     avatar: "",
//     students: 128,
//     tasksCreated: 74,
//     avgScore: 83,
//     rating: 4.7,
//   },
//   {
//     id: 3,
//     name: "Carlos Ruiz",
//     avatar: "",
//     students: 116,
//     tasksCreated: 68,
//     avgScore: 79,
//     rating: 4.6,
//   },
//   {
//     id: 4,
//     name: "Lucas Martin",
//     avatar: "",
//     students: 104,
//     tasksCreated: 61,
//     avgScore: 75,
//     rating: 4.4,
//   },
//   {
//     id: 5,
//     name: "Priya Nair",
//     avatar: "",
//     students: 97,
//     tasksCreated: 55,
//     avgScore: 71,
//     rating: 4.2,
//   },
// ];

export interface TopTeacher {
  id: string;
  name: string;
  avatar: string | null;
  students: number;
  tasksCreated: number;
  avgScore: number; // percentage
  rating: number;   // out of 5
}

export const TopTeachersTable = ({ topTeachers }: { topTeachers: TopTeacher[] }) => {
  console.log("Top Teachers Data:", topTeachers); // Debug log
  return (
  <Card className="rounded-2xl border border-gray-100 shadow-sm">
    <CardHeader className="pb-3">
      <CardTitle className="text-base font-semibold text-gray-800">
        Top Performing Teachers
      </CardTitle>
    </CardHeader>
    <CardContent className="p-0">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              {[
                "Teacher",
                "Students",
                "Tasks Created",
                "Avg. Student Score",
                "Rating",
              ].map((h) => (
                <th
                  key={h}
                  className="py-3 px-5 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide first:rounded-tl-none last:rounded-tr-none"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {topTeachers.map((teacher, idx) => (
              <tr
                key={teacher.id}
                className={`border-b border-gray-100 transition-colors hover:bg-gray-50/60 ${
                  idx === topTeachers.length - 1 ? "border-b-0" : ""
                }`}
              >
                {/* Teacher */}
                <td className="py-3.5 px-5">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 shrink-0">
                      {teacher.avatar && <AvatarImage src={teacher.avatar} />}
                      <AvatarFallback className="text-xs font-semibold bg-primary/10 text-primary">
                        {getInitials(teacher.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-semibold text-gray-800">
                      {teacher.name}
                    </span>
                  </div>
                </td>

                {/* Students */}
                <td className="py-3.5 px-5">
                  <span className="text-sm text-gray-700 font-medium">
                    {teacher.students}
                  </span>
                </td>

                {/* Tasks Created */}
                <td className="py-3.5 px-5">
                  <span className="text-sm text-gray-700 font-medium">
                    {teacher.tasksCreated}
                  </span>
                </td>

                {/* Avg. Student Score */}
                <td className="py-3.5 px-5">
                  <div className="flex items-center gap-3 min-w-35">
                    <Progress value={teacher.avgScore} className="h-2 flex-1" />
                    <span className="text-xs font-semibold text-gray-600 w-9 shrink-0">
                      {teacher.avgScore}%
                    </span>
                  </div>
                </td>

                {/* Rating */}
                <td className="py-3.5 px-5">
                  <div className="flex items-center gap-1">
                    <Star size={14} className="text-amber-400 fill-amber-400" />
                    <span className="text-sm font-semibold text-gray-700">
                      {teacher.rating}
                    </span>
                    <span className="text-xs text-gray-400">/5.0</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </CardContent>
  </Card>
)};
