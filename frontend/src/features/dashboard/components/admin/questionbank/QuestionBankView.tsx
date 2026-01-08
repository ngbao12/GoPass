"use client";

import React, { useState, useEffect } from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import Button from "@/components/ui/Button";
import SubjectTabs from "./SubjectTabs";
import CreateQuestionModal from "./CreateQuestionModal";
import {
  questionBankService,
  SubjectStats,
  Question,
} from "@/services/questionbank";

const QuestionBankView: React.FC = () => {
  const [activeSubject, setActiveSubject] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stats, setStats] = useState<SubjectStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch question stats
  useEffect(() => {
    fetchStats();
  }, []);

  // Fetch questions when subject or difficulty changes
  useEffect(() => {
    if (activeSubject) {
      fetchQuestions();
    }
  }, [activeSubject, selectedDifficulty, page]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await questionBankService.getStats();
      setStats(response.bySubject);
      // Set first subject as active by default
      if (response.bySubject.length > 0 && !activeSubject) {
        setActiveSubject(response.bySubject[0].subject);
      }
    } catch (err: any) {
      console.error("Error fetching question stats:", err);
      setError(err.message || "Không thể tải thống kê câu hỏi");
    } finally {
      setLoading(false);
    }
  };

  const fetchQuestions = async () => {
    if (!activeSubject) return;

    try {
      setLoadingQuestions(true);
      const params: any = {
        subject: activeSubject,
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
      setLoadingQuestions(false);
    }
  };

  // Keyboard shortcut: Ctrl+N to open modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "n") {
        e.preventDefault();
        setIsModalOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleImportFile = () => {
    console.log("Import file");
    // TODO: Implement file import
  };

  const handleAddQuestion = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleSubjectChange = (subject: string) => {
    setActiveSubject(subject);
    setPage(1);
    setSelectedDifficulty("all");
  };

  const handleDifficultyChange = (difficulty: string) => {
    setSelectedDifficulty(difficulty);
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

  const handleQuestionSave = async (question: any) => {
    console.log("Saved question:", question);
    try {
      await questionBankService.createQuestion(question);
      setIsModalOpen(false);
      // Refresh stats after creating question
      fetchStats();
    } catch (error) {
      console.error("Error saving question:", error);
      alert("Không thể lưu câu hỏi. Vui lòng thử lại.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-500">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-3">
          <div className="text-red-500 text-5xl">⚠️</div>
          <p className="text-red-600 font-medium">{error}</p>
          <button
            onClick={fetchStats}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <SectionHeader
        title="Ngân hàng câu hỏi"
        subtitle="Quản lý câu hỏi theo môn học và độ khó"
        action={
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={handleImportFile}
              icon={
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
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              }
            >
              Nhập từ file
            </Button>
            <Button
              variant="primary"
              onClick={handleAddQuestion}
              icon={
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
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              }
            >
              Thêm câu hỏi
            </Button>
          </div>
        }
      />

      {/* Subject Tabs */}
      <SubjectTabs
        subjects={stats.map((s) => s.subject)}
        activeSubject={activeSubject || ""}
        onSubjectChange={handleSubjectChange}
        stats={stats}
      />

      {/* Stats Summary */}
      {activeSubject && stats.length > 0 && (
        <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-teal-800 mb-1">
                Môn học và câu hỏi
              </h3>
              <p className="text-sm text-teal-700">
                Click vào môn học để xem chi tiết phân bố độ khó • Tổng số:{" "}
                {stats.reduce((sum, s) => sum + s.total, 0)} câu
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Difficulty Filter */}
      {activeSubject && (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
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
                      : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
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
      )}

      {/* Question List */}
      {activeSubject && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          {loadingQuestions ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin"></div>
            </div>
          ) : questions.length > 0 ? (
            <div>
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-900">
                  Môn: {activeSubject}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {questions.length} câu hỏi
                </p>
              </div>
              <div className="p-6 space-y-3">
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
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">Không có câu hỏi nào</p>
            </div>
          )}
        </div>
      )}

      {/* Create Question Modal */}
      {isModalOpen && (
        <CreateQuestionModal
          onClose={handleModalClose}
          onSave={handleQuestionSave}
        />
      )}
    </div>
  );
};

export default QuestionBankView;
