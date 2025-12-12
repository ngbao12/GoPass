"use client";

import React from "react";
import { Button } from "@/components/ui";

interface DeleteExamModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    examTitle: string;
}

const DeleteExamModal: React.FC<DeleteExamModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    examTitle,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                <div className="flex items-center gap-4 mb-6">
                    <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Xác nhận xóa đề thi
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                            Bạn có chắc chắn muốn xóa đề thi <strong>{examTitle}</strong>? Hành động này không thể hoàn tác.
                        </p>
                    </div>
                </div>

                <div className="flex gap-3">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={onClose}
                        className="flex-1"
                    >
                        Hủy
                    </Button>
                    <Button
                        type="button"
                        onClick={onConfirm}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                    >
                        Xóa đề thi
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default DeleteExamModal;