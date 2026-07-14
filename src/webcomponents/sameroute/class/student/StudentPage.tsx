"use client";
import { toast } from "sonner";
import { DeleteDialog } from "../dialogs";
import { Card } from "@/components/ui/card";
import {
  Search,
  UserPlus,
  Users,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { StudentRow } from "./StudentRow";
import { InviteStudentDialog } from "./InviteStudent";
import {
  useGetStudentsInClassQuery,
  useRemoveStudentsFromClassMutation,
} from "@/api/class";

export const StudentClassPage = () => {
  const { classId } = useParams<{ classId: string }>();

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;
  const [inviteOpen, setInviteOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    id?: string;
    name?: string;
  }>({ open: false });
  const [isRemoving, setIsRemoving] = useState(false);

  const {
    data: studentsData,
    isLoading,
    refetch,
  } = useGetStudentsInClassQuery(classId, {
    page,
    limit,
    search: debouncedSearch,
  });

  const { mutate: removeStudent } = useRemoveStudentsFromClassMutation(classId);

  console.log("Students data:", studentsData);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to first page when searching
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const students = studentsData?.data || [];
  const total = studentsData?.meta?.total || 0;
  const totalPages = studentsData?.meta?.totalPages || 1;
  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRemoveStudent = async (
    studentId: string,
    studentName: string,
  ) => {
    try {
      setIsRemoving(true);
      removeStudent([studentId]);
      toast.success(`${studentName} removed from class`);
      await refetch();
      setDeleteDialog({ open: false });
    } catch (error) {
      toast.error("Failed to remove student");
    } finally {
      setIsRemoving(false);
    }
  };

  // Calculate stats (for commented section)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Students</h2>
          <p className="text-muted-foreground text-sm mt-1">
            {total} student{total !== 1 ? "s" : ""} enrolled
          </p>
        </div>
        <Button onClick={() => setInviteOpen(true)} className="gap-2">
          <UserPlus className="w-4 h-4" />
          Invite Student
        </Button>
      </div>

      {/* Stats row - Commented until data is available */}
      {/* 
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatTile
          icon={<Users className="w-4 h-4" />}
          label="Total"
          value={totalStudents}
          color="text-blue-600 bg-blue-50"
        />
        <StatTile
          icon={<TrendingUp className="w-4 h-4" />}
          label="Avg. Progress"
          value={`${avgProgress}%`}
          color="text-emerald-600 bg-emerald-50"
        />
        <StatTile
          icon={<TrendingUp className="w-4 h-4" />}
          label="Above 70%"
          value={studentsAbove70}
          color="text-violet-600 bg-violet-50"
        />
      </div>
      */}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search students by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : students.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center space-y-2">
          <Users className="w-8 h-8 text-muted-foreground" />
          <p className="font-medium text-foreground">No students found</p>
          <p className="text-sm text-muted-foreground">
            {debouncedSearch
              ? "Try a different search term."
              : "Invite students to get started."}
          </p>
          {!debouncedSearch && (
            <Button
              onClick={() => setInviteOpen(true)}
              variant="outline"
              className="gap-2 mt-4"
            >
              <UserPlus className="w-4 h-4" />
              Invite Your First Student
            </Button>
          )}
        </div>
      ) : (
        <>
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/30">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Student
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">
                      Email
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden sm:table-cell">
                      Username
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden lg:table-cell">
                      Joined
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Progress
                    </th>
                    <th className="px-4 py-3 w-12" />
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {students.map((student) => (
                    <StudentRow
                      key={student.id}
                      student={student}
                      onRemove={() =>
                        setDeleteDialog({
                          open: true,
                          id: student.id,
                          name: `${student.firstName} ${student.lastName}`,
                        })
                      }
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4">
              <div className="text-sm text-muted-foreground">
                Showing {startItem} to {endItem} of {total} students
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className="gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>
                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (page <= 3) {
                      pageNum = i + 1;
                      if (i === 4) pageNum = totalPages;
                    } else if (page >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = page - 2 + i;
                      if (i === 3 && totalPages > 5) {
                        return (
                          <span
                            key={`ellipsis-${i}`}
                            className="px-3 py-2 text-muted-foreground"
                          >
                            ...
                          </span>
                        );
                      }
                      if (i === 4) pageNum = totalPages;
                    }

                    if (pageNum === undefined) return null;

                    return (
                      <Button
                        key={pageNum}
                        variant={page === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(pageNum)}
                        className="min-w-10"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                  className="gap-1"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Dialogs */}
      <InviteStudentDialog open={inviteOpen} onOpenChange={setInviteOpen} />

      <DeleteDialog
        open={deleteDialog.open}
        onOpenChange={(v) => setDeleteDialog((s) => ({ ...s, open: v }))}
        title={`Remove "${deleteDialog.name}"?`}
        description="The student will lose access to this class and all its tasks. This action cannot be undone."
        onConfirm={() => {
          if (deleteDialog.id && !isRemoving) {
            handleRemoveStudent(
              deleteDialog.id,
              deleteDialog.name || "Student",
            );
          }
        }}
        loading={isRemoving} // Make sure your DeleteDialog component accepts this prop
      />
    </div>
  );
};
