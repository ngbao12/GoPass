// src/services/admin/admin.service.ts
import { httpClient } from "@/lib/http";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "teacher" | "student";
  status: "active" | "locked";
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UsersListResponse {
  users: User[];
  total: number;
  page: number;
  totalPages: number;
}

export interface SystemMetrics {
  totalUsers: number;
  activeUsers: number;
  students: number;
  teachers: number;
}

export interface ExamStats {
  totalExams: number;
  contestExams: number;
  publicExams: number;
  totalParticipants: number;
}

export interface AdminExam {
  id: string;
  title: string;
  subject: string;
  duration: number;
  questionCount: number;
  totalPoints: number;
  mode: "practice" | "contest" | "public";
  isPublished: boolean;
  createdBy: {
    id: string;
    name: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export interface ExamsListResponse {
  exams: AdminExam[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ListExamsParams {
  subject?: string;
  mode?: "practice" | "contest" | "public";
  search?: string;
  page?: number;
  limit?: number;
}

export interface ListUsersParams {
  role?: "admin" | "teacher" | "student";
  status?: "active" | "locked";
  keyword?: string;
  page?: number;
  limit?: number;
}

/**
 * Admin Service - Handles all admin-related API calls
 */
export const adminService = {
  /**
   * Get exam statistics (admin only)
   * API: GET /api/admin/exam-stats
   * Auth: Required (Admin only)
   */
  getExamStats: async (): Promise<ExamStats> => {
    const response = await httpClient.get<{
      success: boolean;
      data: ExamStats;
    }>("/admin/exam-stats", { requiresAuth: true });

    if (!response.success || !response.data) {
      throw new Error("Failed to fetch exam stats");
    }

    return response.data;
  },

  /**
   * Get all exams (admin only)
   * API: GET /api/exams
   * Auth: Required (Admin only)
   */
  getAllExams: async (params?: ListExamsParams): Promise<ExamsListResponse> => {
    const queryParams = new URLSearchParams();

    if (params?.subject) queryParams.append("subject", params.subject);
    if (params?.mode) queryParams.append("mode", params.mode);
    if (params?.search) queryParams.append("search", params.search);
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());

    const queryString = queryParams.toString();
    const url = `/exams${queryString ? `?${queryString}` : ""}`;

    const response = await httpClient.get<{
      success: boolean;
      data: ExamsListResponse;
    }>(url, { requiresAuth: true });

    if (!response.success || !response.data) {
      throw new Error("Failed to fetch exams");
    }

    return response.data;
  },

  /**
   * List users with filters
   * API: GET /api/admin/users
   * Auth: Required (Admin only)
   */
  listUsers: async (params?: ListUsersParams): Promise<UsersListResponse> => {
    const queryParams = new URLSearchParams();

    if (params?.role) queryParams.append("role", params.role);
    if (params?.status) queryParams.append("status", params.status);
    if (params?.keyword) queryParams.append("keyword", params.keyword);
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());

    const queryString = queryParams.toString();
    const url = `/admin/users${queryString ? `?${queryString}` : ""}`;

    const response = await httpClient.get<{
      success: boolean;
      data: UsersListResponse;
    }>(url, { requiresAuth: true });

    if (!response.success || !response.data) {
      throw new Error("Failed to fetch users");
    }

    return response.data;
  },

  /**
   * Get user detail by ID
   * API: GET /api/admin/users/:userId
   * Auth: Required (Admin only)
   */
  getUserDetail: async (userId: string): Promise<User> => {
    const response = await httpClient.get<{ success: boolean; data: User }>(
      `/admin/users/${userId}`,
      { requiresAuth: true }
    );

    if (!response.success || !response.data) {
      throw new Error("Failed to fetch user detail");
    }

    return response.data;
  },

  /**
   * Update user status (active/locked)
   * API: PUT /api/admin/users/:userId/status
   * Auth: Required (Admin only)
   */
  updateUserStatus: async (
    userId: string,
    status: "active" | "locked"
  ): Promise<User> => {
    const response = await httpClient.put<{ success: boolean; data: User }>(
      `/admin/users/${userId}/status`,
      { status },
      { requiresAuth: true }
    );

    if (!response.success || !response.data) {
      throw new Error("Failed to update user status");
    }

    return response.data;
  },

  /**
   * Update user info (name, email, role)
   * API: PUT /api/admin/users/:userId
   * Auth: Required (Admin only)
   */
  updateUserInfo: async (
    userId: string, 
    updates: { name?: string; email?: string; role?: 'admin' | 'teacher' | 'student' }
  ): Promise<User> => {
    const response = await httpClient.put<{ success: boolean; data: User }>(
      `/admin/users/${userId}`,
      updates,
      { requiresAuth: true }
    );

    if (!response.success || !response.data) {
      throw new Error('Failed to update user info');
    }

    return response.data;
  },

  /**
   * Reset user password
   * API: POST /api/admin/users/:userId/reset-password
   * Auth: Required (Admin only)
   */
  resetUserPassword: async (
    userId: string,
    newPassword: string
  ): Promise<{ message: string }> => {
    const response = await httpClient.post<{
      success: boolean;
      message: string;
    }>(
      `/admin/users/${userId}/reset-password`,
      { newPassword },
      { requiresAuth: true }
    );

    if (!response.success) {
      throw new Error("Failed to reset user password");
    }

    return { message: response.message };
  },

  /**
   * Get system metrics
   * API: GET /api/admin/metrics
   * Auth: Required (Admin only)
   */
  getSystemMetrics: async (): Promise<SystemMetrics> => {
    const response = await httpClient.get<{
      success: boolean;
      data: SystemMetrics;
    }>("/admin/metrics", { requiresAuth: true });

    if (!response.success || !response.data) {
      throw new Error("Failed to fetch system metrics");
    }

    return response.data;
  },
};
