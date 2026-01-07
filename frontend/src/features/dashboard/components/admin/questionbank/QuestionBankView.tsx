"use client";

import React, { useState, useEffect } from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import Button from "@/components/ui/Button";
import QuestionTopicList from "./QuestionTopicList";
import SubjectTabs from "./SubjectTabs";
import CreateQuestionModal from "./CreateQuestionModal";
import { questionBankService, SubjectStats } from "@/services/questionbank";

const QuestionBankView: React.FC = () => {
  const [activeSubject, setActiveSubject] = useState("Toán");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stats, setStats] = useState<SubjectStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch question stats
  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await questionBankService.getStats();
      setStats(response.bySubject);
    } catch (err: any) {
      console.error("Error fetching question stats:", err);
      setError(err.message || "Không thể tải thống kê câu hỏi");
    } finally {
      setLoading(false);
    }
  };

  // Convert stats to topics format
  const topics = stats.map((stat) => ({
    id: stat.subject,
    name: stat.subject,
    questionCount: stat.total,
    difficulty: {
      easy: stat.easy,
      medium: stat.medium,
      hard: stat.hard,
    },
  }));

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
        activeSubject={activeSubject}
        onSubjectChange={setActiveSubject}
      />

      {/* Instructions */}
      <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-teal-800 mb-1">
              Môn học và câu hỏi
            </h3>
            <p className="text-sm text-teal-700">
              Click vào môn học để xem chi tiết phân bố độ khó • Tổng số: {stats.reduce((sum, s) => sum + s.total, 0)} câu
            </p>
          </div>
        </div>
      </div>

      {/* Topic List */}
      {topics.length > 0 ? (
        <QuestionTopicList topics={topics} />
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            Chưa có câu hỏi nào
          </h3>
          <p className="text-gray-500 mb-4">
            Bắt đầu bằng cách thêm câu hỏi đầu tiên của bạn
          </p>
          <Button variant="primary" onClick={handleAddQuestion}>
            Thêm câu hỏi
          </Button>
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
