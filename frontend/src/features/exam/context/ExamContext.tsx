// src/features/exam/context/ExamContext.tsx
"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import {
  ExamWithDetails,
  ExamQuestion,
  ExamSubmission,
  ExamState,
  AnswerData,
} from "../types";
import { submissionService } from "@/services/exam/submission.service";

// --- Types ---
interface ExamContextType {
  // Data
  exam: ExamWithDetails | null;
  submission: ExamSubmission | null;
  currentQuestion: ExamQuestion | null;

  // State
  examState: ExamState;
  timeRemaining: number;
  isTimeUp: boolean;

  // Actions
  setExamState: (state: Partial<ExamState>) => void;
  goToQuestion: (index: number) => void;
  goToNextQuestion: () => void;
  goToPreviousQuestion: () => void;
  updateAnswer: (questionId: string, answer: AnswerData) => void;
  getAnswer: (questionId: string) => AnswerData | undefined;
  toggleFlag: (questionId: string) => void;

  // Async Actions
  submitExam: () => Promise<void>;
  autoSave: () => Promise<void>;
}

const ExamContext = createContext<ExamContextType | undefined>(undefined);

export const useExam = () => {
  const context = useContext(ExamContext);
  if (!context) {
    throw new Error("useExam must be used within ExamProvider");
  }
  return context;
};

interface ExamProviderProps {
  children: ReactNode;
  initialExam: ExamWithDetails;
}

export const ExamProvider: React.FC<ExamProviderProps> = ({
  children,
  initialExam,
}) => {
  // --- 1. STATE INITIALIZATION ---
  const [exam] = useState<ExamWithDetails>(initialExam);
  const [submission, setSubmission] = useState<ExamSubmission | null>(null);
  const [isTimeUp, setIsTimeUp] = useState(false);

  const [examState, setExamStateRaw] = useState<ExamState>({
    currentQuestionIndex: 0,
    answers: new Map(),
    flaggedQuestions: new Set(),
    timeRemaining: initialExam.durationMinutes * 60,
    isSubmitting: false,
    autoSaveStatus: "idle",
  });

  const setExamState = useCallback((partial: Partial<ExamState>) => {
    setExamStateRaw((prev) => ({ ...prev, ...partial }));
  }, []);

  const currentQuestion =
    exam.questions[examState.currentQuestionIndex] || null;

  // --- 2. EFFECTS (Timer & Auto-save Trigger) ---

  // Timer Logic
  useEffect(() => {
    if (isTimeUp || examState.isSubmitting) return;

    const interval = setInterval(() => {
      setExamStateRaw((prev) => {
        if (prev.timeRemaining <= 0) {
          clearInterval(interval);
          setIsTimeUp(true);
          return { ...prev, timeRemaining: 0 };
        }
        return { ...prev, timeRemaining: prev.timeRemaining - 1 };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimeUp, examState.isSubmitting]);

  // Handle Time Up
  useEffect(() => {
    if (isTimeUp) {
      submitExam();
    }
  }, [isTimeUp]);

  // Auto-save Interval
  useEffect(() => {
    if (examState.answers.size === 0) return;

    const interval = setInterval(() => {
      autoSave();
    }, 30000); // 30s

    return () => clearInterval(interval);
  }, [examState.answers]);

  // --- 3. LOGIC & HANDLERS ---

  const goToQuestion = (index: number) => {
    if (index >= 0 && index < exam.questions.length) {
      setExamState({ currentQuestionIndex: index });
    }
  };

  const goToNextQuestion = () => {
    if (examState.currentQuestionIndex < exam.questions.length - 1) {
      setExamState({
        currentQuestionIndex: examState.currentQuestionIndex + 1,
      });
    }
  };

  const goToPreviousQuestion = () => {
    if (examState.currentQuestionIndex > 0) {
      setExamState({
        currentQuestionIndex: examState.currentQuestionIndex - 1,
      });
    }
  };

  const updateAnswer = (questionId: string, answer: AnswerData) => {
    const newAnswers = new Map(examState.answers);
    newAnswers.set(questionId, { ...answer, lastModified: new Date() });
    setExamState({ answers: newAnswers });
  };

  const getAnswer = (questionId: string) => examState.answers.get(questionId);

  const toggleFlag = (questionId: string) => {
    const newFlags = new Set(examState.flaggedQuestions);
    newFlags.has(questionId)
      ? newFlags.delete(questionId)
      : newFlags.add(questionId);
    setExamState({ flaggedQuestions: newFlags });
  };

  // --- 4. API INTERACTION (Delegated to Service) ---

  const autoSave = async () => {
    if (examState.answers.size === 0) return;
    setExamState({ autoSaveStatus: "saving" });

    try {
      const answersArray = Array.from(examState.answers.values());

      // Gọi Service thay vì xử lý trực tiếp
      await submissionService.saveAnswers(exam._id, answersArray);

      console.log("[AutoSave] Synced", answersArray.length, "answers");
      setExamState({ autoSaveStatus: "saved" });
      setTimeout(() => setExamState({ autoSaveStatus: "idle" }), 2000);
    } catch (error) {
      console.error("[AutoSave] Failed:", error);
      setExamState({ autoSaveStatus: "error" });
    }
  };

  const submitExam = async () => {
    if (examState.isSubmitting) return;
    setExamState({ isSubmitting: true });

    try {
      const answersArray = Array.from(examState.answers.values());

      // Gọi Service
      await submissionService.submitExam(exam._id, answersArray);

      console.log("[Submit] Exam submitted successfully");
      // Sau này có thể thêm router.push('/result') ở đây hoặc ở UI component
    } catch (error) {
      console.error("[Submit] Failed:", error);
      // Xử lý lỗi (toast notification...)
    } finally {
      // Logic xử lý loading state (có thể giữ true nếu chuyển trang ngay lập tức)
      // setExamState({ isSubmitting: false });
    }
  };

  // --- 5. PROVIDER VALUE ---
  const value = {
    exam,
    submission,
    examState,
    timeRemaining: examState.timeRemaining,
    isTimeUp,
    currentQuestion,
    setExamState,
    goToQuestion,
    goToNextQuestion,
    goToPreviousQuestion,
    updateAnswer,
    getAnswer,
    toggleFlag,
    submitExam,
    autoSave,
  };

  return <ExamContext.Provider value={value}>{children}</ExamContext.Provider>;
};
