// src/features/exam/context/ExamContext.tsx
"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  ExamWithDetails,
  ExamQuestion,
  ExamSubmission,
  ExamState,
  AnswerData,
} from "../types";

interface ExamContextType {
  exam: ExamWithDetails | null;
  submission: ExamSubmission | null;
  examState: ExamState;
  setExamState: (state: Partial<ExamState>) => void;
  currentQuestion: ExamQuestion | null;
  goToQuestion: (index: number) => void;
  goToNextQuestion: () => void;
  goToPreviousQuestion: () => void;
  updateAnswer: (questionId: string, answer: AnswerData) => void;
  getAnswer: (questionId: string) => AnswerData | undefined;
  toggleFlag: (questionId: string) => void;
  submitExam: () => Promise<void>;
  autoSave: () => Promise<void>;
  timeRemaining: number;
  isTimeUp: boolean;
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
  const [exam] = useState<ExamWithDetails>(initialExam);
  const [submission, setSubmission] = useState<ExamSubmission | null>(null);
  const [examState, setExamStateRaw] = useState<ExamState>({
    currentQuestionIndex: 0,
    answers: new Map(),
    flaggedQuestions: new Set(),
    timeRemaining: initialExam.durationMinutes * 60,
    isSubmitting: false,
    autoSaveStatus: "idle",
  });
  const [isTimeUp, setIsTimeUp] = useState(false);

  // Timer countdown
  useEffect(() => {
    if (examState.timeRemaining <= 0) {
      setIsTimeUp(true);
      submitExam();
      return;
    }

    const interval = setInterval(() => {
      setExamStateRaw((prev) => ({
        ...prev,
        timeRemaining: Math.max(0, prev.timeRemaining - 1),
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [examState.timeRemaining]);

  // Auto-save every 30 seconds
  useEffect(() => {
    if (examState.answers.size === 0) return;

    const interval = setInterval(() => {
      autoSave();
    }, 30000);

    return () => clearInterval(interval);
  }, [examState.answers]);

  const setExamState = (partial: Partial<ExamState>) => {
    setExamStateRaw((prev) => ({ ...prev, ...partial }));
  };

  const currentQuestion =
    exam.questions[examState.currentQuestionIndex] || null;

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
    newAnswers.set(questionId, {
      ...answer,
      lastModified: new Date(),
    });
    setExamState({ answers: newAnswers });
  };

  const getAnswer = (questionId: string): AnswerData | undefined => {
    return examState.answers.get(questionId);
  };

  const toggleFlag = (questionId: string) => {
    const newFlags = new Set(examState.flaggedQuestions);
    if (newFlags.has(questionId)) {
      newFlags.delete(questionId);
    } else {
      newFlags.add(questionId);
    }
    setExamState({ flaggedQuestions: newFlags });
  };

  const autoSave = async () => {
    if (examState.answers.size === 0) return;

    setExamState({ autoSaveStatus: "saving" });

    try {
      // TODO: Call API to save answers
      // await submissionService.saveAnswers(submission!._id, Array.from(examState.answers.values()));

      console.log(
        "Auto-saving answers:",
        Array.from(examState.answers.values())
      );

      setExamState({ autoSaveStatus: "saved" });

      setTimeout(() => {
        setExamState({ autoSaveStatus: "idle" });
      }, 2000);
    } catch (error) {
      console.error("Auto-save error:", error);
      setExamState({ autoSaveStatus: "error" });
    }
  };

  const submitExam = async () => {
    setExamState({ isSubmitting: true });

    try {
      const answersArray = Array.from(examState.answers.values());

      // TODO: Call API to submit exam
      // await submissionService.submitExam(submission!._id, answersArray);

      console.log("Submitting exam with answers:", answersArray);

      alert("Exam submitted successfully!");

      // TODO: Navigate to results page
      // router.push(`/exam/${exam._id}/results`);
    } catch (error) {
      console.error("Submit error:", error);
      alert("Failed to submit exam. Please try again.");
    } finally {
      setExamState({ isSubmitting: false });
    }
  };

  const value: ExamContextType = {
    exam,
    submission,
    examState,
    setExamState,
    currentQuestion,
    goToQuestion,
    goToNextQuestion,
    goToPreviousQuestion,
    updateAnswer,
    getAnswer,
    toggleFlag,
    submitExam,
    autoSave,
    timeRemaining: examState.timeRemaining,
    isTimeUp,
  };

  return <ExamContext.Provider value={value}>{children}</ExamContext.Provider>;
};
