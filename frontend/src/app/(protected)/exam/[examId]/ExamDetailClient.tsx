"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { StartExamPanel } from "@/features/exam/components/exam-instructions";
import { ExamWithDetails } from "@/features/exam/types";
import { examStorage } from "@/utils/exam-storage";
import { examService } from "@/services/exam/exam.service";

interface Props {
  exam: ExamWithDetails;
}

export default function ExamDetailClient({ exam }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [hasProgress, setHasProgress] = useState(false);
  const [isCreatingSubmission, setIsCreatingSubmission] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Get assignment/contest IDs and returnUrl from URL if present
  const assignmentId = searchParams?.get("assignmentId") || undefined;
  const contestId = searchParams?.get("contestId") || undefined;
  const returnUrl = searchParams?.get("returnUrl") || undefined;

  // Check for existing progress (localStorage OR in-progress submission)
  useEffect(() => {
    const checkProgress = async () => {
      // Check localStorage first
      const hasLocalProgress = examStorage.hasProgress(exam._id);

      // Check if exam has in-progress submission from backend
      const hasInProgressSubmission =
        exam.userSubmission?.status === "in_progress";

      console.log("🔍 Checking progress:", {
        hasLocalProgress,
        hasInProgressSubmission,
        submissionStatus: exam.userSubmission?.status,
      });

      setHasProgress(hasLocalProgress || hasInProgressSubmission);
      setIsLoading(false);
    };

    checkProgress();
  }, [exam._id, exam.userSubmission]);

  const handleStartNew = async () => {
    try {
      setIsCreatingSubmission(true);

      // Clear old progress from localStorage
      examStorage.clear(exam._id);

      console.log("🆕 Starting fresh exam - creating submission now...", {
        examId: exam._id,
        assignmentId,
        contestId,
      });

      // Create submission immediately when starting (not on take page)
      // This ensures student can resume even if they exit at Start Panel
      const submissionData = await examService.createSubmission(
        exam._id,
        assignmentId,
        contestId
      );

      if (!submissionData) {
        throw new Error("Failed to create submission");
      }

      console.log("✅ Submission created:", submissionData._id);

      // Build URL with query params
      const params = new URLSearchParams();
      if (assignmentId) params.append("assignmentId", assignmentId);
      if (contestId) params.append("contestId", contestId);
      if (returnUrl) params.append("returnUrl", returnUrl);
      const queryString = params.toString();

      // Navigate to take page with existing submission
      router.push(
        `/exam/${exam._id}/take${queryString ? `?${queryString}` : ""}`
      );
    } catch (error) {
      console.error("❌ Error starting exam:", error);
      alert("Failed to start exam. Please try again.");
      setIsCreatingSubmission(false);
    }
  };

  const handleContinue = () => {
    // Giữ nguyên dữ liệu -> Context sẽ tự load
    const params = new URLSearchParams();
    if (assignmentId) params.append("assignmentId", assignmentId);
    if (contestId) params.append("contestId", contestId);
    if (returnUrl) params.append("returnUrl", returnUrl);
    const queryString = params.toString();

    router.push(
      `/exam/${exam._id}/take${queryString ? `?${queryString}` : ""}`
    );
  };

  const handleCancel = () => {
    // If returnUrl exists (from class), go back there; otherwise go to practice
    if (returnUrl) {
      router.push(decodeURIComponent(returnUrl));
    } else {
      router.push("/dashboard/practice");
    }
  };

  // Show loading while checking for progress
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">Đang kiểm tra tiến độ...</p>
        </div>
      </div>
    );
  }

  return (
    <StartExamPanel
      examTitle={exam.title}
      examSubject={exam.subject}
      durationMinutes={exam.durationMinutes}
      totalQuestions={exam.totalQuestions || 0}
      totalPoints={exam.totalPoints || 0}
      onStartExam={handleStartNew}
      onContinueExam={handleContinue}
      hasProgress={hasProgress}
      onCancel={handleCancel}
      isLoading={isCreatingSubmission}
    />
  );
}
