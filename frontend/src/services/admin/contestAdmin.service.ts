// src/services/admin/contestAdmin.service.ts
import { httpClient } from "@/lib/http";

interface ContestExam {
  examId: string;
  order: number;
  weight: number;
}

interface CreateContestPayload {
  name: string;
  description: string;
  startTime: string; // ISO date string
  endTime: string; // ISO date string
  isPublic: boolean;
  exams: ContestExam[];
}

interface UpdateContestPayload {
  name?: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  isPublic?: boolean;
}

export interface Contest {
  _id: string;
  name: string;
  description: string;
  startTime: string;
  endTime: string;
  ownerId: string;
  isPublic: boolean;
  status: "upcoming" | "ongoing" | "ended";
  participantsCount: number;
  exams?: ContestExam[];
  createdAt: string;
  updatedAt: string;
}

export const contestAdminService = {
  /**
   * Create a new contest (Admin/Teacher only)
   */
  createContest: async (
    payload: CreateContestPayload
  ): Promise<Contest | null> => {
    try {
      const response = await httpClient.post<{
        success: boolean;
        data: Contest;
      }>("/contests", payload, { requiresAuth: true });

      if (response?.success && response.data) {
        return response.data;
      }
      return null;
    } catch (error) {
      console.error("Error creating contest:", error);
      throw error;
    }
  },

  /**
   * Get all contests (Admin view)
   */
  getAllContests: async (): Promise<Contest[]> => {
    try {
      const response = await httpClient.get<{
        success: boolean;
        data: Contest[];
      }>("/contests", { requiresAuth: true });

      if (response?.success && Array.isArray(response.data)) {
        return response.data;
      }
      return [];
    } catch (error) {
      console.error("Error fetching contests:", error);
      return [];
    }
  },

  /**
   * Get contest details by ID
   */
  getContestById: async (contestId: string): Promise<Contest | null> => {
    try {
      const response = await httpClient.get<{
        success: boolean;
        data: Contest;
      }>(`/contests/${contestId}`, { requiresAuth: true });

      if (response?.success && response.data) {
        return response.data;
      }
      return null;
    } catch (error) {
      console.error("Error fetching contest:", error);
      return null;
    }
  },

  /**
   * Update contest (Admin/Teacher only)
   */
  updateContest: async (
    contestId: string,
    payload: UpdateContestPayload
  ): Promise<Contest | null> => {
    try {
      const response = await httpClient.put<{
        success: boolean;
        data: Contest;
      }>(`/contests/${contestId}`, payload, { requiresAuth: true });

      if (response?.success && response.data) {
        return response.data;
      }
      return null;
    } catch (error) {
      console.error("Error updating contest:", error);
      throw error;
    }
  },

  /**
   * Delete contest (Admin/Teacher only)
   */
  deleteContest: async (contestId: string): Promise<boolean> => {
    try {
      const response = await httpClient.delete<{
        success: boolean;
        message: string;
      }>(`/contests/${contestId}`, { requiresAuth: true });

      return response?.success || false;
    } catch (error) {
      console.error("Error deleting contest:", error);
      throw error;
    }
  },

  /**
   * Add exam to contest
   */
  addExamToContest: async (
    contestId: string,
    examId: string
  ): Promise<boolean> => {
    try {
      const response = await httpClient.post<{ success: boolean; data: any }>(
        `/contests/${contestId}/exams`,
        { examId },
        { requiresAuth: true }
      );

      return response?.success || false;
    } catch (error) {
      console.error("Error adding exam to contest:", error);
      throw error;
    }
  },

  /**
   * Remove exam from contest
   */
  removeExamFromContest: async (
    contestId: string,
    contestExamId: string
  ): Promise<boolean> => {
    try {
      const response = await httpClient.delete<{
        success: boolean;
        message: string;
      }>(`/contests/${contestId}/exams/${contestExamId}`, {
        requiresAuth: true,
      });

      return response?.success || false;
    } catch (error) {
      console.error("Error removing exam from contest:", error);
      throw error;
    }
  },
};
