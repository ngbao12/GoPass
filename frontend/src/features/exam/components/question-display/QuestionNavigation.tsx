// src/features/exam/components/question-display/QuestionNavigation.tsx
"use client";

import React from "react";
import { QuestionNavigationItem } from "../../types/answer";

interface QuestionNavigationProps {
  questions: QuestionNavigationItem[];
  onQuestionSelect: (questionId: string) => void;
}

const QuestionNavigation: React.FC<QuestionNavigationProps> = ({
  questions,
  onQuestionSelect,
}) => {
  const getQuestionStyle = (item: QuestionNavigationItem) => {
    if (item.isCurrentQuestion) {
      return "bg-blue-500 text-white border-blue-600";
    }
    if (item.isFlagged) {
      return "bg-yellow-400 text-gray-900 border-yellow-500";
    }
    if (item.isAnswered) {
      return "bg-teal-500 text-white border-teal-600";
    }
    return "bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300";
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-28">
      <h3 className="text-lg font-semibold mb-4">Question Navigator</h3>

      <div className="grid grid-cols-5 gap-2 mb-6">
        {questions.map((item) => (
          <button
            key={item.questionId}
            onClick={() => onQuestionSelect(item.questionId)}
            className={`
              w-12 h-12 rounded-lg border-2 font-semibold
              transition-all duration-200
              ${getQuestionStyle(item)}
            `}
          >
            {item.order}
          </button>
        ))}
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-teal-500 rounded border-2 border-teal-600" />
          <span>Answered</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gray-200 rounded border-2 border-gray-300" />
          <span>Not Answered</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-500 rounded border-2 border-blue-600" />
          <span>Current</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-yellow-400 rounded border-2 border-yellow-500" />
          <span>Flagged</span>
        </div>
      </div>
    </div>
  );
};

export default QuestionNavigation;
