// src/features/exam/components/shared/ExitExamDialog.tsx
"use client";

import React from "react";
import Button from "@/components/ui/Button";

interface ExitExamDialogProps {
  isOpen: boolean;
  onClose?: () => void; // Optional alias for onStay
  onStay?: () => void;
  onConfirm?: () => void; // Optional alias for onExit
  onExit?: () => void;
}

/**
 * Dialog shown when user tries to exit exam
 * Warns about timer continuing
 */
const ExitExamDialog: React.FC<ExitExamDialogProps> = ({
  isOpen,
  onClose,
  onStay,
  onConfirm,
  onExit,
}) => {
  // Support multiple prop names for flexibility
  const handleStay = onClose || onStay || (() => {});
  const handleExit = onConfirm || onExit || (() => {});

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
        {/* Warning Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-yellow-100 flex items-center justify-center">
            <svg
              className="w-12 h-12 text-orange-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 text-center mb-4">
          Xác nhận thoát
        </h3>

        {/* Message */}
        <p className="text-center text-gray-700 mb-6">
          Bạn có chắc chắn muốn rời khỏi bài thi?
        </p>

        {/* Warning Box */}
        <div className="bg-yellow-50 border-l-4 border-orange-500 p-4 mb-6 rounded">
          <div className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                clipRule="evenodd"
              />
            </svg>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900 mb-1">
                Lưu ý quan trọng:
              </p>
              <p className="text-sm text-gray-700">
                Thời gian làm bài{" "}
                <span className="font-semibold">vẫn tiếp tục đếm ngược</span>{" "}
                ngay cả khi bạn rời khỏi trang. Hãy quay lại làm bài sớm để
                tránh hết giờ!
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="secondary"
            onClick={handleStay}
            className="flex-1 py-3 text-base font-medium"
          >
            Ở lại làm bài
          </Button>
          <Button
            onClick={handleExit}
            className="flex-1 py-3 text-base font-medium bg-orange-500 hover:bg-orange-600 text-white"
          >
            ← Thoát tạm thời
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExitExamDialog;
