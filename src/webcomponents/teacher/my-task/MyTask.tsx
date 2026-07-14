// "use client";

// import { useState } from "react";
// import { SectionHeading } from "@/webcomponents/reusable";
// import { School, Users, User } from "lucide-react";
// import { TaskCard } from "./TaskCard";
// import { useRole } from "@/provider/RoleProvider";
// import { useGetTasks } from "@/api/task";
// import { Button } from "@/components/ui/button";
// import { cn } from "@/lib/utils";
// import { TaskType } from "@/types/task";
// import { ca } from "zod/v4/locales";
// import { Criteria } from "./Criteria";

// // ── Types ────────────────────────────────────────────────────────────────────

// type TabType = "all" | "my-tasks" | "created-by-me" | "criteria";

// // ── Component ─────────────────────────────────────────────────────────────────

// export const MyTask = () => {
//   const { role, user } = useRole();
//   const [currentPage, setCurrentPage] = useState(1);
//   const [activeTab, setActiveTab] = useState<TabType>("all");
//   const limit = 10;

//   const { data: tasksData, isLoading } = useGetTasks({
//     page: currentPage,
//     limit,
//   });

//   // Filter tasks based on active tab
//   const getFilteredTasks = () => {
//     if (!tasksData?.data) return [];

//     switch (activeTab) {
//       case "my-tasks":
//         return tasksData.data;

//       case "created-by-me":
//         if (role === "admin" && user?.email) {
//           return tasksData.data.filter(
//             (task) => task.createdBy?.email === user.email,
//           );
//         }
//         return [];
//       case "criteria":
//         return <Criteria />



//       default:
//         return tasksData.data;
//     }
//   };

//   const filteredTasks = getFilteredTasks();
//   const totalTasks = tasksData?.meta?.total || 0;
//   const totalPages = Math.ceil(totalTasks / limit);

//   const handlePageChange = (page: number) => {
//     setCurrentPage(page);
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   // Tab configuration
//   const tabs = [
//     { id: "my-tasks" as const, label: "Tasks", icon: User },
//     ...(role === "admin"
//       ? [{ id: "created-by-me" as const, label: "Created By Me", icon: Users }]
//       : []),
//   ];

//   return (
//     <div className="py-16 flex flex-col gap-6">
//       <SectionHeading
//         heading="My Tasks"
//         subheading={
//           role === "admin"
//             ? "View all tasks or filter by tasks you've created."
//             : "Here's a list of tasks assigned to you for your classes."
//         }
//       />

//       {/* Tabs */}
//       <div className="flex gap-1 border-b border-border">
//         {tabs.map((tab) => {
//           const Icon = tab.icon;
//           return (
//             <button
//               key={tab.id}
//               onClick={() => {
//                 setActiveTab(tab.id);
//                 setCurrentPage(1); // Reset to first page on tab change
//               }}
//               className={cn(
//                 "flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all relative",
//                 activeTab === tab.id
//                   ? "text-primary"
//                   : "text-muted-foreground hover:text-foreground",
//               )}
//             >
//               <Icon className="w-4 h-4" />
//               {tab.label}
//               {activeTab === tab.id && (
//                 <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
//               )}
//             </button>
//           );
//         })}
//       </div>

//       {/* Loading State */}
//       {isLoading ? (
//         <div className="flex flex-col items-center justify-center py-20">
//           <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
//           <p className="mt-4 text-sm text-muted-foreground">Loading tasks...</p>
//         </div>
//       ) : filteredTasks.length === 0 ? (
//         <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
//           <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center">
//             <School className="w-7 h-7 text-muted-foreground" />
//           </div>
//           <p className="font-semibold text-foreground">No tasks found</p>
//           <p className="text-sm text-muted-foreground">
//             {activeTab === "created-by-me"
//               ? "You haven't created any tasks yet."
//               : activeTab === "my-tasks"
//                 ? "No tasks assigned to you yet."
//                 : "No tasks available at the moment."}
//           </p>
//         </div>
//       ) : (
//         <>
//           <div className="flex flex-col gap-3">
//             {filteredTasks.map((task) => (
//               <TaskCard key={task.id} task={task} />
//             ))}
//           </div>

//           {/* Pagination Controls */}
//           {totalPages > 1 && (
//             <div className="flex items-center justify-center gap-2 mt-6">
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => handlePageChange(currentPage - 1)}
//                 disabled={currentPage === 1}
//               >
//                 Previous
//               </Button>

//               <div className="flex items-center gap-1">
//                 {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//                   let pageNum: number;
//                   if (totalPages <= 5) {
//                     pageNum = i + 1;
//                   } else if (currentPage <= 3) {
//                     pageNum = i + 1;
//                   } else if (currentPage >= totalPages - 2) {
//                     pageNum = totalPages - 4 + i;
//                   } else {
//                     pageNum = currentPage - 2 + i;
//                   }

