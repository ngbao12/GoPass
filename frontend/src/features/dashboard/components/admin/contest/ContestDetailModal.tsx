"use client";

import React, { useState, useEffect } from "react";
import {
  Contest,
  contestAdminService,
} from "@/services/admin/contestAdmin.service";
import { formatDateTimeVN } from "@/utils/format-date";

interface ContestDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  contestId: string;
}

const ContestDetailModal: React.FC<ContestDetailModalProps> = ({
  isOpen,
  onClose,
  contestId,
}) => {
  const [contest, setContest] = useState<Contest | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && contestId) {
      fetchContestDetail();
    }
  }, [isOpen, contestId]);

  const fetchContestDetail = async () => {
    setLoading(true);
    try {
      const data = await contestAdminService.getContestById(contestId);
      if (data) {
        console.log("Contest detail loaded:", data);
        console.log("Contest exams:", data.exams);
        setContest(data);
      }
    } catch (error) {
      console.error("Error fetching contest detail:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { bg: string; text: string; label: string }> =
      {
        upcoming: {
          bg: "bg-amber-100",
          text: "text-amber-700",
          label: "Sắp diễn ra",
        },
        ongoing: {
          bg: "bg-green-100",
          text: "text-green-700",
          label: "Đang diễn ra",
        },
        ended: {
          bg: "bg-gray-100",
          text: "text-gray-600",
          label: "Đã kết thúc",
        },
      };

    const badge = badges[status] || badges.upcoming;

    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${badge.bg} ${badge.text}`}
      >
        {badge.label}
      </span>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            Chi tiết cuộc thi
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600"></div>
            </div>
          ) : contest ? (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {contest.name}
                  </h3>
                  {getStatusBadge(contest.status)}
                </div>
                <p className="text-gray-600">{contest.description}</p>
              </div>

              {/* Time Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-blue-600 mb-1">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="font-medium">Thời gian bắt đầu</span>
                  </div>
                  <p className="text-gray-900 font-semibold">
                    {formatDateTimeVN(contest.startTime)}
                  </p>
                </div>

                <div className="bg-red-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-red-600 mb-1">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="font-medium">Thời gian kết thúc</span>
                  </div>
                  <p className="text-gray-900 font-semibold">
                    {formatDateTimeVN(contest.endTime)}
                  </p>
                </div>
              </div>

              {/* Other Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-4">
                  <svg
                    className="w-6 h-6 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <div>
                    <p className="text-sm text-gray-600">Số người tham gia</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {contest.participantsCount || 0}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-4">
                  <svg
                    className="w-6 h-6 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                    />
                  </svg>
                  <div>
                    <p className="text-sm text-gray-600">Trạng thái</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {contest.isPublic ? "Công khai" : "Riêng tư"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Exams List */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  Đề thi trong cuộc thi ({contest.exams?.length || 0})
                </h4>
                {contest.exams && contest.exams.length > 0 ? (
                  <div className="space-y-2">
                    {contest.exams.map((exam: any, index: number) => {
                      // Handle both populated and non-populated examId
                      const examData =
                        typeof exam.examId === "object" && exam.examId !== null
                          ? exam.examId
                          : null;

                      // Skip if exam is null (deleted exam)
                      if (!examData && typeof exam.examId !== "string") {
                        return null;
                      }

                      const examId = examData?._id || exam.examId;
                      const examTitle =
                        examData?.title || "Đề thi không tồn tại";
                      const examSubject = examData?.subject || "";
                      const examQuestions = examData?.totalQuestions || 0;

                      return (
                        <div
                          key={examId || index}
                          className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 flex-1">
                              <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-teal-600 font-semibold">
                                  {exam.order}
                                </span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-900 truncate">
                                  {examTitle}
                                </p>
                                <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                                  {examSubject && (
                                    <span className="flex items-center gap-1">
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
                                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                        />
                                      </svg>
                                      {examSubject}
                                    </span>
                                  )}
                                  {examQuestions > 0 && (
                                    <span className="flex items-center gap-1">
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
                                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                        />
                                      </svg>
                                      {examQuestions} câu
                                    </span>
                                  )}
                                  <span className="flex items-center gap-1">
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
                                        d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
                                      />
                                    </svg>
                                    Trọng số: {exam.weight || 1}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    Chưa có đề thi nào trong cuộc thi này
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">Không tìm thấy thông tin cuộc thi</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContestDetailModal;
