"use client";

import React from "react";
import { getSectionBadgeStyle } from "../../config/question-sections.config";

export interface QuestionStatus {
  questionId: string;
  order: number;
  isAnswered: boolean;
  isFlagged: boolean;
  isActive: boolean;
}

interface QuestionSidebarProps {
  sections: Record<string, QuestionStatus[]>;
  onQuestionClick: (questionId: string) => void;
}

const QuestionSidebar: React.FC<QuestionSidebarProps> = ({
  sections,
  onQuestionClick,
}) => {
  const getQuestionButtonClass = (q: QuestionStatus): string => {
    // Active: Teal đậm, chữ trắng
    if (q.isActive)
      return "bg-[#00747F] text-white border-[#00747F] font-bold shadow-md ring-2 ring-[#00747F]/20 z-10";
    // Flagged: Vàng nhạt
    if (q.isFlagged)
      return "bg-amber-50 text-amber-700 border-amber-300 hover:bg-amber-100";
    // Answered: Xanh ngọc nhạt
    if (q.isAnswered)
      return "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100";
    // Default: Trắng
    return "bg-white text-gray-600 border-gray-200 hover:border-[#00747F] hover:text-[#00747F]";
  };

  return (
    <aside className="w-[280px] bg-white border-r border-gray-200 flex-shrink-0 flex flex-col h-full shadow-[2px_0_10px_rgba(0,0,0,0.03)] z-20">
      {/* Header Sidebar */}
      <div className="p-5 border-b border-gray-100 bg-gray-50/80 backdrop-blur-sm">
        <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2 uppercase tracking-wide">
          <svg
            className="w-4 h-4 text-[#00747F]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h7"
            />
          </svg>
          Danh sách câu hỏi
        </h2>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-5 scroll-smooth custom-scrollbar">
        {/* Status Legend - Chữ to hơn (text-xs) dễ đọc */}
        <div className="mb-6 grid grid-cols-2 gap-y-3 gap-x-2">
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 bg-white border border-gray-300 rounded-full"></div>
            <span className="text-xs text-gray-600 font-medium">Chưa làm</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 bg-[#00747F] rounded-full shadow-sm"></div>
            <span className="text-xs text-gray-600 font-medium">Đang chọn</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 bg-emerald-100 border border-emerald-300 rounded-full"></div>
            <span className="text-xs text-gray-600 font-medium">Đã làm</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 bg-amber-100 border border-amber-300 rounded-full"></div>
            <span className="text-xs text-gray-600 font-medium">Đánh dấu</span>
          </div>
        </div>

        <div className="space-y-6">
          {Object.entries(sections).map(([sectionName, sectionQuestions]) => {
            const badgeStyle = getSectionBadgeStyle(sectionName);

            return (
              <div key={sectionName} className="space-y-3">
                {/* Section Header */}
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border border-opacity-20 bg-opacity-10 ${badgeStyle.bg.replace(
                      "bg-",
                      "text-"
                    )} border-current`}
                  >
                    {sectionName}
                  </span>
                  <div className="h-px bg-gray-100 flex-1"></div>
                </div>

                {/* Question Grid */}
                <div className="grid grid-cols-5 gap-2">
                  {sectionQuestions.map((q) => (
                    <button
                      key={q.questionId}
                      onClick={() => onQuestionClick(q.questionId)}
                      className={`
                        h-9 w-9 rounded-lg border text-sm font-medium 
                        transition-all duration-200 flex items-center justify-center
                        ${getQuestionButtonClass(q)}
                      `}
                    >
                      {q.order}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Tổng số */}
      <div className="p-3 border-t border-gray-100 bg-gray-50 text-center text-xs text-gray-500 font-medium">
        Tổng số: {Object.values(sections).flat().length} câu hỏi
      </div>
    </aside>
  );
};

export default QuestionSidebar;
