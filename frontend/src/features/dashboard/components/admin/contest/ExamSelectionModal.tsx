"use client";

import React, { useState, useEffect } from "react";
import { examService } from "@/services/exam/exam.service";

interface Exam {
  _id: string;
  title: string;
  subject: string;
  durationMinutes: number;
  totalQuestions: number;
  totalPoints: number;
  difficulty?: string;
  isPublished: boolean;
}

interface ExamSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  subject: string;
  onSelectExam: (examId: string, examData: Exam) => void;
  selectedExamIds?: string[];
}

const ExamSelectionModal: React.FC<ExamSelectionModalProps> = ({
  isOpen,
  onClose,
  subject,
  onSelectExam,
  selectedExamIds = [],
}) => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && subject) {
      fetchExams();
    }
  }, [isOpen, subject]);

  const fetchExams = async () => {
    setLoading(true);
    try {
      console.log(`🔍 Fetching published exams for subject: "${subject}"`);

      // Fetch published exams filtered by subject from current admin
      const allExams = await examService.getPublishedExams({ subject });

      console.log(`📚 Raw exams response:`, allExams);
      console.log(`📚 Number of exams:`, allExams.length);

      // Filter out exams already selected in the contest
      const filteredExams = allExams.filter(
        (exam: Exam) => !selectedExamIds.includes(exam._id)
      );

      console.log(
        `✅ Fetched ${filteredExams.length} published exams for subject: ${subject} (after filtering selected)`
      );
      setExams(filteredExams);
    } catch (error) {
      console.error("❌ Error fetching exams:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredExams = exams.filter((exam) =>
    exam.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectExam = () => {
    if (selectedExamId) {
      const exam = exams.find((e) => e._id === selectedExamId);
      if (exam) {
        onSelectExam(selectedExamId, exam);
        setSelectedExamId(null);
        setSearchTerm("");
        onClose();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Chọn đề thi</h3>
            <p className="text-sm text-gray-500 mt-1">
              Môn:{" "}
              <span className="font-semibold text-teal-600">{subject}</span>
            </p>
          </div>
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

        {/* Search */}
        <div className="p-6 border-b border-gray-100">
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Tìm kiếm đề thi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Exam List */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600"></div>
            </div>
          ) : filteredExams.length === 0 ? (
            <div className="text-center py-12">
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
              <p className="text-gray-900 font-medium">Không tìm thấy đề thi</p>
              <p className="text-sm text-gray-500 mt-1">
                {searchTerm
                  ? "Thử tìm kiếm với từ khóa khác"
                  : "Chưa có đề thi nào cho môn này"}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredExams.map((exam) => (
                <label
                  key={exam._id}
                  className={`block p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedExamId === exam._id
                      ? "border-teal-500 bg-teal-50"
                      : "border-gray-200 hover:border-teal-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="exam"
                      value={exam._id}
                      checked={selectedExamId === exam._id}
                      onChange={(e) => setSelectedExamId(e.target.value)}
                      className="mt-1 w-4 h-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">
                        {exam.title}
                      </h4>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
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
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          {exam.durationMinutes} phút
                        </span>
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
                          {exam.totalQuestions} câu
                        </span>
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
                              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                            />
                          </svg>
                          {exam.totalPoints} điểm
                        </span>
                      </div>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={handleSelectExam}
            disabled={!selectedExamId}
            className="px-5 py-2.5 rounded-lg bg-teal-600 text-white font-medium hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Thêm đề thi
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExamSelectionModal;
