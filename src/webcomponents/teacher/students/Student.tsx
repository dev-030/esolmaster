"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search, Mail, MoreHorizontal, Eye, School,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Pagination } from "@/webcomponents/reusable";
import { useGetStudentReportQuery } from "@/api/analytics";

// ── Config ────────────────────────────────────────────────────────────────────

const PAGE_SIZE = 10;

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

function getStatusColor(status: string) {
  switch (status) {
    case "GOOD":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "NORMAL":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "PROBLEMATIC":
      return "bg-red-50 text-red-700 border-red-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
}

function getStatusBadgeColor(status: string) {
  switch (status) {
    case "GOOD":
      return "bg-emerald-500";
    case "NORMAL":
      return "bg-blue-500";
    case "PROBLEMATIC":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
}

function getStatusLabel(status: string) {
  switch (status) {
    case "GOOD":
      return "Good";
    case "NORMAL":
      return "Normal";
    case "PROBLEMATIC":
      return "At Risk";
    default:
      return status;
  }
}

// ── Component ─────────────────────────────────────────────────────────────────

export const StudentsTeacher = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  
  const { data: response, isLoading } = useGetStudentReportQuery({ 
    search, 
    page, 
    limit: PAGE_SIZE 
  });

  const students = response?.data || [];
  const paginationMeta = response?.meta;

  const handleSearch = (v: string) => {
    setSearch(v);
    setPage(1);
  };

  if (isLoading) {
    return (
      <div className="space-y-5">
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Search by name, email or class…"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </CardContent>
        </Card>
        <div className="rounded-lg border overflow-hidden">
          <div className="text-center py-16 text-muted-foreground text-sm">
            Loading students...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* ── Search card ── */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Search by name, email or class…"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      {/* ── Table ── */}
      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/60 hover:bg-muted/60">
              <TableHead className="font-semibold text-foreground text-xs uppercase tracking-wide py-3">
                Student Name
              </TableHead>
              <TableHead className="font-semibold text-foreground text-xs uppercase tracking-wide py-3">
                Class
              </TableHead>
              <TableHead className="font-semibold text-foreground text-xs uppercase tracking-wide py-3 text-center">
                Completed Tasks
              </TableHead>
              <TableHead className="font-semibold text-foreground text-xs uppercase tracking-wide py-3 text-center">
                Avg Score
              </TableHead>
              <TableHead className="font-semibold text-foreground text-xs uppercase tracking-wide py-3">
                Status
              </TableHead>
              <TableHead className="font-semibold text-foreground text-xs uppercase tracking-wide py-3 text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {students.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-16 text-muted-foreground text-sm">
                  No students found.
                </TableCell>
              </TableRow>
            ) : (
              students.map((student) => (
                <TableRow key={student.studentId} className="hover:bg-muted/20 transition-colors">
                  {/* Student Name */}
                  <TableCell className="py-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 shrink-0">
                        <AvatarFallback className="bg-primary/15 text-primary text-xs font-bold">
                          {initials(student.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">
                          {student.name}
                        </p>
                        <p className="flex items-center gap-1 text-[11px] text-muted-foreground mt-0.5">
                          <Mail className="w-3 h-3 shrink-0" />
                          <span className="truncate">{student.email}</span>
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  {/* Class - Display first class or multiple */}
                  <TableCell className="py-3">
                    <div className="flex flex-col gap-1">
                      {student.connectedClasses.length > 0 ? (
                        <>
                          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <School className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate max-w-[140px]">
                              {student.connectedClasses[0].name}
                            </span>
                          </span>
                          {student.connectedClasses.length > 1 && (
                            <span className="text-[10px] text-muted-foreground">
                              +{student.connectedClasses.length - 1} more
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="text-xs text-muted-foreground">No class</span>
                      )}
                    </div>
                  </TableCell>

                  {/* Completed Tasks */}
                  <TableCell className="py-3 text-center">
                    <span className="text-sm font-bold text-foreground">
                      {student.completedTasks}
                      <span className="text-muted-foreground font-normal text-xs">
                        /{student.totalScheduledTasks}
                      </span>
                    </span>
                    <div className="text-[10px] text-muted-foreground mt-1">
                      {student.inProgressTasks} in progress
                    </div>
                  </TableCell>

                  {/* Avg Score */}
                  <TableCell className="py-3 text-center">
                    <span className={cn(
                      "inline-flex items-center justify-center px-2.5 py-0.5 rounded-full border text-sm font-bold",
                      "bg-muted/40 border-border text-foreground"
                    )}>
                      {Math.round(student.avgScore)}%
                    </span>
                    <div className="text-[10px] text-muted-foreground mt-1">
                      Progress: {Math.round(student.progressPercentage)}%
                    </div>
                  </TableCell>

                  {/* Status */}
                  <TableCell className="py-3">
                    <span className={cn(
                      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border",
                      getStatusColor(student.status)
                    )}>
                      <span className={cn(
                        "w-1.5 h-1.5 rounded-full",
                        getStatusBadgeColor(student.status)
                      )} />
                      {getStatusLabel(student.status)}
                    </span>
                    {student.lastAttemptAt && (
                      <div className="text-[10px] text-muted-foreground mt-1">
                        Last: {new Date(student.lastAttemptAt).toLocaleDateString()}
                      </div>
                    )}
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="py-3 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium outline-none disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8">
                        <MoreHorizontal className="w-4 h-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-36">
                        <DropdownMenuItem
                          className="gap-2 cursor-pointer"
                          onClick={() => router.push(`/students/${student.studentId}`)}
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* ── Pagination ── */}
        {paginationMeta && paginationMeta.totalPages > 1 && (
          <Pagination
            page={page}
            totalItems={paginationMeta.total}
            pageSize={PAGE_SIZE}
            onPageChange={setPage}
          />
        )}
      </div>
    </div>
  );
};