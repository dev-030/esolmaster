"use client";

import { useState } from "react";
import {  PendingTaskCard } from "./PendingTaskCard";
import { Separator } from "@/components/ui/separator";
import { ClipboardList } from "lucide-react";
import { Pagination } from "@/webcomponents/reusable";
import { useApproveTaskMutation, useGetTasks, useRejectTaskMutation } from "@/api/task";
import { toast } from "sonner";

const PAGE_SIZE = 4;


export const PendingTaskPanel = () => {
  const [page, setPage] = useState(1);

  const { data: tasksData, isLoading } = useGetTasks({
    page: page,
    limit: PAGE_SIZE,
    status: "PENDING_APPROVAL",
  });
  const { mutateAsync:approveTask, isPending: isApproving } =useApproveTaskMutation();
  const { mutateAsync:rejectTask, isPending: isRejecting } =useRejectTaskMutation();

  const handleApprove = async (id: string) => {
    await approveTask(id,{
      onSuccess: () => {
        toast.success("Task approved successfully");
      }
    });
  };

  const handleReject = async (id: string) => {
    await rejectTask(id,{
      onSuccess: () => {
        toast.success("Task rejected successfully",{
          richColors: true,
        });
      }
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col gap-4 h-full">
      {/* Header */}
      <div className="flex items-center gap-2">
        <ClipboardList size={18} className="text-orange-500" />
        <h3 className="text-base font-semibold text-gray-800">
          Pending Task Approval
        </h3>
      </div>

      <Separator />

      {/* Task list */}
      <div className="flex flex-col divide-y divide-gray-100 flex-1">
        {tasksData?.data?.length === 0 ? (
          <p className="text-sm text-gray-400 py-4 text-center">
            No pending tasks.
          </p>
        ) : (
          tasksData?.data?.map((task) => (
            <PendingTaskCard
              key={task.id}
              task={task}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="pt-2">
        <Pagination
          page={page}
          totalItems={tasksData?.meta?.total || 0}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
};
