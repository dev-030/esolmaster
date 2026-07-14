import { axios } from "@/lib/axios";
import { DashboardStats, StudentProgress } from "@/types/anaylytics";
import { PaginatedResponse, PaginationQuery } from "@/types/pagintaion";

const teacher = "teacher";
export const getStudentReport = async(params:{search?:string}& PaginationQuery):Promise<PaginatedResponse<StudentProgress>> => {

    const { data } = await axios.get(`/analytics/${teacher}/students`, {
        params
    });
    return data;
}

export const getStudentsAnalytics = async (studentId: string) => {
    const { data } = await axios.get(`/analytics/students/${studentId}`);
    return data;
}

export const getReportsOverview = async () => {
    const { data } = await axios.get(`/analytics/reports`);
    return data;
}

export const getTeacherAnalyticsSummary = async (): Promise<DashboardStats> => {
    const { data } = await axios.get(`/analytics/${teacher}/summary`);
    return data;
}