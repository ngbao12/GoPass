"use client";

import React, { useState } from "react";
import { Subject } from "@/features/dashboard/types/contest";
import ExamSelectionModal from "./ExamSelectionModal";

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

interface SubjectSelectorProps {
  selectedSubjects: string[];
  onSubjectsChange: (subjects: string[]) => void;
  selectedExams: SelectedExam[];
  onExamsChange: (exams: SelectedExam[]) => void;
}

const SubjectSelector: React.FC<SubjectSelectorProps> = ({
  selectedSubjects,
  onSubjectsChange,
  selectedExams,
  onExamsChange,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState("");

  const allSubjects: Subject[] = [
    { id: "Toán", name: "Toán", isSelected: selectedSubjects.includes("Toán") },
    {
      id: "Ngữ Văn",
      name: "Ngữ Văn",
      isSelected: selectedSubjects.includes("Ngữ Văn"),
    },
    {
      id: "Tiếng Anh",
      name: "Tiếng Anh",
      isSelected: selectedSubjects.includes("Tiếng Anh"),
    },
    {
      id: "Vật Lý",
      name: "Vật Lý",
      isSelected: selectedSubjects.includes("Vật Lý"),
    },
    {
      id: "Hóa Học",
      name: "Hóa Học",
      isSelected: selectedSubjects.includes("Hóa Học"),
    },
    {
      id: "Sinh Học",
      name: "Sinh Học",
      isSelected: selectedSubjects.includes("Sinh Học"),
    },
    {
      id: "Lịch Sử",
      name: "Lịch Sử",
      isSelected: selectedSubjects.includes("Lịch Sử"),
    },
    {
      id: "Địa Lý",
      name: "Địa Lý",
      isSelected: selectedSubjects.includes("Địa Lý"),
    },
  ];

  const handleAddExam = (subjectId: string) => {
    setSelectedSubject(subjectId);
    setModalOpen(true);
  };

  const handleSelectExam = (examId: string, examData: any) => {
    // Add exam with order and default weight
    const newExam: SelectedExam = {
      _id: examId,
      title: examData.title,
      subject: examData.subject,
      durationMinutes: examData.durationMinutes,
      totalQuestions: examData.totalQuestions,
      totalPoints: examData.totalPoints,
      order: selectedExams.length + 1,
      weight: 1, // Default weight
    };

    onExamsChange([...selectedExams, newExam]);

    // Add subject to selected subjects if not already added
    if (!selectedSubjects.includes(examData.subject)) {
      onSubjectsChange([...selectedSubjects, examData.subject]);
    }
  };

  const handleRemoveExam = (examId: string) => {
    const updatedExams = selectedExams.filter((e) => e._id !== examId);

    // Reorder exams
    const reorderedExams = updatedExams.map((exam, index) => ({
      ...exam,
      order: index + 1,
    }));

    onExamsChange(reorderedExams);

    // Remove subject if no exams left for that subject
    const removedExam = selectedExams.find((e) => e._id === examId);
    if (removedExam) {
      const hasOtherExams = updatedExams.some(
        (e) => e.subject === removedExam.subject
      );
      if (!hasOtherExams) {
        onSubjectsChange(
          selectedSubjects.filter((s) => s !== removedExam.subject)
        );
      }
    }
  };

  const handleUpdateWeight = (examId: string, weight: number) => {
    const updatedExams = selectedExams.map((exam) =>
      exam._id === examId ? { ...exam, weight: Math.max(0.1, weight) } : exam
    );
    onExamsChange(updatedExams);
  };

  const getSubjectExams = (subjectId: string) => {
    return selectedExams.filter((exam) => exam.subject === subjectId);
  };

  return (
    <>
      <div className="space-y-6">
        {/* Subject Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allSubjects.map((subject) => {
            const subjectExams = getSubjectExams(subject.id);
            const hasExams = subjectExams.length > 0;

            return (
              <div
                key={subject.id}
                className={`border-2 rounded-lg p-4 transition-all ${
                  hasExams
                    ? "border-teal-300 bg-teal-50"
                    : "border-gray-200 bg-white hover:border-teal-200"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-gray-900">
                    {subject.name}
                  </h4>
                  <button
                    onClick={() => handleAddExam(subject.id)}
                    className="text-teal-600 hover:text-teal-700 text-sm font-medium flex items-center gap-1 transition-colors"
                    title="Thêm đề thi"
                  >
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
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Thêm
                  </button>
                </div>

                {/* Show selected exams for this subject */}
                {hasExams && (
                  <div className="space-y-2">
                    {subjectExams.map((exam) => (
                      <div
                        key={exam._id}
                        className="bg-white border border-teal-200 rounded-lg p-3"
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <p className="text-xs font-medium text-gray-900 line-clamp-2">
                            {exam.title}
                          </p>
                          <button
                            onClick={() => handleRemoveExam(exam._id)}
                            className="text-red-500 hover:text-red-700 transition-colors shrink-0"
                            title="Xóa đề thi"
                          >
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
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span>{exam.totalQuestions} câu</span>
                          <span>•</span>
                          <span>{exam.durationMinutes}p</span>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <span>Trọng số:</span>
                            <input
                              type="number"
                              min="0.1"
                              step="0.1"
                              value={exam.weight}
                              onChange={(e) =>
                                handleUpdateWeight(
                                  exam._id,
                                  parseFloat(e.target.value)
                                )
                              }
                              className="w-12 px-1 py-0.5 border border-gray-300 rounded text-center focus:outline-none focus:ring-1 focus:ring-teal-500"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Summary */}
        {selectedExams.length > 0 && (
          <div className="bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
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
                <span className="text-sm font-semibold text-teal-900">
                  Tổng số đề thi đã chọn: {selectedExams.length}
                </span>
              </div>
              <span className="text-xs text-teal-700">
                {selectedSubjects.length} môn học
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Exam Selection Modal */}
      <ExamSelectionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        subject={selectedSubject}
        onSelectExam={handleSelectExam}
        selectedExamIds={selectedExams.map((e) => e._id)}
      />
    </>
  );
};

export default SubjectSelector;
