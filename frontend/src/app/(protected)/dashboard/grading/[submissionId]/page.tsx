"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  gradingService,
  type SubmissionDetail,
  type Answer,
} from "@/services/grading";

export default function GradingDetailPage() {
  const router = useRouter();
  const params = useParams();
  const submissionId = params?.submissionId as string;

  const [submission, setSubmission] = useState<SubmissionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [aiGrading, setAiGrading] = useState(false);
  const [aiGradingResult, setAiGradingResult] = useState<string | null>(null);
  const [editingAnswer, setEditingAnswer] = useState<string | null>(null);
  const [manualScore, setManualScore] = useState<{ [key: string]: string }>({});
  const [manualFeedback, setManualFeedback] = useState<{
    [key: string]: string;
  }>({});
  const [savingAnswer, setSavingAnswer] = useState<string | null>(null);

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
      const data = await gradingService.getSubmissionDetail(submissionId);
      setSubmission(data);
      console.log("Submission data:", data);
      console.log("Loaded submission detail:", data.examId.subject);
    } catch (err: any) {
      setError(err.message || "Failed to load submission");
      console.error("Error loading submission:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAiGrading = async () => {
    if (!submission) return;

    // Warn if not Ngữ Văn but allow grading
    if (submission.examId.subject !== "Ngữ Văn") {
      const proceed = confirm(
        `Môn học hiện tại là "${submission.examId.subject}". AI grading được tối ưu cho môn Ngữ Văn. Bạn có muốn tiếp tục?`
      );
      if (!proceed) return;
    }

    if (!confirm("Bạn có chắc chắn muốn sử dụng AI để chấm bài thi này?")) {
      return;
    }

    try {
      setAiGrading(true);
      setAiGradingResult(null);

      const result = await gradingService.autoGradeNguVan(submissionId);

      setAiGradingResult(
        `✅ AI đã chấm thành công ${
          result.gradedCount
        } câu trả lời. Tổng điểm: ${result.totalScore.toFixed(2)}`
      );

      // Reload submission to show updated scores
      await loadSubmission();
    } catch (err: any) {
      setAiGradingResult(
        `❌ Lỗi khi chấm bài: ${err.message || "Unknown error"}`
      );
      console.error("Error during AI grading:", err);
    } finally {
      setAiGrading(false);
    }
  };

  const getQuestionTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      "multiple-choice": "Trắc nghiệm",
      "true-false": "Đúng/Sai",
      "short-answer": "Câu hỏi ngắn",
      essay: "Tự luận",
    };
    return labels[type] || type;
  };

  const handleEditAnswer = (
    answerId: string,
    currentScore?: number,
    currentFeedback?: string
  ) => {
    setEditingAnswer(answerId);
    setManualScore({
      ...manualScore,
      [answerId]: currentScore?.toString() || "",
    });
    setManualFeedback({ ...manualFeedback, [answerId]: currentFeedback || "" });
  };

  const handleCancelEdit = (answerId: string) => {
    setEditingAnswer(null);
    const newScores = { ...manualScore };
    const newFeedbacks = { ...manualFeedback };
    delete newScores[answerId];
    delete newFeedbacks[answerId];
    setManualScore(newScores);
    setManualFeedback(newFeedbacks);
  };

  const handleSaveManualGrade = async (answerId: string, maxScore: number) => {
    const score = parseFloat(manualScore[answerId] || "0");
    const feedback = manualFeedback[answerId] || "";

    if (isNaN(score) || score < 0 || score > maxScore) {
      alert(`Điểm số phải từ 0 đến ${maxScore}`);
      return;
    }

    try {
      setSavingAnswer(answerId);
      await gradingService.gradeAnswer(submissionId, answerId, {
        score,
        feedback,
      });

      // Reload submission to show updated scores
      await loadSubmission();
      setEditingAnswer(null);
    } catch (err: any) {
      alert(`Lỗi khi lưu điểm: ${err.message || "Unknown error"}`);
      console.error("Error saving manual grade:", err);
    } finally {
      setSavingAnswer(null);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString("vi-VN");
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error || !submission) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
          <p className="text-red-600 mb-4">{error || "Submission not found"}</p>
          <button
            onClick={() => router.push("/dashboard/grading")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            ← Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.push("/dashboard/grading")}
          className="text-blue-600 hover:text-blue-800 mb-4 flex items-center gap-2"
        >
          ← Quay lại danh sách
        </button>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Chi tiết bài thi
        </h1>
      </div>

      {/* Submission Info Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">Thông tin bài thi</h2>
            <div className="space-y-2">
              <div>
                <span className="text-sm text-gray-600">Tên bài thi:</span>
                <p className="font-medium">{submission.examId.title}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Môn học:</span>
                <p>
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                    {submission.examId.subject}
                  </span>
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Trạng thái:</span>
                <p>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      submission.status === "graded"
                        ? "bg-green-100 text-green-800"
                        : submission.status === "submitted"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {submission.status === "graded"
                      ? "Đã chấm"
                      : submission.status === "submitted"
                      ? "Đã nộp"
                      : "Đang làm"}
                  </span>
                </p>
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-4">Thông tin học sinh</h2>
            <div className="space-y-2">
              <div>
                <span className="text-sm text-gray-600">Họ tên:</span>
                <p className="font-medium">{submission.studentUserId.name}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Email:</span>
                <p className="text-sm">{submission.studentUserId.email}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Ngày nộp:</span>
                <p className="text-sm">{formatDate(submission.submittedAt)}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Tổng điểm:</span>
                <p className="text-2xl font-bold text-blue-600">
                  {submission.totalScore !== undefined
                    ? submission.totalScore.toFixed(2)
                    : "-"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Grading Button - Show for all subjects but warn if not Ngữ Văn */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg shadow-sm border border-purple-200 p-6 mb-6">
        {/* AI Grading Result */}
        {aiGradingResult && (
          <div
            className={`mt-4 p-4 rounded-lg ${
              aiGradingResult.startsWith("✅")
                ? "bg-green-100 border border-green-200 text-green-800"
                : "bg-red-100 border border-red-200 text-red-800"
            }`}
          >
            {aiGradingResult}
          </div>
        )}
      </div>

      {/* Answers List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold mb-4">
          Câu trả lời ({submission.answers.length})
        </h2>

        <div className="space-y-6">
          {submission.answers.map((answer, index) => (
            <div
              key={answer._id}
              className="border-b border-gray-200 pb-6 last:border-b-0"
            >
              {/* Question Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-gray-900">
                      Câu {index + 1}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                      {getQuestionTypeLabel(answer.questionId.type)}
                    </span>
                    {answer.isAutoGraded && (
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">
                        🤖 AI đã chấm
                      </span>
                    )}
                  </div>
                  <div
                    className="text-gray-700 prose max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: answer.questionId.content,
                    }}
                  />
                </div>
              </div>

              {/* Answer Content */}
              <div className="bg-gray-50 rounded-lg p-4 mb-3">
                <div className="text-sm text-gray-600 mb-1">
                  Câu trả lời của học sinh:
                </div>
                {answer.answerText ? (
                  <div className="text-gray-900 whitespace-pre-wrap">
                    {answer.answerText}
                  </div>
                ) : answer.selectedOptions &&
                  answer.selectedOptions.length > 0 ? (
                  <div className="text-gray-900">
                    {answer.selectedOptions.join(", ")}
                  </div>
                ) : (
                  <div className="text-gray-400 italic">Chưa trả lời</div>
                )}
              </div>

              {/* Reference Answer */}
              {answer.questionId.explanation && (
                <div className="bg-blue-50 rounded-lg p-4 mb-3">
                  <div className="text-sm text-blue-600 font-medium mb-1">
                    Đáp án tham khảo:
                  </div>
                  <div
                    className="text-gray-700 prose max-w-none text-sm"
                    dangerouslySetInnerHTML={{
                      __html: answer.questionId.explanation,
                    }}
                  />
                </div>
              )}

              {/* Score and Feedback */}
              <div className="grid grid-cols-1 gap-4">
                {editingAnswer === answer._id ? (
                  /* Edit Mode */
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Điểm số (Tối đa: {answer.questionId.maxScore || 10})
                        </label>
                        <input
                          type="number"
                          min="0"
                          max={answer.questionId.maxScore || 10}
                          step="0.25"
                          value={manualScore[answer._id] || ""}
                          onChange={(e) =>
                            setManualScore({
                              ...manualScore,
                              [answer._id]: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Nhập điểm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nhận xét
                        </label>
                        <textarea
                          value={manualFeedback[answer._id] || ""}
                          onChange={(e) =>
                            setManualFeedback({
                              ...manualFeedback,
                              [answer._id]: e.target.value,
                            })
                          }
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Nhập nhận xét cho học sinh..."
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            handleSaveManualGrade(
                              answer._id,
                              answer.questionId.maxScore || 10
                            )
                          }
                          disabled={savingAnswer === answer._id}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                        >
                          {savingAnswer === answer._id
                            ? "Đang lưu..."
                            : "💾 Lưu điểm"}
                        </button>
                        <button
                          onClick={() => handleCancelEdit(answer._id)}
                          disabled={savingAnswer === answer._id}
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
                        >
                          Hủy
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* View Mode */
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Điểm số
                        </label>
                        <div
                          className={`text-2xl font-bold ${
                            answer.score !== undefined
                              ? "text-green-600"
                              : "text-gray-400"
                          }`}
                        >
                          {answer.score !== undefined
                            ? `${answer.score.toFixed(2)} / ${
                                answer.questionId.maxScore || 10
                              }`
                            : "Chưa chấm"}
                        </div>
                        {answer.gradedAt && (
                          <div className="text-xs text-gray-500 mt-1">
                            Chấm lúc: {formatDate(answer.gradedAt)}
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nhận xét
                        </label>
                        {answer.feedback ? (
                          <div className="text-sm text-gray-700 bg-yellow-50 rounded p-3 whitespace-pre-wrap max-h-48 overflow-y-auto">
                            {answer.feedback}
                          </div>
                        ) : (
                          <div className="text-sm text-gray-400 italic">
                            Chưa có nhận xét
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Edit Button - only show in view mode */}
                    <div className="mt-2">
                      <button
                        onClick={() =>
                          handleEditAnswer(
                            answer._id,
                            answer.score,
                            answer.feedback
                          )
                        }
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                        {answer.score !== undefined ? "Sửa điểm" : "Chấm điểm"}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="text-sm text-blue-600 font-medium">Tổng câu hỏi</div>
          <div className="text-2xl font-bold text-blue-900">
            {submission.answers.length}
          </div>
        </div>
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <div className="text-sm text-green-600 font-medium">Đã chấm</div>
          <div className="text-2xl font-bold text-green-900">
            {submission.answers.filter((a) => a.score !== undefined).length}
          </div>
        </div>
        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
          <div className="text-sm text-purple-600 font-medium">AI đã chấm</div>
          <div className="text-2xl font-bold text-purple-900">
            {submission.answers.filter((a) => a.isAutoGraded).length}
          </div>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
          <div className="text-sm text-yellow-600 font-medium">Tổng điểm</div>
          <div className="text-2xl font-bold text-yellow-900">
            {submission.totalScore !== undefined
              ? submission.totalScore.toFixed(2)
              : "-"}
          </div>
        </div>
      </div>
    </div>
  );
}
