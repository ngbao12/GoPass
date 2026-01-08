import { httpClient } from '@/lib';

export interface GradingResult {
  examAnswerId: string;
  questionId: string;
  score: number;
  feedback: string;
  isAutoGraded: boolean;
}

export interface AutoGradeResponse {
  success: boolean;
  gradedCount: number;
  totalScore: number;
  results: GradingResult[];
}

export interface Submission {
  _id: string;
  studentUserId: {
    _id: string;
    name: string;
    email: string;
  };
  examId: {
    _id: string;
    title: string;
    subject: string;
  };
  assignmentId: string;
  status: 'in-progress' | 'submitted' | 'graded';
  totalScore?: number;
  startedAt: string;
  submittedAt?: string;
  gradedAt?: string;
  timeSpentSeconds: number;
}

export interface Answer {
  _id: string;
  submissionId: string;
  questionId: {
    _id: string;
    content: string;
    type: string;
    explanation?: string;
    maxScore?: number;
  };
  answerText?: string;
  selectedOptions?: string[];
  score?: number;
  feedback?: string;
  isAutoGraded?: boolean;
  gradedAt?: string;
}

export interface SubmissionDetail extends Submission {
  answers: Answer[];
}

class GradingService {
  /**
   * Get all submissions (for teachers)
   */
  async getAllSubmissions(filters?: {
    subject?: string;
    status?: string;
    classId?: string;
  }): Promise<Submission[]> {
    const params = new URLSearchParams();
    if (filters?.subject) params.append('subject', filters.subject);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.classId) params.append('classId', filters.classId);

    const response = await httpClient.get<{ success: boolean; data: Submission[] }>(
      `/grading/submissions${params.toString() ? '?' + params.toString() : ''}`,
      { requiresAuth: true }
    );
    return response.data;
  }

  /**
   * Get submission detail with answers
   */
  async getSubmissionDetail(submissionId: string): Promise<SubmissionDetail> {
    const response = await httpClient.get<{ success: boolean; data: SubmissionDetail }>(
      `/grading/submissions/${submissionId}`,
      { requiresAuth: true }
    );
    return response.data;
  }

  /**
   * Trigger AI auto-grading for Ngữ Văn exam
   */
  async autoGradeNguVan(submissionId: string): Promise<AutoGradeResponse> {
    const response = await httpClient.post<{ success: boolean; data: AutoGradeResponse }>(
      `/grading/submissions/${submissionId}/auto-grade-ngu-van`,
      {},
      { requiresAuth: true }
    );
    return response.data;
  }

  /**
   * Manually grade a single answer
   */
  async gradeAnswer(
    submissionId: string,
    answerId: string,
    data: { score: number; feedback?: string }
  ): Promise<Answer> {
    const response = await httpClient.post<{ success: boolean; data: Answer }>(
      `/grading/submissions/${submissionId}/answers/${answerId}/grade`,
      data,
      { requiresAuth: true }
    );
    return response.data;
  }

  /**
   * Update submission status
   */
  async updateSubmissionStatus(
    submissionId: string,
    status: 'graded' | 'submitted'
  ): Promise<Submission> {
    const response = await httpClient.patch<{ success: boolean; data: Submission }>(
      `/grading/submissions/${submissionId}/status`,
      { status },
      { requiresAuth: true }
    );
    return response.data;
  }
}

export const gradingService = new GradingService();
export default gradingService;