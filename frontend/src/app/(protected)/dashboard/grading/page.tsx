"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { gradingService, type Submission } from "@/services/grading";

const SUBJECTS = [
  "Toán học",
  "Ngữ Văn",
  "Tiếng Anh",
  "Vật lý",
  "Hóa học",
  "Sinh học",
  "Lịch sử",
  "Địa lý",
];
const STATUSES = [
  { value: "submitted", label: "Chờ chấm" },
  { value: "graded", label: "Đã chấm" },
];

export default function GradingSubmissionsPage() {
  const router = useRouter();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  useEffect(() => {
    loadSubmissions();
  }, [selectedSubject, selectedStatus]);

  const loadSubmissions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await gradingService.getAllSubmissions({
        subject: selectedSubject || undefined,
        status: selectedStatus || undefined,
      });
      setSubmissions(data);
      console.log("Loaded submissions:", data);
    } catch (err: any) {
      setError(err.message || "Failed to load submissions");
      console.error("Error loading submissions:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewSubmission = (submissionId: string) => {
    router.push(`/dashboard/grading/${submissionId}`);
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      "in-progress": "bg-yellow-100 text-yellow-800",
      submitted: "bg-blue-100 text-blue-800",
      graded: "bg-green-100 text-green-800",
    };
    const labels = {
      "in-progress": "Đang làm",
      submitted: "Đã nộp",
      graded: "Đã chấm",
    };
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          badges[status as keyof typeof badges]
        }`}
      >
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString("vi-VN");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Chấm bài thi</h1>
        <p className="text-gray-600">
          Quản lý và chấm điểm bài thi của học sinh
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Bộ lọc</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Subject Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Môn học
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Tất cả môn học</option>
              {SUBJECTS.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Trạng thái
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Tất cả trạng thái</option>
              {STATUSES.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>

          {/* Reset Button */}
          <div className="flex items-end">
            <button
              onClick={() => {
                setSelectedSubject("");
                setSelectedStatus("");
              }}
              className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Xóa bộ lọc
            </button>
          </div>
        </div>
      </div>

      {/* Submissions Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={loadSubmissions}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Thử lại
            </button>
          </div>
        ) : submissions.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            Không có bài thi nào
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Học sinh
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bài thi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Môn học
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Điểm
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày nộp
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {submissions.map((submission) => (
                  <tr
                    key={submission._id}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => handleViewSubmission(submission._id)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {submission.studentUserId?.name || "N/A"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {submission.studentUserId?.email || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {submission.examId?.title || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                        {submission.examId?.subject || "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(submission.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        {submission.totalScore !== undefined
                          ? `${submission.totalScore.toFixed(2)}`
                          : "-"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(submission.submittedAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewSubmission(submission._id);
                        }}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Chấm điểm →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Stats Summary */}
      {!loading && submissions.length > 0 && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="text-sm text-blue-600 font-medium">
              Tổng bài thi
            </div>
            <div className="text-2xl font-bold text-blue-900">
              {submissions.length}
            </div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
            <div className="text-sm text-yellow-600 font-medium">Chờ chấm</div>
            <div className="text-2xl font-bold text-yellow-900">
              {submissions.filter((s) => s.status === "submitted").length}
            </div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="text-sm text-green-600 font-medium">Đã chấm</div>
            <div className="text-2xl font-bold text-green-900">
              {submissions.filter((s) => s.status === "graded").length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
