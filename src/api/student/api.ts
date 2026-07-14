import { axios } from "@/lib/axios";
import { PaginatedResponse } from "@/types/pagintaion";
import {
  BrowseTask,
  ScheduledTaskQuery,
  StudentDashboardResponse,
  StudentSkillProgress,
} from "@/types/student";

const student = "student";

export const getStudentDashboard =
  async (): Promise<StudentDashboardResponse> => {
    const { data } = await axios.get(`/${student}/dashboard`);
    return data;
  };

export const getStudentProgress = async (): Promise<StudentSkillProgress> => {
  const { data } = await axios.get(`/${student}/progress`);
  return data;
};

export const getStudentActivity = async () => {
  const { data } = await axios.get(`/${student}/activity`);
  return data;
};

export const getStudentScoreTrend = async () => {
  const { data } = await axios.get(`/${student}/score-trend`);
  return data;
};

export const getStudentBadges = async () => {
  const { data } = await axios.get(`/${student}/badges`);
  return data;
};

export const getStudentSkillDistribution = async () => {
  const { data } = await axios.get(`/${student}/skill-distribution`);
  return data;
};

export const getStudentScheduledTasks = async (params: ScheduledTaskQuery): Promise<PaginatedResponse<BrowseTask>> => {
  const { data } = await axios.get(`/${student}/scheduled-tasks`, { params });
  return data;
};
