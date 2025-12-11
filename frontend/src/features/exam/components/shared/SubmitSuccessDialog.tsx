// src/features/exam/components/shared/SubmitSuccessDialog.tsx
"use client";

import React from "react";
import Button from "@/components/ui/Button";

interface SubmitSuccessDialogProps {
  isOpen: boolean;
  examTitle: string;
  examSubject: string;
  submittedAt: string; // ISO string or formatted time
  completionStatus: {
    answered: number;
    total: number;
  };
  onGoToDashboard: () => void;
}

/**
 * Success dialog shown after exam submission
 * Displays confirmation and exam summary
 */
const SubmitSuccessDialog: React.FC<SubmitSuccessDialogProps> = ({
  isOpen,
  examTitle,
  examSubject,
  submittedAt,
  completionStatus,
  onGoToDashboard,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-teal-500/20 to-blue-500/20 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl m-4 overflow-hidden">
        {/* Success Header */}
        <div className="bg-gradient-to-r from-teal-500 to-teal-600 p-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-lg rounded-full mb-4">
            <svg
              className="w-12 h-12 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">
            Nộp bài thành công!
          </h2>
          <p className="text-teal-100 text-base">
            Bài thi của bạn đã được ghi nhận
          </p>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          {/* Exam Info Card */}
          <div className="bg-teal-50 border-2 border-teal-200 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-teal-600 rounded-lg flex items-center justify-center">
                <svg
                  className="w-7 h-7 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-teal-700 mb-1">
                  Môn thi
                </p>
                <p className="text-lg font-bold text-teal-900">{examSubject}</p>
              </div>
            </div>
          </div>

          {/* Submission Time */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg
                  className="w-7 h-7 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-700 mb-1">
                  Thời gian nộp
                </p>
                <p className="text-lg font-bold text-blue-900">{submittedAt}</p>
              </div>
            </div>
          </div>

          {/* Completion Status */}
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                <svg
                  className="w-7 h-7 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-green-700 mb-1">
                  Trạng thái
                </p>
                <p className="text-lg font-bold text-green-900">
                  Hoàn thành ({completionStatus.answered}/
                  {completionStatus.total} câu)
                </p>
              </div>
            </div>
          </div>

          {/* Important Info */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <p className="text-sm font-semibold text-blue-900 mb-2">
              Thông tin quan trọng:
            </p>
            <ul className="space-y-1.5 text-sm text-blue-800">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>Bài thi đang được hệ thống lưu trữ và chấm điểm</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>Kết quả sẽ được công bố sau 14 ngày làm việc</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>Kiểm tra kết quả tại mục "Kết quả thi"</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <Button
            variant="primary"
            onClick={onGoToDashboard}
            className="w-full py-3 text-base font-semibold"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Quay về Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SubmitSuccessDialog;
