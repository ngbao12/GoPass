// src/app/(protected)/exam/[examId]/take/page.tsx
"use client";

import React, { useState } from "react";
import { ExamProvider, useExam } from "@/features/exam/context/ExamContext";
import { mockExam } from "@/features/exam/data/mock-exam";
import ExamHeader from "@/features/exam/components/exam-header/ExamHeader";
import QuestionCard from "@/features/exam/components/question-display/QuestionCard";
import QuestionNavigation from "@/features/exam/components/question-display/QuestionNavigation";
import Button from "@/components/ui/Button";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { QuestionNavigationItem } from "@/features/exam/types/answer";

function TakeExamContent() {
  const {
    exam,
    currentQuestion,
    examState,
    goToNextQuestion,
    goToPreviousQuestion,
    goToQuestion,
    updateAnswer,
    toggleFlag,
    submitExam,
    timeRemaining,
  } = useExam();

  const [showSubmitDialog, setShowSubmitDialog] = useState(false);

  if (!exam || !currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading exam...</p>
      </div>
    );
  }

  const navigationItems: QuestionNavigationItem[] = exam.questions.map(
    (q, idx) => ({
      questionId: q.questionId,
      order: idx + 1,
      isAnswered:
        examState.answers.has(q.questionId) &&
        examState.answers.get(q.questionId)!.isAnswered,
      isFlagged: examState.flaggedQuestions.has(q.questionId),
      isCurrentQuestion: idx === examState.currentQuestionIndex,
    })
  );

  const handleSubmitClick = () => {
    setShowSubmitDialog(true);
  };

  const handleConfirmSubmit = () => {
    setShowSubmitDialog(false);
    submitExam();
  };

  const answeredCount = Array.from(examState.answers.values()).filter(
    (a) => a.isAnswered
  ).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <ExamHeader
        examTitle={exam.title}
        currentQuestion={examState.currentQuestionIndex + 1}
        totalQuestions={exam.questions.length}
        timeRemaining={timeRemaining}
        onSubmit={handleSubmitClick}
        isSubmitting={examState.isSubmitting}
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Question Display - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            <QuestionCard
              question={currentQuestion.question!}
              questionNumber={examState.currentQuestionIndex + 1}
              answer={examState.answers.get(currentQuestion.questionId)}
              onAnswerChange={(answer) =>
                updateAnswer(currentQuestion.questionId, answer)
              }
              onFlagToggle={() => toggleFlag(currentQuestion.questionId)}
              isFlagged={examState.flaggedQuestions.has(
                currentQuestion.questionId
              )}
            />

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              <Button
                variant="secondary"
                onClick={goToPreviousQuestion}
                disabled={examState.currentQuestionIndex === 0}
              >
                ← Previous
              </Button>

              <Button
                variant="secondary"
                onClick={goToNextQuestion}
                disabled={
                  examState.currentQuestionIndex === exam.questions.length - 1
                }
              >
                Next →
              </Button>
            </div>
          </div>

          {/* Question Navigation - 1/3 width */}
          <div className="lg:col-span-1">
            <QuestionNavigation
              questions={navigationItems}
              onQuestionSelect={(qId) => {
                const index = exam.questions.findIndex(
                  (q) => q.questionId === qId
                );
                goToQuestion(index);
              }}
            />
          </div>
        </div>
      </div>

      {/* Auto-save Indicator */}
      {examState.autoSaveStatus === "saving" && (
        <div className="fixed bottom-4 right-4 bg-white px-4 py-2 rounded-lg shadow-lg border border-gray-200">
          <span className="text-sm text-gray-600">💾 Saving...</span>
        </div>
      )}
      {examState.autoSaveStatus === "saved" && (
        <div className="fixed bottom-4 right-4 bg-green-50 px-4 py-2 rounded-lg shadow-lg border border-green-200">
          <span className="text-sm text-green-600">✓ Saved</span>
        </div>
      )}

      {/* Submit Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showSubmitDialog}
        title="Submit Exam?"
        message={`Are you sure you want to submit? You have answered ${answeredCount}/${exam.questions.length} questions. Once submitted, you cannot change your answers.`}
        confirmText="Submit"
        cancelText="Review"
        onConfirm={handleConfirmSubmit}
        onCancel={() => setShowSubmitDialog(false)}
        variant="warning"
      />
    </div>
  );
}

export default function TakeExamPage({
  params,
}: {
  params: { examId: string };
}) {
  return (
    <ExamProvider initialExam={mockExam}>
      <TakeExamContent />
    </ExamProvider>
  );
}
