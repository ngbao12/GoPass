// src/features/exam/components/shared/SubmitConfirmationDialog.tsx
"use client";

import React from "react";
import Button from "@/components/ui/Button";

interface SubmitConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  timeRemaining: string;
  answeredCount: number;
  totalQuestions: number;
  unansweredQuestions: Array<{
    number: number;
    section: string;
  }>;
  flaggedQuestions: Array<{
    number: number;
    section: string;
  }>;
}

/**
 * Submit confirmation dialog with detailed summary
 * Shows time remaining, answered/unanswered questions, and flagged questions
 */
const SubmitConfirmationDialog: React.FC<SubmitConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  timeRemaining,
  answeredCount,
  totalQuestions,
  unansweredQuestions,
  flaggedQuestions,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Xác nhận nộp bài
              </h2>
              <p className="text-sm text-gray-600">
                Kiểm tra lại trước khi nộp
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
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
        <div className="p-6 space-y-4">
          {/* Time Remaining */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                Thời gian còn lại:
              </span>
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-lg font-bold text-gray-900">
                  {timeRemaining}
                </span>
              </div>
            </div>
          </div>

          {/* Answered Summary */}
          <div className="bg-green-50 rounded-lg p-4 border-2 border-green-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-6 h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-green-900 mb-1">
                  Đã trả lời
                </p>
                <p className="text-2xl font-bold text-green-700">
                  {answeredCount} / {totalQuestions} câu
                </p>
              </div>
            </div>
          </div>

          {/* Unanswered Questions */}
          {unansweredQuestions.length > 0 && (
            <div className="bg-orange-50 rounded-lg p-4 border-2 border-orange-200">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-orange-900 mb-2">
                    Chưa trả lời
                  </p>
                  <p className="text-lg font-bold text-orange-700 mb-2">
                    {unansweredQuestions.length} câu
                  </p>
                  <button className="text-sm text-orange-700 font-medium hover:text-orange-900 flex items-center gap-1">
                    <span>▼ Xem danh sách câu chưa làm</span>
                  </button>
                  {/* Question List - Collapsible */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {unansweredQuestions.map((q) => (
                      <span
                        key={q.number}
                        className="px-3 py-1 bg-white border border-orange-300 rounded text-sm text-orange-800"
                      >
                        Câu {q.number}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Flagged Questions */}
          {flaggedQuestions.length > 0 && (
            <div className="bg-yellow-50 rounded-lg p-4 border-2 border-yellow-200">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-yellow-900 mb-2">
                    Đánh dấu xem lại
                  </p>
                  <p className="text-lg font-bold text-yellow-700 mb-2">
                    {flaggedQuestions.length} câu
                  </p>
                  <button className="text-sm text-yellow-700 font-medium hover:text-yellow-900 flex items-center gap-1">
                    <span>▼ Xem danh sách câu đánh dấu</span>
                  </button>
                  {/* Question List */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {flaggedQuestions.map((q) => (
                      <span
                        key={q.number}
                        className="px-3 py-1 bg-white border border-yellow-300 rounded text-sm text-yellow-800"
                      >
                        Câu {q.number}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Warning */}
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <div className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="flex-1">
                <p className="text-sm font-semibold text-red-900 mb-1">
                  Cảnh báo:
                </p>
                <p className="text-sm text-red-700">
                  Bạn còn{" "}
                  <strong>
                    {unansweredQuestions.length} câu chưa hoàn thành
                  </strong>
                  . Bạn có chắc chắn muốn nộp bài không?
                </p>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <div className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-sm text-blue-700">
                <strong>Lưu ý:</strong> Sau khi nộp bài, bạn không thể chỉnh sửa
                câu trả lời. Hãy kiểm tra kỹ trước khi xác nhận.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex gap-3">
          <Button variant="secondary" onClick={onClose} className="flex-1 py-3">
            Quay lại làm bài
          </Button>
          <Button
            variant="primary"
            onClick={onConfirm}
            className="flex-1 py-3 bg-blue-600 hover:bg-blue-700"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
            Chắc chắn nộp bài
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SubmitConfirmationDialog;
