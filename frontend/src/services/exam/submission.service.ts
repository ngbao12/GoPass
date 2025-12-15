// src/services/exam/submission.service.ts
import { AnswerData, ExamSubmission, ExamAnswer } from "@/features/exam/types";
// Import mock data để test (sau này xóa khi có API thật)
import { getMockExamById } from "@/features/exam/data/mock-exam";

export const submissionService = {
  /**
   * Gửi API lưu tự động (Auto-save)
   * FIX: Tham số answers phải là AnswerData[] (dữ liệu từ frontend)
   */
  saveAnswers: async (examId: string, answers: AnswerData[]) => {
    // Mock delay
    // Code thật: return httpClient.post(`/exams/${examId}/save`, { answers });
    return new Promise((resolve) => setTimeout(resolve, 500));
  },

  /**
   * Gửi API nộp bài (Submit)
   * FIX: Tham số answers phải là AnswerData[]
   */
  submitExam: async (examId: string, answers: AnswerData[]) => {
    // Mock delay
    return new Promise((resolve) => setTimeout(resolve, 1000));
  },

  /**
   * Lấy chi tiết bài làm để xem lại (Review)
   * Trả về: { submission, exam, questions }
   */
  getSubmissionDetails: async (submissionId: string) => {
    if (!submissionId) return null;
    await new Promise((resolve) => setTimeout(resolve, 500));

    let targetExamId = "exam-001";
    if (submissionId.includes("002")) targetExamId = "exam-002";
    if (submissionId.includes("003")) targetExamId = "exam-003";

    const mockExam = getMockExamById(targetExamId);
    if (!mockExam) return null;

    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    // 2. TẠO CÂU TRẢ LỜI GIẢ LẬP
    const mockAnswers: ExamAnswer[] = mockExam.questions.map((q, index) => {
      const questionDetail = q.question;
      const type = questionDetail?.type;
      const correctAnswer = questionDetail?.correctAnswer;

      let selectedOptions: string[] = [];
      let answerText: string | undefined = undefined;
      let score = 0;

      // --- LOGIC MOCK ĐÁP ÁN (Dựa trên index để test Xanh/Đỏ) ---

      // Trường hợp 1: TỰ LUẬN (Essay)
      if (type === "essay") {
        if (index <= 5) {
          answerText = "Bài làm tốt, đầy đủ ý.";
          score = q.maxScore; // Full điểm
        } else if (index <= 10) {
          answerText = "Bài làm còn sơ sài.";
          score = q.maxScore / 2; // Nửa điểm
        }
        // Các câu còn lại bỏ trống -> 0 điểm
      }

      // Trường hợp 2: TRẮC NGHIỆM (Multiple Choice / Short Answer) - correctAnswer là string
      else if (typeof correctAnswer === "string") {
        const firstOptionId = questionDetail?.options?.[0]?.id || "A";
        const secondOptionId = questionDetail?.options?.[1]?.id || "B";

        if (index <= 5) {
          // Mock ĐÚNG: Chọn đúng đáp án
          selectedOptions = [correctAnswer];
          score = q.maxScore;
        } else if (index <= 10) {
          // Mock SAI: Chọn đáp án khác
          const wrong =
            firstOptionId === correctAnswer ? secondOptionId : firstOptionId;
          selectedOptions = [wrong];
          score = 0;
        }
      }

      // Trường hợp 3: ĐÚNG/SAI (True/False) - correctAnswer là Object
      else if (typeof correctAnswer === "object" && correctAnswer !== null) {
        // Mock ĐÚNG/SAI cho dạng bài phức tạp này khó hơn,
        // ta tạm thời mock điểm số trực tiếp để test UI
        if (index <= 5) {
          score = q.maxScore; // Giả vờ làm đúng hết
          // selectedOptions trong T/F thường lưu danh sách ID các câu chọn là True
          // Ta mock tạm để không bị rỗng
          selectedOptions = ["mock-true-option"];
        } else if (index <= 10) {
          score = 0; // Giả vờ làm sai
          selectedOptions = ["mock-wrong-option"];
        }
      }

      return {
        _id: `answer-${index}`,
        submissionId: submissionId,
        questionId: q.questionId,
        answerText,
        selectedOptions,
        score, // Điểm số đã tính toán ở trên
        maxScore: q.maxScore,
        feedback:
          type === "essay" ? "Nhận xét tự động từ hệ thống..." : undefined,
        isAutoGraded: type !== "essay",
        isManuallyGraded: type === "essay",
        createdAt: oneHourAgo.toISOString(),
        updatedAt: now.toISOString(),
      };
    });

    const mockSubmission: ExamSubmission = {
      _id: submissionId,
      examId: mockExam._id,
      studentId: "student-01",
      assignmentId: "assign-01",
      status: "graded",
      attemptNumber: 1,
      totalScore: mockAnswers.reduce((acc, curr) => acc + (curr.score || 0), 0),
      maxScore: mockExam.totalPoints || 10,
      startedAt: oneHourAgo.toISOString(),
      submittedAt: now.toISOString(),
      answers: mockAnswers,
      createdAt: oneHourAgo.toISOString(),
      updatedAt: now.toISOString(),
    };

    return {
      submission: mockSubmission,
      exam: mockExam,
      questions: mockExam.questions.map((q) => q.question).filter(Boolean),
    };
  },
};
