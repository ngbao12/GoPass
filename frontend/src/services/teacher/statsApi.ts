import { httpClient } from '@/lib/http';

// Types cho Teacher Stats
export interface TeacherStats {
  totalClasses: number;
  totalStudents: number;
  totalExams: number;
  pendingRequests: number;
}

export interface TeacherActivity {
  id: string;
  type: "submission" | "join_request" | "exam_created" | "grade_updated";
  message: string;
  timestamp: string;
  className?: string;
  studentName?: string;
}

export interface QuickClassInfo {
  id: string;
  name: string;
  code: string;
  subject: string;
  studentCount: number;
  pendingRequests: number;
}

/**
 * Lấy thống kê tổng quan cho teacher dashboard
 * GET /teachers/stats
 */
export const fetchTeacherStats = async (): Promise<TeacherStats> => {
  try {
    const response = await httpClient.get<{ 
      success: boolean; 
      data: TeacherStats 
    }>('/teachers/stats', { requiresAuth: true });

    return response.success && response.data 
      ? response.data 
      : { totalClasses: 0, totalStudents: 0, totalExams: 0, pendingRequests: 0 };

  } catch (error) {
    console.error("API Error fetching teacher stats:", error);
    return { totalClasses: 0, totalStudents: 0, totalExams: 0, pendingRequests: 0 };
  }
};

/**
 * Lấy danh sách hoạt động gần đây
 * GET /teachers/activities
 */
export const fetchTeacherActivities = async (): Promise<TeacherActivity[]> => {
  try {
    const response = await httpClient.get<{ 
      success: boolean; 
      data: TeacherActivity[] 
    }>('/teachers/activities', { requiresAuth: true });

    return response.success && response.data 
      ? response.data 
      : [];

  } catch (error) {
    console.error("Error fetching teacher activities:", error);
    return [];
  }
};

/**
 * Lấy danh sách lớp học overview (cho dashboard)
 * GET /teachers/classes/overview
 */
export const fetchTeacherClassesOverview = async (): Promise<QuickClassInfo[]> => {
  try {
    const response = await httpClient.get<{ 
      success: boolean; 
      data: QuickClassInfo[] 
    }>('/teachers/classes/overview', { requiresAuth: true });

    return response.success && response.data 
      ? response.data 
      : [];

  } catch (error) {
    console.error("Error fetching classes overview:", error);
    return [];
  }
};