"use client";

import React from "react";
import Badge from "@/components/ui/Badge";

interface SelectedExam {
  _id: string;
  title: string;
  subject: string;
  durationMinutes: number;
  totalQuestions: number;
  totalPoints: number;
  order: number;
  weight: number;
}

interface ContestFormData {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  subjects: string[];
  isPublic: boolean;
}

interface ContestPreviewProps {
  formData: ContestFormData;
  selectedExams: SelectedExam[];
}

const ContestPreview: React.FC<ContestPreviewProps> = ({
  formData,
  selectedExams,
}) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return "--";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const groupedExams = selectedExams.reduce((acc, exam) => {
    if (!acc[exam.subject]) {
      acc[exam.subject] = [];
    }
    acc[exam.subject].push(exam);
    return acc;
  }, {} as Record<string, SelectedExam[]>);

  const totalWeight = selectedExams.reduce((sum, exam) => sum + exam.weight, 0);
  const totalQuestions = selectedExams.reduce(
    (sum, exam) => sum + exam.totalQuestions,
    0
  );
  const totalDuration = selectedExams.reduce(
    (sum, exam) => sum + exam.durationMinutes,
    0
  );

  return (
    <div className="bg-white border-2 border-gray-200 rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-200 p-6">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
            <svg
              className="w-9 h-9 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
              />
            </svg>
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="flex items-start justify-between gap-3 mb-2">
              <h3 className="text-2xl font-bold text-gray-900">
                {formData.title || "Tên cuộc thi"}
              </h3>
              {formData.isPublic && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Công khai
                </span>
              )}
            </div>

            {formData.description && (
              <p className="text-gray-700 mb-4 leading-relaxed">
                {formData.description}
              </p>
            )}

            {/* Stats */}
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-purple-200">
                <svg
                  className="w-5 h-5 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <div>
                  <p className="text-xs text-gray-500">Bắt đầu</p>
                  <p className="font-semibold text-gray-900">
                    {formatDate(formData.startDate)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-pink-200">
                <svg
                  className="w-5 h-5 text-pink-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <div>
                  <p className="text-xs text-gray-500">Kết thúc</p>
                  <p className="font-semibold text-gray-900">
                    {formatDate(formData.endDate)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-teal-200">
                <svg
                  className="w-5 h-5 text-teal-600"
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
                <div>
                  <p className="text-xs text-gray-500">Tổng đề thi</p>
                  <p className="font-semibold text-gray-900">
                    {selectedExams.length} đề
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Exam List by Subject */}
      {selectedExams.length > 0 && (
        <div className="p-6 space-y-6">
          {/* Overall Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-blue-700 font-medium">
                    Tổng số câu hỏi
                  </p>
                  <p className="text-2xl font-bold text-blue-900">
                    {totalQuestions}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-4 border border-amber-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
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
                </div>
                <div>
                  <p className="text-xs text-amber-700 font-medium">
                    Tổng thời gian
                  </p>
                  <p className="text-2xl font-bold text-amber-900">
                    {totalDuration} phút
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-purple-700 font-medium">
                    Tổng trọng số
                  </p>
                  <p className="text-2xl font-bold text-purple-900">
                    {totalWeight.toFixed(1)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Exams by Subject */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-teal-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              </svg>
              Danh sách đề thi theo môn
            </h4>

            {Object.entries(groupedExams).map(([subject, exams]) => (
              <div
                key={subject}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                {/* Subject Header */}
                <div className="bg-gradient-to-r from-teal-50 to-cyan-50 px-4 py-3 border-b border-teal-200">
                  <h5 className="font-semibold text-teal-900 flex items-center gap-2">
                    <span className="w-2 h-2 bg-teal-500 rounded-full"></span>
                    {subject} ({exams.length} đề)
                  </h5>
                </div>

                {/* Exam Items */}
                <div className="divide-y divide-gray-100">
                  {exams
                    .sort((a, b) => a.order - b.order)
                    .map((exam, index) => (
                      <div
                        key={exam._id}
                        className="p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          {/* Order Badge */}
                          <div className="w-8 h-8 bg-teal-100 text-teal-700 rounded-lg flex items-center justify-center font-bold text-sm shrink-0">
                            {exam.order}
                          </div>

                          {/* Exam Info */}
                          <div className="flex-1 min-w-0">
                            <h6 className="font-semibold text-gray-900 mb-1 truncate">
                              {exam.title}
                            </h6>
                            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <svg
                                  className="w-3.5 h-3.5"
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
                                {exam.totalQuestions} câu
                              </span>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <svg
                                  className="w-3.5 h-3.5"
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
                                {exam.durationMinutes} phút
                              </span>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <svg
                                  className="w-3.5 h-3.5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                                  />
                                </svg>
                                {exam.totalPoints} điểm
                              </span>
                              <span>•</span>
                              <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full font-medium">
                                Trọng số: {exam.weight}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedExams.length === 0 && (
        <div className="p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-gray-400"
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
          </div>
          <p className="text-gray-900 font-medium mb-1">Chưa có đề thi nào</p>
          <p className="text-sm text-gray-500">
            Vui lòng thêm đề thi cho cuộc thi
          </p>
        </div>
      )}
    </div>
  );
};

export default ContestPreview;
