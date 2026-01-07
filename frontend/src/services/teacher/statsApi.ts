import api from "../api";
import type {
  TeacherStats,
  TeacherActivity,
  QuickClassInfo,
} from "@/features/dashboard/types/teacher";

/**
 * Lấy thống kê tổng quan cho teacher dashboard
 * GET /api/teachers/stats
 */
export const fetchTeacherStats = async (): Promise<TeacherStats> => {
  const response = await api.get("/teachers/stats");
  return response.data;
};

/**
 * Lấy danh sách hoạt động gần đây
 * GET /api/teachers/activities
 */
export const fetchTeacherActivities = async (): Promise<TeacherActivity[]> => {
  const response = await api.get("/teachers/activities");
  return response.data;
};

/**
 * Lấy danh sách lớp học overview (cho dashboard)
 * GET /api/teachers/classes/overview
 */
export const fetchTeacherClassesOverview = async (): Promise<QuickClassInfo[]> => {
  const response = await api.get("/teachers/classes/overview");
  return response.data;
};