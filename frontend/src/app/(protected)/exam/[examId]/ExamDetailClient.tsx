"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { StartExamPanel } from "@/features/exam/components/exam-instructions";
import { ExamWithDetails } from "@/features/exam/types";

interface Props {
  exam: ExamWithDetails;
}

export default function ExamDetailClient({ exam }: Props) {
  const router = useRouter();

  const handleStartExam = () => {
    router.push(`/exam/${exam._id}/take`);
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
