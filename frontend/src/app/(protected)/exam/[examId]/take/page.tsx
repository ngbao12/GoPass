"use client";

import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { examService } from "@/services/exam/exam.service";
import TakeExamClient from "./TakeExamClient";
import NotificationModal from "@/components/ui/NotificationModal";

export default function TakeExamPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const examId = params?.examId as string;

  const [exam, setExam] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [notification, setNotification] = useState<{
    show: boolean;
    type: "success" | "error";
    message: string;
  }>({ show: false, type: "error", message: "" });

  useEffect(() => {
    const fetchData = async () => {
      if (!examId) {
        setError(true);
        setLoading(false);
        return;
      }

      try {
        // Get assignmentId, contestId, and preview mode from searchParams
        const assignmentId = searchParams?.get("assignmentId") || undefined;
        const contestId = searchParams?.get("contestId") || undefined;
        const isPreviewMode = searchParams?.get("preview") === "true";

        // Fetch exam data with context
        console.log("📖 Fetching exam data...", {
          examId,
          assignmentId,
          contestId,
          isPreviewMode,
        });
        const examData = await examService.getExamById(
          examId,
          assignmentId,
          contestId,
          isPreviewMode
        );

        console.log("📊 Exam data loaded:", {
          hasData: !!examData,
          title: examData?.title,
          questionsCount: examData?.questions?.length,
          hasUserSubmission: !!examData?.userSubmission,
          isPreviewMode,
        });

        if (!examData) {
          setError(true);
          return;
        }

        // Skip submission creation for teacher preview mode
        if (isPreviewMode) {
          console.log("👁️ Preview mode - no submission needed");
          // Preview mode doesn't need submission - teacher just views questions
        } else {
          // Submission MUST exist at this point (created in Start Panel)
          if (!examData.userSubmission) {
            console.error(
              "❌ CRITICAL: No submission found! Should have been created in Start Panel."
            );
            setNotification({
              show: true,
              type: "error",
              message:
                "Không tìm thấy bài làm. Vui lòng quay lại và bắt đầu lại.",
            });
            setError(true);
            return;
          }

          if (examData.userSubmission.status === "in_progress") {
            // Has in-progress submission - this is correct flow
            console.log(
              "✅ Found in-progress submission:",
              examData.userSubmission._id
            );
          } else {
            // Submission exists but already completed/graded - shouldn't be here
            console.warn(
              "⚠️ Submission already completed:",
              examData.userSubmission.status
            );
            setNotification({
              show: true,
              type: "error",
              message: "Bài thi này đã hoàn thành. Không thể làm lại.",
            });
            setError(true);
            return;
          }
        }

        setExam(examData);
      } catch (err) {
        console.error("❌ Error loading exam:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [examId, searchParams]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading exam...</p>
        </div>
      </div>
    );
  }

  if (error || !exam) {
    return (
      <>
        <NotificationModal
          isOpen={notification.show}
          onClose={() => setNotification({ ...notification, show: false })}
          type={notification.type}
          message={notification.message}
        />
        <div className="h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Exam Not Found
            </h1>
            <p className="text-gray-600">
              The exam you're looking for doesn't exist.
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <NotificationModal
        isOpen={notification.show}
        onClose={() => setNotification({ ...notification, show: false })}
        type={notification.type}
        message={notification.message}
      />
      <TakeExamClient
        exam={exam}
        isPreviewMode={searchParams?.get("preview") === "true"}
      />
    </>
  );
}
