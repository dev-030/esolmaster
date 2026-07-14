import { useMutation, useQuery } from "@tanstack/react-query"
import { adminPerformance, exportAdminPerformanceData, exportAdminReport, getAdminDashboard, getAdminPlatformAnalytics, getAdminUserInfo, getAdminUsers } from "./api";
import { AdminUser } from "@/types/admin";

export const useGetAdminDashboardQuery = () => {

    return useQuery({
        queryKey: ['adminDashboard'],
        queryFn: async () =>getAdminDashboard()
    });
}

export const useGetAdminUsersQuery = (params:AdminUser) => {

    return useQuery({
        queryKey: ['adminUsers',params],
        queryFn: async () =>getAdminUsers(params)
    });
}

export const useGetAdminUserInfoQuery = (userId:string) => {

    return useQuery({
        queryKey: ['adminUserInfo',userId],
        queryFn: async () =>getAdminUserInfo(userId)
    });
}

export const useGetAdminPerformanceQuery = () => {
    return useQuery({
        queryKey: ['adminPerformance'],
        queryFn: async () => adminPerformance()
    });
}

export const useExportAdminPerformanceMutation = () => {
  return useMutation({
    mutationFn: exportAdminPerformanceData,
  });
};

export const useGetAdminPlatformAnalyticsQuery = () => {
    return useQuery({
        queryKey: ['adminPlatformAnalytics'],
        queryFn: async () => getAdminPlatformAnalytics()
    });
}

export const useExportAdminReportMutation = () => {
    return useMutation({
        mutationFn: (type: string) => exportAdminReport(type),
    });
}