// src/app/(protected)/exam/[examId]/take/page.tsx
"use client";

import React, { useState } from "react";
import { ExamProvider, useExam } from "@/features/exam/context/ExamContext";
import { mockExam } from "@/features/exam/data/mock-exam";
import {
  ExamHeader,
  QuestionSidebar,
  QuestionCard,
  ExitExamDialog,
  ReadingPassagePanel,
  QuestionNavigationButtons,
  SubmitConfirmationDialog,
  SubmitSuccessDialog,
} from "@/features/exam/components/shared";
import { getExamLayout } from "@/features/exam/config/exam-layouts.config";

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
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  if (!exam || !currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Đang tải bài thi...</p>
      </div>
    );
  }

  // Get layout config based on exam type (TODO: get from backend)
  const layoutType =
    exam.subject === "english" ? "reading-passage" : "standard";
  const layout = getExamLayout(layoutType);

  // Group questions by section
  const questionsBySections = exam.questions.reduce((acc, q, idx) => {
    const section = q.section || "Phần I";
    if (!acc[section]) {
      acc[section] = [];
    }
    acc[section].push({
      questionId: q.questionId,
      order: idx + 1,
      isAnswered:
        examState.answers.has(q.questionId) &&
        examState.answers.get(q.questionId)!.isAnswered,
      isFlagged: examState.flaggedQuestions.has(q.questionId),
      isActive: idx === examState.currentQuestionIndex,
    });
    return acc;
  }, {} as Record<string, any[]>);

  const handleSubmitClick = () => {
    setShowSubmitDialog(true);
  };

  const handleConfirmSubmit = () => {
    setShowSubmitDialog(false);
    submitExam();
    // Show success dialog after short delay
    setTimeout(() => {
      setShowSuccessDialog(true);
    }, 300);
  };

  const handleExitClick = () => {
    setShowExitDialog(true);
  };

  const handleConfirmExit = () => {
    // TODO: navigate to exam list
    window.location.href = "/exam";
  };

  const handleGoToDashboard = () => {
    window.location.href = "/dashboard";
  };

  // Calculate statistics for submit dialog
  const answeredCount = Array.from(examState.answers.values()).filter(
    (a) => a.isAnswered
  ).length;

  const unansweredQuestions = exam.questions
    .map((q, idx) => ({
      number: idx + 1,
      section: q.section || "Phần I",
      questionId: q.questionId,
    }))
    .filter(
      (q) =>
        !examState.answers.has(q.questionId) ||
        !examState.answers.get(q.questionId)!.isAnswered
    );

  const flaggedQuestions = exam.questions
    .map((q, idx) => ({
      number: idx + 1,
      section: q.section || "Phần I",
      questionId: q.questionId,
    }))
    .filter((q) => examState.flaggedQuestions.has(q.questionId));

  // Format time remaining
  const formatTimeRemaining = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Format submission time
  const formatSubmissionTime = (): string => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, "0")}:${now
      .getMinutes()
      .toString()
      .padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")} ${now
      .getDate()
      .toString()
      .padStart(2, "0")}/${(now.getMonth() + 1)
      .toString()
      .padStart(2, "0")}/${now.getFullYear()}`;
  };

  // Check if last in section
  const currentSectionQuestions = Object.values(questionsBySections)
    .flat()
    .filter((q) => {
      const qIdx = exam.questions.findIndex(
        (eq) => eq.questionId === q.questionId
      );
      const currentQ = exam.questions[examState.currentQuestionIndex];
      return exam.questions[qIdx].section === currentQ.section;
    });
  const currentIndexInSection = currentSectionQuestions.findIndex(
    (q) => q.questionId === currentQuestion.questionId
  );
  const isLastInSection =
    currentIndexInSection === currentSectionQuestions.length - 1;
  const isLastQuestion =
    examState.currentQuestionIndex === exam.questions.length - 1;

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Fixed Header */}
      <ExamHeader
        examTitle={exam.title}
        examSubject={exam.subject || "Thi thử"}
        timeRemaining={timeRemaining}
        onExit={handleExitClick}
        onSubmit={handleSubmitClick}
      />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Question Navigation */}
        <QuestionSidebar
          sections={questionsBySections}
          onQuestionClick={(questionId) => {
            const index = exam.questions.findIndex(
              (q) => q.questionId === questionId
            );
            goToQuestion(index);
          }}
        />

        {/* Center Content - varies by layout */}
        {layout.type === "reading-passage" ? (
          // Two-column layout for English
          <div className="flex-1 flex overflow-hidden">
            {/* Left: Reading Passage */}
            <div className="w-1/2">
              <ReadingPassagePanel
                title={exam.readingPassage?.title || "Reading Passage"}
                content={exam.readingPassage?.content || ""}
                audioUrl={exam.readingPassage?.audioUrl}
              />
            </div>

            {/* Right: Question */}
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto p-4">
                <QuestionCard
                  question={currentQuestion.question!}
                  questionNumber={examState.currentQuestionIndex + 1}
                  sectionName={currentQuestion.section || "Phần I"}
                  sectionBadgeColor="bg-blue-100 text-blue-700"
                  points={
                    currentQuestion.points || currentQuestion.maxScore || 1
                  }
                  selectedAnswer={
                    examState.answers.get(currentQuestion.questionId)?.answer
                  }
                  onAnswerChange={(answer) =>
                    updateAnswer(currentQuestion.questionId, {
                      questionId: currentQuestion.questionId,
                      answer,
                      isAnswered: true,
                      lastModified: new Date(),
                    })
                  }
                  isFlagged={examState.flaggedQuestions.has(
                    currentQuestion.questionId
                  )}
                  onToggleFlag={() => toggleFlag(currentQuestion.questionId)}
                />
              </div>

              {/* Navigation Buttons */}
              <div className="flex-shrink-0 p-4 border-t border-gray-200">
                <QuestionNavigationButtons
                  currentQuestionIndex={examState.currentQuestionIndex}
                  totalQuestions={exam.questions.length}
                  isLastInSection={isLastInSection}
                  isLastQuestion={isLastQuestion}
                  onPrevious={goToPreviousQuestion}
                  onNext={goToNextQuestion}
                  onNextSection={goToNextQuestion}
                />
              </div>
            </div>
          </div>
        ) : (
          // Standard layout for Math/Vietnamese
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto p-4">
              <QuestionCard
                question={currentQuestion.question!}
                questionNumber={examState.currentQuestionIndex + 1}
                sectionName={currentQuestion.section || "Phần I"}
                sectionBadgeColor="bg-blue-100 text-blue-700"
                points={currentQuestion.points || currentQuestion.maxScore || 1}
                selectedAnswer={
                  examState.answers.get(currentQuestion.questionId)?.answer
                }
                onAnswerChange={(answer) =>
                  updateAnswer(currentQuestion.questionId, {
                    questionId: currentQuestion.questionId,
                    answer,
                    isAnswered: true,
                    lastModified: new Date(),
                  })
                }
                isFlagged={examState.flaggedQuestions.has(
                  currentQuestion.questionId
                )}
                onToggleFlag={() => toggleFlag(currentQuestion.questionId)}
              />
            </div>

            {/* Navigation Buttons */}
            <div className="flex-shrink-0 p-4 border-t border-gray-200">
              <QuestionNavigationButtons
                currentQuestionIndex={examState.currentQuestionIndex}
                totalQuestions={exam.questions.length}
                isLastInSection={isLastInSection}
                isLastQuestion={isLastQuestion}
                onPrevious={goToPreviousQuestion}
                onNext={goToNextQuestion}
                onNextSection={goToNextQuestion}
              />
            </div>
          </div>
        )}
      </div>

      {/* Auto-save Indicator */}
      {examState.autoSaveStatus === "saving" && (
        <div className="fixed bottom-6 right-6 bg-white px-4 py-2.5 rounded-lg shadow-lg border border-gray-300">
          <span className="text-sm text-gray-600 flex items-center gap-2">
            <svg
              className="w-4 h-4 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Đang lưu...
          </span>
        </div>
      )}
      {examState.autoSaveStatus === "saved" && (
        <div className="fixed bottom-6 right-6 bg-green-50 px-4 py-2.5 rounded-lg shadow-lg border border-green-200">
          <span className="text-sm text-green-600 flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            Đã lưu
          </span>
        </div>
      )}

      {/* Exit Dialog */}
      <ExitExamDialog
        isOpen={showExitDialog}
        onClose={() => setShowExitDialog(false)}
        onConfirm={handleConfirmExit}
      />

      {/* Submit Confirmation Dialog */}
      <SubmitConfirmationDialog
        isOpen={showSubmitDialog}
        onClose={() => setShowSubmitDialog(false)}
        onConfirm={handleConfirmSubmit}
        timeRemaining={formatTimeRemaining(timeRemaining)}
        answeredCount={answeredCount}
        totalQuestions={exam.questions.length}
        unansweredQuestions={unansweredQuestions}
        flaggedQuestions={flaggedQuestions}
      />

      {/* Submit Success Dialog */}
      <SubmitSuccessDialog
        isOpen={showSuccessDialog}
        examTitle={exam.title}
        examSubject={exam.subject || "Thi thử"}
        submittedAt={formatSubmissionTime()}
        completionStatus={{
          answered: answeredCount,
          total: exam.questions.length,
        }}
        onGoToDashboard={handleGoToDashboard}
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
