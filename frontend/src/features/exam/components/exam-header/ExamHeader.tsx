// src/features/exam/components/exam-header/ExamHeader.tsx
"use client";

import React from "react";
import Timer from "@/components/ui/Timer";
import ProgressBar from "@/components/ui/ProgressBar";
import Button from "@/components/ui/Button";

interface ExamHeaderProps {
  examTitle: string;
  currentQuestion: number;
  totalQuestions: number;
  timeRemaining: number;
  onSubmit: () => void;
  isSubmitting: boolean;
}

const ExamHeader: React.FC<ExamHeaderProps> = ({
  examTitle,
  currentQuestion,
  totalQuestions,
  timeRemaining,
  onSubmit,
  isSubmitting,
}) => {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-50 shadow-sm">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex-1">
          <h1 className="text-xl font-bold text-gray-900">{examTitle}</h1>
          <p className="text-sm text-gray-600 mt-1">
            Question {currentQuestion} of {totalQuestions}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Timer timeRemaining={timeRemaining} />

          <Button
            variant="primary"
            onClick={onSubmit}
            disabled={isSubmitting}
            className="min-w-[120px]"
          >
            {isSubmitting ? "Submitting..." : "Submit Exam"}
          </Button>
        </div>
      </div>

      <ProgressBar
        current={currentQuestion}
        total={totalQuestions}
        className="mt-3"
      />
    </div>
  );
};

export default ExamHeader;
