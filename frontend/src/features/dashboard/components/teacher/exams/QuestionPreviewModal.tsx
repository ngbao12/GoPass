"use client";

import React from "react";
import { Button } from "@/components/ui";
import { TeacherExam } from "@/features/dashboard/types/teacher";

interface QuestionPreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    exam: TeacherExam;
}

const QuestionPreviewModal: React.FC<QuestionPreviewModalProps> = ({
    isOpen,
    onClose,
    exam,
}) => {
    if (!isOpen) return null;

    // Mock questions data
    const mockQuestions = [
        {
            id: 1,
            content: "Nội dung câu hỏi số 1 trong đề thi",
            points: "0,2 điểm",
            type: "Trắc nghiệm"
        },
        {
            id: 2,
            content: "Nội dung câu hỏi số 2 trong đề thi",
            points: "0,2 điểm",
            type: "Trắc nghiệm"
        },
        {
            id: 3,
            content: "Nội dung câu hỏi số 3 trong đề thi",
            points: "0,2 điểm",
            type: "Tự luận"
        },
        {
            id: 4,
            content: "Nội dung câu hỏi số 4 trong đề thi",
            points: "0,2 điểm",
            type: "Trắc nghiệm"
        },
        {
            id: 5,
            content: "Nội dung câu hỏi số 5 trong đề thi",
            points: "0,2 điểm",
            type: "Trắc nghiệm"
        },
    ];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] mx-4 flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">
                            Danh sách câu hỏi
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">
                            {exam.title} - {exam.totalQuestions} câu hỏi
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        ✕
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="space-y-4">
                        {mockQuestions.map((question) => (
                            <div
                                key={question.id}
                                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-gray-900">
                                            Câu {question.id}:
                                        </span>
                                        <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                                            {question.type}
                                        </span>
                                    </div>
                                    <span className="text-sm text-teal-600 font-medium">
                                        {question.points}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-700">
                                    {question.content}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-200">
                    <Button
                        onClick={onClose}
                        variant="secondary"
                        className="w-full"
                    >
                        Đóng
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default QuestionPreviewModal;