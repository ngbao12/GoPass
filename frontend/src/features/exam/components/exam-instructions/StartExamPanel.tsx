// src/features/exam/components/exam-instructions/StartExamPanel.tsx
"use client";

import React from "react";
import Button from "@/components/ui/Button";
import {
  ExamConfigService,
  type ExamConfig,
  type ExamSection,
} from "../../services/examConfig.service";

interface StartExamPanelProps {
  examTitle: string;
  examSubject: string;
  durationMinutes: number;
  totalQuestions: number;
  totalPoints: number;
  onStartExam: () => void;
  onCancel: () => void;
}

/**
 * Component hiển thị panel hướng dẫn trước khi bắt đầu làm bài
 * Pure UI component - không chứa business logic
 */
const StartExamPanel: React.FC<StartExamPanelProps> = ({
  examTitle,
  examSubject,
  durationMinutes,
  totalQuestions,
  totalPoints,
  onStartExam,
  onCancel,
}) => {
  // Lấy config từ service (business logic)
  const config: ExamConfig =
    ExamConfigService.getConfigBySubject(examSubject) ||
    ExamConfigService.getDefaultConfig(examSubject);

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header - Teal Gradient */}
          <div
            className={`${config.headerGradient} text-white py-8 px-5 text-center`}
          >
            <div className="flex justify-center mb-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            <h1 className="text-xl font-bold mb-2">{examTitle}</h1>
            <p className="text-teal-100 text-xs">{config.examType}</p>
          </div>

          <div className="p-5 space-y-4">
            {/* Cấu trúc đề thi */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <svg
                  className="w-4 h-4 text-teal-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path
                    fillRule="evenodd"
                    d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                    clipRule="evenodd"
                  />
                </svg>
                <h2 className="text-base font-semibold text-gray-900">
                  Cấu trúc đề thi
                </h2>
              </div>

              <div className="space-y-2">
                {config.sections.length > 0 ? (
                  config.sections.map((section: ExamSection) => (
                    <div
                      key={section.id}
                      className={`flex items-start gap-3 p-3 rounded-lg border ${ExamConfigService.getSectionBorderColor(
                        section.color
                      )}`}
                    >
                      <div
                        className={`w-8 h-8 rounded-lg ${ExamConfigService.getSectionBadgeColor(
                          section.color
                        )} flex items-center justify-center font-bold text-base flex-shrink-0`}
                      >
                        {section.id}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-gray-900 mb-0.5">
                          {section.title}
                        </h3>
                        <p className="text-xs text-gray-600">
                          {section.description}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  // Fallback nếu không có sections config
                  <div className="p-3 rounded-lg border border-gray-200 bg-gray-50">
                    <p className="text-xs text-gray-600">
                      {totalQuestions} câu hỏi - {totalPoints} điểm
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Thời gian làm bài */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg
                    className="w-3.5 h-3.5 text-yellow-600"
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
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900 mb-0.5">
                    Thời gian làm bài:{" "}
                    <span className="text-yellow-700">
                      {ExamConfigService.formatDuration(durationMinutes)}
                    </span>
                  </p>
                  <p className="text-xs text-gray-600">{config.timeWarning}</p>
                </div>
              </div>
            </div>

            {/* Lưu ý quan trọng */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <svg
                  className="w-4 h-4 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                <h2 className="text-base font-semibold text-gray-900">
                  Lưu ý quan trọng
                </h2>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <ul className="space-y-1.5">
                  {config.instructions.map((instruction, index) => (
                    <li key={index} className="flex items-start gap-1.5">
                      <svg
                        className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                          instruction.highlight
                            ? "text-red-500"
                            : "text-blue-600"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span
                        className={`text-xs ${
                          instruction.highlight
                            ? "text-red-700 font-semibold"
                            : "text-blue-800"
                        }`}
                      >
                        {instruction.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <Button
                variant="secondary"
                onClick={onCancel}
                className="flex-1 py-2.5 text-sm"
              >
                Hủy
              </Button>
              <Button
                variant="primary"
                onClick={onStartExam}
                className="flex-1 py-2.5 text-sm bg-teal-600 hover:bg-teal-700"
              >
                Bắt đầu làm bài →
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartExamPanel;
