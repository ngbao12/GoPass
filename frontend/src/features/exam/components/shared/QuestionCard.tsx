// src/features/exam/components/shared/QuestionCard.tsx
"use client";

import React from "react";
import { Question } from "../../types";
import {
  MultipleChoiceInput,
  TrueFalseInput,
  ShortAnswerInput,
  EssayInput,
} from "../question-types";

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  sectionName: string;
  sectionBadgeColor: string;
  points: number;
  selectedAnswer?: string[] | string;
  onAnswerChange: (answer: string[] | string) => void;
  isFlagged: boolean;
  onToggleFlag: () => void;
  hint?: string;
  passage?: string; // For reading comprehension
}

/**
 * Main question display card
 * Renders different input types based on question type
 */
const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  questionNumber,
  sectionName,
  sectionBadgeColor,
  points,
  selectedAnswer,
  onAnswerChange,
  isFlagged,
  onToggleFlag,
  hint,
  passage,
}) => {
  const renderQuestionInput = () => {
    switch (question.type) {
      case "multiple_choice":
        return (
          <MultipleChoiceInput
            options={question.options || []}
            selectedOptions={
              Array.isArray(selectedAnswer) ? selectedAnswer : []
            }
            onChange={onAnswerChange}
          />
        );

      case "true_false":
        return (
          <TrueFalseInput
            options={question.options || []}
            selectedOption={
              Array.isArray(selectedAnswer) ? selectedAnswer[0] : selectedAnswer
            }
            onChange={(value: string) => onAnswerChange([value])}
          />
        );

      case "short_answer":
        return (
          <ShortAnswerInput
            value={typeof selectedAnswer === "string" ? selectedAnswer : ""}
            onChange={onAnswerChange}
            hint={hint}
          />
        );

      case "essay":
        return (
          <EssayInput
            value={typeof selectedAnswer === "string" ? selectedAnswer : ""}
            onChange={onAnswerChange}
          />
        );

      default:
        return <div>Unsupported question type</div>;
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* Question Header */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {/* Section Badge */}
              <span
                className={`px-2 py-0.5 rounded text-xs font-medium ${sectionBadgeColor}`}
              >
                {sectionName}
              </span>

              {/* Points */}
              <span className="text-xs text-gray-600">{points} điểm</span>
            </div>

            {/* Question Title */}
            <h3 className="text-sm font-semibold text-gray-900 mb-1.5">
              Câu {questionNumber}
            </h3>

            {/* Question Content - with scrollbar if needed */}
            <div className="text-sm text-gray-800 leading-relaxed max-h-[300px] overflow-y-auto pr-2">
              {question.content}
            </div>
          </div>

          {/* Flag Button */}
          <button
            onClick={onToggleFlag}
            className={`ml-3 p-1.5 rounded transition-all flex-shrink-0 ${
              isFlagged
                ? "bg-yellow-100 text-yellow-600 hover:bg-yellow-200"
                : "bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600"
            }`}
            title={isFlagged ? "Bỏ đánh dấu" : "Đánh dấu câu hỏi"}
          >
            <svg
              className="w-4 h-4"
              fill={isFlagged ? "currentColor" : "none"}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Question Input Area */}
      <div className="p-4">{renderQuestionInput()}</div>

      {/* Hint Section (if provided) */}
      {hint && (
        <div className="border-t border-gray-200 bg-blue-50 p-4">
          <div className="flex items-start gap-2">
            <svg
              className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <div className="flex-1">
              <p className="text-sm font-semibold text-blue-900 mb-1">
                Hướng dẫn:
              </p>
              <p className="text-sm text-blue-800">{hint}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionCard;
