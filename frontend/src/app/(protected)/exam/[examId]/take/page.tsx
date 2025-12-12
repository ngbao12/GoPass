"use client";

import React, { useState, use } from "react";
import { useRouter, notFound } from "next/navigation";
import { ExamProvider, useExam } from "@/features/exam/context/ExamContext";
import { getMockExamById } from "@/features/exam/data/mock-exam";
import {
  ExamHeader,
  QuestionSidebar,
  QuestionCard,
  ReadingPassagePanel,
  QuestionNavigationButtons,
} from "@/features/exam/components/shared";
import {
  ExitExamDialog,
  SubmitConfirmationDialog,
  SubmitSuccessDialog,
} from "@/features/exam/components/exam-instructions";
import { getLayoutForQuestion } from "@/features/exam/config/exam-layouts.config";

function TakeExamContent() {
  const router = useRouter();
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

  // --- LOADING STATE ---
  if (!exam || !currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-[#00747F] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">Đang tải đề thi...</p>
        </div>
      </div>
    );
  }

  // --- LOGIC LAYOUT ĐỘNG ---
  const layoutConfig = getLayoutForQuestion(
    exam.subject,
    currentQuestion.section
  );

  // --- GROUP QUESTIONS LOGIC ---
  const questionsBySections = exam.questions.reduce((acc, q, idx) => {
    const section = q.section || "Phần I";
    if (!acc[section]) acc[section] = [];
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

  // --- STATISTICS ---
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

  // --- HANDLERS ---
  const handleSubmitClick = () => setShowSubmitDialog(true);

  const handleConfirmSubmit = () => {
    setShowSubmitDialog(false);
    submitExam();
    setTimeout(() => {
      setShowSuccessDialog(true);
    }, 300);
  };

  const handleExitClick = () => setShowExitDialog(true);
  const handleConfirmExit = () => router.push(`/exam/${exam._id}`);
  const handleGoToDashboard = () => router.push("/dashboard");

  // --- FORMATTERS ---
  const formatTimeRemaining = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const formatSubmissionTime = (): string => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, "0")}:${now
      .getMinutes()
      .toString()
      .padStart(2, "0")} ${now.getDate().toString().padStart(2, "0")}/${(
      now.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${now.getFullYear()}`;
  };

  // --- NAVIGATION LOGIC ---
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

  // --- MAIN CONTENT (VARIABLE JSX - FIX SCROLL ISSUE) ---
  // Sử dụng biến thay vì Component con để tránh re-mount gây mất focus/scroll
  const mainQuestionContent =
    currentQuestion && currentQuestion.question ? (
      <div className="flex flex-col h-full bg-[#F8F9FA]">
        <div className="flex-1 overflow-y-auto p-4 md:p-6 scroll-smooth custom-scrollbar">
          <div className="max-w-5xl mx-auto w-full pb-8">
            <QuestionCard
              question={currentQuestion.question}
              questionNumber={examState.currentQuestionIndex + 1}
              sectionName={currentQuestion.section || "Phần I"}
              sectionBadgeColor="bg-blue-500"
              points={currentQuestion.points || 1}
              selectedAnswer={
                examState.answers.get(currentQuestion.questionId)?.answer
              }
              onAnswerChange={(answer) => {
                // FIX TYPE MISMATCH: Đảm bảo answer luôn là string | string[]
                let finalAnswer: string | string[];

                if (typeof answer === "string" || Array.isArray(answer)) {
                  finalAnswer = answer;
                } else {
                  // Nếu QuestionCard trả về object (VD: TrueFalse), stringify nó
                  finalAnswer = JSON.stringify(answer);
                }

                updateAnswer(currentQuestion.questionId, {
                  questionId: currentQuestion.questionId,
                  answer: finalAnswer,
                  isAnswered: true,
                  lastModified: new Date(),
                });
              }}
              isFlagged={examState.flaggedQuestions.has(
                currentQuestion.questionId
              )}
              onToggleFlag={() => toggleFlag(currentQuestion.questionId)}
            />
          </div>
        </div>

        <div className="flex-shrink-0 p-4 bg-white border-t border-gray-200 z-20">
          <div className="max-w-5xl mx-auto w-full">
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
    ) : null;

  // --- RENDER ---
  return (
    <div className="h-screen flex flex-col bg-[#F8F9FA]">
      <ExamHeader
        examTitle={exam.title}
        examSubject={exam.subject || "Thi thử"}
        timeRemaining={timeRemaining}
        onExit={handleExitClick}
        onSubmit={handleSubmitClick}
        isSubmitting={examState.isSubmitting}
      />

      <div className="flex-1 flex pt-16 overflow-hidden">
        {/* Sidebar */}
        <div className="flex-shrink-0 h-full bg-white border-r border-gray-200 z-10 shadow-sm hidden lg:block">
          <QuestionSidebar
            sections={questionsBySections}
            onQuestionClick={(questionId) => {
              const index = exam.questions.findIndex(
                (q) => q.questionId === questionId
              );
              goToQuestion(index);
            }}
          />
        </div>

        {/* Content Area */}
        <main className="flex-1 flex flex-col min-w-0 bg-[#F8F9FA] relative">
          {layoutConfig.type === "reading-passage" ? (
            // --- LAYOUT 2 CỘT (SPLIT VIEW) ---
            <div className="flex-1 flex overflow-hidden">
              <div className="w-1/2 border-r border-gray-200 bg-white overflow-y-auto p-0 hidden md:block custom-scrollbar">
                <ReadingPassagePanel
                  title={exam.readingPassage?.title || "Văn bản đọc hiểu"}
                  content={exam.readingPassage?.content || ""}
                  audioUrl={exam.readingPassage?.audioUrl}
                />
              </div>
              <div className="w-full md:w-1/2 overflow-hidden">
                {mainQuestionContent}
              </div>
            </div>
          ) : (
            // --- LAYOUT 1 CỘT (STANDARD VIEW) ---
            <div className="flex-1 overflow-hidden">{mainQuestionContent}</div>
          )}
        </main>
      </div>

      {/* Dialogs */}
      <ExitExamDialog
        isOpen={showExitDialog}
        onClose={() => setShowExitDialog(false)}
        onConfirm={handleConfirmExit}
      />
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

// MAIN PAGE
export default function TakeExamPage({
  params,
}: {
  params: Promise<{ examId: string }>;
}) {
  const { examId } = use(params);

  // Lấy dữ liệu (Strict Mode)
  const mockExam = getMockExamById(examId);

  if (!mockExam) {
    notFound();
  }

  return (
    <ExamProvider initialExam={mockExam}>
      <TakeExamContent />
    </ExamProvider>
  );
}
