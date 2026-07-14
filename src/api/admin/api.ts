import { axios } from "@/lib/axios"
import { AdminUser, DashboardOverview, User, UserSummary } from "@/types/admin";
import { PaginatedResponse } from "@/types/pagintaion";

export interface UserResponse extends PaginatedResponse<User> {
  summary: UserSummary;
}

const admin='/admin'

export const getAdminDashboard =async():Promise<DashboardOverview>=>{
    const {data} =await axios.get(`${admin}/dashboard`)
    return data;
}

export const getAdminUsers =async(params:AdminUser):Promise<UserResponse>=>{
    const {data} =await axios.get(`${admin}/users`,{params})
    return data;
}

export const getAdminUserInfo =async(userId:string):Promise<User>=>{
    const {data} =await axios.get(`${admin}/users/${userId}`)
    return data;
}

export const adminPerformance =async()=>{
    const {data} =await axios.get(`${admin}/performance`)
    return data;
}
export const exportAdminPerformanceData =async()=>{
    const {data} =await axios.get(`${admin}/performance/export`,{
        responseType:'blob'
    })
    return data;
}

export const getAdminPlatformAnalytics =async()=>{
    const {data} =await axios.get(`${admin}/analytics/platform`)
    return data;
}

export const exportAdminReport = async (type: string) => {
    const { data } = await axios.get(`${admin}/reports/export`, {
        params: { type },
        responseType: 'blob',
    });
    return data as Blob;
}