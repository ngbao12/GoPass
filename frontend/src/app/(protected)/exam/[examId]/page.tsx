// src/app/(protected)/exam/[examId]/page.tsx
"use client";

import React, { use } from "react";
import { useRouter, notFound } from "next/navigation";
import { getMockExamById } from "@/features/exam/data/mock-exam";
import { StartExamPanel } from "@/features/exam/components/exam-instructions";

export default function ExamDetailPage({
  params,
}: {
  params: Promise<{ examId: string }>;
}) {
  const { examId } = use(params);
  const router = useRouter();

  // 2. Lấy dữ liệu với chế độ Strict
  const exam = getMockExamById(examId);

  // 3. Nếu không tìm thấy (null) -> Chặn luôn, ném ra trang 404
  if (!exam) {
    notFound();
  }

  const handleStartExam = () => {
    router.push(`/exam/${examId}/take`);
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
