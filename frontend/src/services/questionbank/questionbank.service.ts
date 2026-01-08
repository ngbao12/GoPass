// src/services/questionbank/questionbank.service.ts
import { httpClient } from "@/lib/http";

export interface QuestionOption {
  id: string;
  content: string;
  isCorrect: boolean;
}

export interface Question {
  _id: string;
  type: string;
  content: string;
  options?: QuestionOption[];
  correctAnswer?: any;
  explanation?: string;
  difficulty: "easy" | "medium" | "hard";
  subject: string;
  tags: string[];
  points: number;
  isPublic: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface QuestionSearchParams {
  subject?: string;
  difficulty?: "easy" | "medium" | "hard";
  type?: string;
  keyword?: string;
  page?: number;
  limit?: number;
}

export interface QuestionSearchResponse {
  questions: Question[];
  total: number;
  page: number;
  totalPages: number;
}

export interface SubjectStats {
  subject: string;
  total: number;
  easy: number;
  medium: number;
  hard: number;
}

export interface QuestionStatsResponse {
  total: number;
  bySubject: SubjectStats[];
}

/**
 * Question Bank Service - Handles all question bank API calls
 */
export const questionBankService = {
  /**
   * Get question statistics grouped by subject and difficulty
   * API: GET /api/questions/stats
   * Auth: Required (Teacher/Admin)
   */
  getStats: async (): Promise<QuestionStatsResponse> => {
    const response = await httpClient.get<{
      success: boolean;
      data: QuestionStatsResponse;
    }>("/questions/stats", { requiresAuth: true });

    if (!response.success || !response.data) {
      throw new Error("Failed to fetch question stats");
    }

    return response.data;
  },

  /**
   * Search questions with filters
   * API: GET /api/questions
   * Auth: Required (Teacher/Admin)
   */
  searchQuestions: async (
    params?: QuestionSearchParams
  ): Promise<QuestionSearchResponse> => {
    const queryParams = new URLSearchParams();

    if (params?.subject) queryParams.append("subject", params.subject);
    if (params?.difficulty) queryParams.append("difficulty", params.difficulty);
    if (params?.type) queryParams.append("type", params.type);
    if (params?.keyword) queryParams.append("keyword", params.keyword);
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());

    const queryString = queryParams.toString();
    const url = `/questions${queryString ? `?${queryString}` : ""}`;

    const response = await httpClient.get<{
      success: boolean;
      data: QuestionSearchResponse;
    }>(url, { requiresAuth: true });

    if (!response.success || !response.data) {
      throw new Error("Failed to fetch questions");
    }

    return response.data;
  },

  /**
   * Get question detail by ID
   * API: GET /api/questions/:questionId
   * Auth: Required (Teacher/Admin)
   */
  getQuestionDetail: async (questionId: string): Promise<Question> => {
    const response = await httpClient.get<{ success: boolean; data: Question }>(
      `/questions/${questionId}`,
      { requiresAuth: true }
    );

    if (!response.success || !response.data) {
      throw new Error("Failed to fetch question detail");
    }

    return response.data;
  },

  /**
   * Create new question
   * API: POST /api/questions
   * Auth: Required (Teacher/Admin)
   */
  createQuestion: async (data: Partial<Question>): Promise<Question> => {
    const response = await httpClient.post<{
      success: boolean;
      data: Question;
    }>("/questions", data, { requiresAuth: true });

    if (!response.success || !response.data) {
      throw new Error("Failed to create question");
    }

    return response.data;
  },

  /**
   * Update question
   * API: PUT /api/questions/:questionId
   * Auth: Required (Teacher/Admin)
   */
  updateQuestion: async (
    questionId: string,
    data: Partial<Question>
  ): Promise<Question> => {
    const response = await httpClient.put<{ success: boolean; data: Question }>(
      `/questions/${questionId}`,
      data,
      { requiresAuth: true }
    );

    if (!response.success || !response.data) {
      throw new Error("Failed to update question");
    }

    return response.data;
  },

  /**
   * Delete question
   * API: DELETE /api/questions/:questionId
   * Auth: Required (Teacher/Admin)
   */
  deleteQuestion: async (questionId: string): Promise<void> => {
    const response = await httpClient.delete<{
      success: boolean;
      message: string;
    }>(`/questions/${questionId}`, { requiresAuth: true });

    if (!response.success) {
      throw new Error("Failed to delete question");
    }
  },
};
