// src/services/submission.service.ts
import { AnswerData } from "@/features/exam/types";

// Giả sử bạn có một http client (axios instance) trong lib
// import { httpClient } from "@/lib/http-client";

export const submissionService = {
  /**
   * Gửi API lưu tự động (Auto-save)
   */
  saveAnswers: async (examId: string, answers: AnswerData[]) => {
    // Code thực tế sau này:
    // return httpClient.post(`/submissions/${examId}/save`, { answers });

    // Mock delay
    return new Promise((resolve) => setTimeout(resolve, 500));
  },

  /**
   * Gửi API nộp bài (Submit)
   */
  submitExam: async (examId: string, answers: AnswerData[]) => {
    // Code thực tế sau này:
    // return httpClient.post(`/submissions/${examId}/submit`, { answers });

    // Mock delay
    return new Promise((resolve) => setTimeout(resolve, 1000));
  },
};