//                   return (
//                     <Button
//                       key={pageNum}
//                       variant={currentPage === pageNum ? "default" : "outline"}
//                       size="sm"
//                       className="w-9"
//                       onClick={() => handlePageChange(pageNum)}
//                     >
//                       {pageNum}
//                     </Button>
//                   );
//                 })}
//               </div>

//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => handlePageChange(currentPage + 1)}
//                 disabled={currentPage === totalPages}
//               >
//                 Next
//               </Button>
//             </div>
//           )}

//           {/* Showing info */}
//           <div className="text-center text-sm text-muted-foreground">
//             Showing {filteredTasks.length} of {totalTasks} tasks
//             {activeTab !== "all" && " (filtered)"}
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

"use client";

import { useState } from "react";
import { SectionHeading } from "@/webcomponents/reusable";
import { School, Users, User } from "lucide-react";
import { TaskCard } from "./TaskCard";
import { useRole } from "@/provider/RoleProvider";
import { useGetTasks } from "@/api/task";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Criteria } from "./Criteria";

// ── Types ────────────────────────────────────────────────────────────────────

type TabType = "all" | "my-tasks" | "created-by-me" | "criteria";

// ── Component ─────────────────────────────────────────────────────────────────

export const MyTask = () => {
  const { role, user } = useRole();
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const limit = 10;

  const { data: tasksData, isLoading } = useGetTasks({
    page: currentPage,
    limit,
  });

  // ── Filter Tasks ───────────────────────────────────────────────────────────

  const getFilteredTasks = () => {
    if (!tasksData?.data) return [];

    switch (activeTab) {
      case "my-tasks":
        return tasksData.data;

      case "created-by-me":
        if (role === "admin" && user?.email) {
          return tasksData.data.filter(
            (task) => task.createdBy?.email === user.email
          );
        }
        return [];

      default:
        return tasksData.data;
    }
  };

  const filteredTasks = getFilteredTasks();

  const totalTasks = tasksData?.meta?.total || 0;
  const totalPages = Math.ceil(totalTasks / limit);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ── Tabs ───────────────────────────────────────────────────────────────────

  const tabs = [
    { id: "my-tasks" as const, label: "Tasks", icon: User },

    ...(role === "admin"
      ? [
          {
            id: "created-by-me" as const,
            label: "Created By Me",
            icon: Users,
          },
          {
            id: "criteria" as const,
            label: "Criteria",
            icon: School,
          },
        ]
      : []),
  ];

  // ── UI ──────────────────────────────────────────────────────────────────────

  return (
    <div className="py-16 flex flex-col gap-6">
      <SectionHeading
        heading="My Tasks"
        subheading={
          role === "admin"
            ? "View all tasks or filter by tasks you've created."
            : "Here's a list of tasks assigned to you for your classes."
        }
      />

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border">
        {tabs.map((tab) => {
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setCurrentPage(1);
              }}
              className={cn(
                "flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all relative",
                activeTab === tab.id
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="w-4 h-4" />
              {tab.label}

              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </button>
          );
        })}
      </div>

      {/* ── Criteria Tab (FULLY SEPARATE UI) ── */}
      {activeTab === "criteria" ? (
        <Criteria />
      ) : isLoading ? (
        /* Loading */
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="mt-4 text-sm text-muted-foreground">
            Loading tasks...
          </p>
        </div>
      ) : filteredTasks.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center">
            <School className="w-7 h-7 text-muted-foreground" />
          </div>

          <p className="font-semibold text-foreground">No tasks found</p>

          <p className="text-sm text-muted-foreground">
            {activeTab === "created-by-me"
              ? "You haven't created any tasks yet."
              : activeTab === "my-tasks"
              ? "No tasks assigned to you yet."
              : "No tasks available at the moment."}
          </p>
        </div>
      ) : (
        <>
          {/* Task List */}
          <div className="flex flex-col gap-3">
            {filteredTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>

              <div className="flex items-center gap-1">
                {Array.from(
                  { length: Math.min(5, totalPages) },
                  (_, i) => {
                    let pageNum: number;

                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <Button
                        key={pageNum}
                        variant={
                          currentPage === pageNum ? "default" : "outline"
                        }
                        size="sm"
                        className="w-9"
                        onClick={() => handlePageChange(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    );
                  }
                )}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}

          {/* Footer Info */}
          <div className="text-center text-sm text-muted-foreground">
            Showing {filteredTasks.length} of {totalTasks} tasks
            {activeTab !== "all" && " (filtered)"}
          </div>
        </>
      )}
    </div>
  );
};