"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { submissionService } from "@/services/exam/submission.service";
import ReviewExamClient from "@/app/(protected)/exam/submission/[submissionId]/ReviewExamClient";

export default function StudentReviewPage() {
  const router = useRouter();
  const params = useParams();
  const submissionId = params?.submissionId as string;

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (submissionId) {
      loadSubmission();
    }
  }, [submissionId]);

  const loadSubmission = async () => {
    if (!submissionId) return;

    try {
      setLoading(true);
      setError(null);

      const result = await submissionService.getSubmissionDetails(submissionId);

      if (!result) {
        throw new Error("Failed to load submission");
      }

      console.log("📚 Loaded submission for review:", result);
      setData(result);
    } catch (err: any) {
      setError(err.message || "Failed to load submission");
      console.error("❌ Error loading submission:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải bài làm...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">⚠️</div>
          <p className="text-gray-800 font-medium">{error}</p>
          <button
            onClick={() => router.back()}
            className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Không tìm thấy bài làm</p>
      </div>
    );
  }

  return <ReviewExamClient data={data} />;
}
