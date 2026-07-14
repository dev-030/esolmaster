import { PaginationQuery } from "@/types/pagintaion";
import { getReportsOverview, getStudentReport, getStudentsAnalytics, getTeacherAnalyticsSummary } from "./api";
import { useQuery } from "@tanstack/react-query";

export const useGetStudentReportQuery = (params: { search?: string } & PaginationQuery) => {

    return useQuery({
        queryKey: ["studentReport", params],
        queryFn: async () => getStudentReport(params),
        enabled: true,
    });

} 

export const useGetStudentsAnalyticsQuery = (studentId: string) => {

    return useQuery({
        queryKey: ["studentsAnalytics", studentId],
        queryFn: async () => getStudentsAnalytics(studentId),
        enabled: !!studentId,
    });
}

export const useGetReportsOverviewQuery = () => {

    return useQuery({
        queryKey: ["reportsOverview"],
        queryFn: async () => getReportsOverview(),
        enabled: true,
    });
}

export const useGetTeacherAnalyticsSummaryQuery = () => {

    return useQuery({
        queryKey: ["teacherAnalyticsSummary"],
        queryFn: async () => getTeacherAnalyticsSummary(),
        enabled: true,
    });
}