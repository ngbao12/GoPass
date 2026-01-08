"use client";

import React, { useState, useEffect } from "react";
import {
  questionBankService,
  Question,
  QuestionOption,
} from "@/services/questionbank";

interface QuestionListModalProps {
  isOpen: boolean;
  onClose: () => void;
  subject: string;
  difficulty?: "easy" | "medium" | "hard";
}

const QuestionListModal: React.FC<QuestionListModalProps> = ({
  isOpen,
  onClose,
  subject,
  difficulty,
}) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>(
    difficulty || "all"
  );
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (isOpen) {
      fetchQuestions();
    }
  }, [isOpen, subject, selectedDifficulty, page]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const params: any = {
        subject,
        page,
        limit: 20,
      };

      if (selectedDifficulty !== "all") {
        params.difficulty = selectedDifficulty as any;
      }

      const response = await questionBankService.searchQuestions(params);
      setQuestions(response.questions);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDifficultyChange = (diff: string) => {
    setSelectedDifficulty(diff);
    setPage(1);
  };

  const getDifficultyBadge = (diff: string) => {
    const styles = {
      easy: "bg-green-100 text-green-700",
      medium: "bg-yellow-100 text-yellow-700",
      hard: "bg-red-100 text-red-700",
    };
    const labels = {
      easy: "Dễ",
      medium: "Trung bình",
      hard: "Khó",
    };
    return (
      <span
        className={`px-2 py-1 rounded text-xs font-medium ${
          styles[diff as keyof typeof styles]
        }`}
      >
        {labels[diff as keyof typeof labels]}
      </span>
    );
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      multiple_choice: "Trắc nghiệm",
      essay: "Tự luận",
      short_answer: "Trả lời ngắn",
      true_false: "Đúng/Sai",
    };
    return labels[type] || type;
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Môn: {subject}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {questions.length} câu hỏi
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
            >
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Difficulty Filter */}
          <div className="px-6 py-3 bg-gray-50 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Độ khó:</span>
              <div className="flex gap-2">
                {["all", "easy", "medium", "hard"].map((diff) => (
                  <button
                    key={diff}
                    onClick={() => handleDifficultyChange(diff)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      selectedDifficulty === diff
                        ? "bg-teal-600 text-white"
                        : "bg-white text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {diff === "all"
                      ? "Tất cả"
                      : diff === "easy"
                      ? "Dễ"
                      : diff === "medium"
                      ? "Trung bình"
                      : "Khó"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Question List */}
          <div
            className="p-6 overflow-y-auto"
            style={{ maxHeight: "calc(90vh - 250px)" }}
          >
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin"></div>
              </div>
            ) : questions.length > 0 ? (
              <div className="space-y-3">
                {questions.map((question, index) => (
                  <div
                    key={question._id}
                    className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-semibold text-gray-700">
                            Câu {(page - 1) * 20 + index + 1}
                          </span>
                          {getDifficultyBadge(question.difficulty)}
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                            {getTypeLabel(question.type)}
                          </span>
                          <span className="text-sm text-gray-500">
                            {question.points} điểm
                          </span>
                        </div>
                        <div
                          className="text-sm text-gray-700 mb-2"
                          dangerouslySetInnerHTML={{ __html: question.content }}
                        />
                        {question.options && question.options.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {question.options.map((opt) => (
                              <div
                                key={opt.id}
                                className={`text-sm px-3 py-1 rounded ${
                                  opt.isCorrect
                                    ? "bg-green-50 text-green-700 font-medium"
                                    : "text-gray-600"
                                }`}
                              >
                                {opt.id}. {opt.content}
                                {opt.isCorrect && (
                                  <span className="ml-2 text-green-600">✓</span>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                        {question.tags && question.tags.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {question.tags.map((tag, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 bg-gray-200 text-gray-600 rounded text-xs"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">Không có câu hỏi nào</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Trước
              </button>
              <span className="text-sm text-gray-600">
                Trang {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sau
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default QuestionListModal;
