// src/features/exam/data/mock-exams-by-subject.ts
import { ExamWithDetails } from "../types";

/**
 * Mock exam cho môn Ngữ Văn
 */
export const mockExamNguVan: ExamWithDetails = {
  _id: "exam-ngu-van",
  title: "Bài Thi Ngữ Văn",
  description: "Kỳ thi Tốt nghiệp THPT 2025",
  subject: "Ngữ Văn",
  durationMinutes: 120,
  mode: "test",
  shuffleQuestions: false,
  showResultsImmediately: false,
  createdBy: "teacher-001",
  isPublished: true,
  totalQuestions: 3,
  totalPoints: 10,
  createdAt: "2025-12-01T00:00:00Z",
  updatedAt: "2025-12-01T00:00:00Z",
  questions: [
    {
      _id: "eq-nv-001",
      examId: "exam-ngu-van",
      questionId: "q-nv-001",
      order: 1,
      maxScore: 4,
      question: {
        _id: "q-nv-001",
        type: "multiple_choice",
        content: "Phần I: Đọc hiểu - 5 câu hỏi về đoạn trích văn học",
        options: [
          { text: "Câu 1: Chủ đề chính của đoạn trích", isCorrect: false },
          { text: "Câu 2: Phương pháp nghệ thuật", isCorrect: false },
          { text: "Câu 3: Ý nghĩa câu văn", isCorrect: false },
          { text: "Câu 4: Tác giả và tác phẩm", isCorrect: false },
        ],
        difficulty: "medium",
        subject: "Ngữ Văn",
        tags: ["đọc hiểu", "văn học"],
        points: 4,
        createdBy: "teacher-001",
        isPublic: true,
        createdAt: "2025-11-01T00:00:00Z",
        updatedAt: "2025-11-01T00:00:00Z",
      },
      createdAt: "2025-12-01T00:00:00Z",
    },
    {
      _id: "eq-nv-002",
      examId: "exam-ngu-van",
      questionId: "q-nv-002",
      order: 2,
      maxScore: 2,
      question: {
        _id: "q-nv-002",
        type: "essay",
        content: "Câu 2: Viết đoạn văn nghị luận (khoảng 200 chữ)",
        options: [],
        difficulty: "medium",
        subject: "Ngữ Văn",
        tags: ["viết", "nghị luận"],
        points: 2,
        createdBy: "teacher-001",
        isPublic: true,
        createdAt: "2025-11-01T00:00:00Z",
        updatedAt: "2025-11-01T00:00:00Z",
      },
      createdAt: "2025-12-01T00:00:00Z",
    },
    {
      _id: "eq-nv-003",
      examId: "exam-ngu-van",
      questionId: "q-nv-003",
      order: 3,
      maxScore: 4,
      question: {
        _id: "q-nv-003",
        type: "essay",
        content: "Câu 3: Viết bài văn nghị luận (khoảng 600 chữ)",
        options: [],
        difficulty: "hard",
        subject: "Ngữ Văn",
        tags: ["viết", "nghị luận", "bài văn"],
        points: 4,
        createdBy: "teacher-001",
        isPublic: true,
        createdAt: "2025-11-01T00:00:00Z",
        updatedAt: "2025-11-01T00:00:00Z",
      },
      createdAt: "2025-12-01T00:00:00Z",
    },
  ],
};

/**
 * Mock exam cho môn Tiếng Anh
 */
export const mockExamEnglish: ExamWithDetails = {
  _id: "exam-english",
  title: "English Exam",
  description: "THPT National High School Graduation Examination 2025",
  subject: "Tiếng Anh",
  durationMinutes: 60,
  mode: "test",
  shuffleQuestions: false,
  showResultsImmediately: false,
  createdBy: "teacher-002",
  isPublished: true,
  totalQuestions: 31,
  totalPoints: 31,
  createdAt: "2025-12-01T00:00:00Z",
  updatedAt: "2025-12-01T00:00:00Z",
  questions: [
    {
      _id: "eq-en-001",
      examId: "exam-english",
      questionId: "q-en-001",
      order: 1,
      maxScore: 1,
      question: {
        _id: "q-en-001",
        type: "multiple_choice",
        content:
          "Choose the word whose underlined part differs from the other three in pronunciation.",
        options: [
          { text: "A. changed", isCorrect: false },
          { text: "B. learned", isCorrect: false },
          { text: "C. laughed", isCorrect: true },
          { text: "D. arrived", isCorrect: false },
        ],
        difficulty: "easy",
        subject: "Tiếng Anh",
        tags: ["pronunciation", "phonetics"],
        points: 1,
        createdBy: "teacher-002",
        isPublic: true,
        createdAt: "2025-11-01T00:00:00Z",
        updatedAt: "2025-11-01T00:00:00Z",
      },
      createdAt: "2025-12-01T00:00:00Z",
    },
    {
      _id: "eq-en-002",
      examId: "exam-english",
      questionId: "q-en-002",
      order: 2,
      maxScore: 1,
      question: {
        _id: "q-en-002",
        type: "multiple_choice",
        content:
          "Choose the correct answer: She _____ to the party if she had known about it.",
        options: [
          { text: "A. would go", isCorrect: false },
          { text: "B. would have gone", isCorrect: true },
          { text: "C. will go", isCorrect: false },
          { text: "D. goes", isCorrect: false },
        ],
        difficulty: "medium",
        subject: "Tiếng Anh",
        tags: ["grammar", "conditional"],
        points: 1,
        createdBy: "teacher-002",
        isPublic: true,
        createdAt: "2025-11-01T00:00:00Z",
        updatedAt: "2025-11-01T00:00:00Z",
      },
      createdAt: "2025-12-01T00:00:00Z",
    },
    // ... thêm 29 câu nữa trong production
  ],
};

/**
 * Helper function để get mock exam theo subject
 */
export function getMockExamBySubject(subject: string): ExamWithDetails | null {
  const exams: Record<string, ExamWithDetails> = {
    "Ngữ Văn": mockExamNguVan,
    "Tiếng Anh": mockExamEnglish,
  };

  return exams[subject] || null;
}
