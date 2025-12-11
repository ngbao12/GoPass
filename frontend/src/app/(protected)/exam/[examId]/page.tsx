// src/app/(protected)/exam/[examId]/page.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { mockExam } from "@/features/exam/data/mock-exam";
import StartExamPanel from "@/features/exam/components/exam-instructions/StartExamPanel";

/**
 * Page hiển thị thông tin và hướng dẫn trước khi bắt đầu làm bài
 * Pure routing component - logic được đẩy vào service và component
 */
export default function ExamDetailPage({
  params,
}: {
  params: { examId: string };
}) {
  const router = useRouter();

  // TODO: Fetch exam data from API using examId
  // const exam = await examService.getExamById(params.examId);
  const exam = mockExam;

  const handleStartExam = () => {
    router.push(`/exam/${params.examId}/take`);
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <StartExamPanel
      examTitle={exam.title}
      examSubject={exam.subject}
      durationMinutes={exam.durationMinutes}
      totalQuestions={exam.totalQuestions || 0}
      totalPoints={exam.totalPoints || 0}
      onStartExam={handleStartExam}
      onCancel={handleCancel}
    />
  );
}
