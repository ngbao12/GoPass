// src/features/exam/components/answer-input/MultipleChoiceInput.tsx
"use client";

import React from "react";
import { Question, QuestionOption } from "../../types";

interface MultipleChoiceInputProps {
  question: Question;
  selectedOptions: string[];
  onChange: (selected: string[]) => void;
  isReviewMode?: boolean;
  showCorrectAnswer?: boolean;
}

const MultipleChoiceInput: React.FC<MultipleChoiceInputProps> = ({
  question,
  selectedOptions,
  onChange,
  isReviewMode = false,
  showCorrectAnswer = false,
}) => {
  const handleOptionClick = (optionText: string) => {
    if (isReviewMode) return;
    onChange([optionText]); // Single select
  };

  const getOptionStyle = (option: QuestionOption) => {
    if (!showCorrectAnswer) {
      const isSelected = selectedOptions.includes(option.text);
      return isSelected
        ? "border-teal-500 bg-teal-50"
        : "border-gray-300 bg-white hover:border-gray-400";
    }

    const isSelected = selectedOptions.includes(option.text);
    const isCorrect = option.isCorrect;

    if (isCorrect && isSelected) {
      return "border-green-500 bg-green-50";
    }
    if (isCorrect && !isSelected) {
      return "border-green-500 bg-green-50 opacity-75";
    }
    if (!isCorrect && isSelected) {
      return "border-red-500 bg-red-50";
    }
    return "border-gray-300 bg-white";
  };

  return (
    <div className="space-y-3">
      {question.options.map((option, index) => (
        <button
          key={index}
          onClick={() => handleOptionClick(option.text)}
          disabled={isReviewMode}
          className={`
            w-full p-4 text-left rounded-lg border-2 transition-all
            ${getOptionStyle(option)}
            ${isReviewMode ? "cursor-default" : "cursor-pointer"}
          `}
        >
          <div className="flex items-start gap-3">
            <div
              className={`
              w-6 h-6 rounded-full border-2 flex items-center justify-center mt-0.5
              ${
                selectedOptions.includes(option.text)
                  ? "bg-teal-500 border-teal-500"
                  : "border-gray-400"
              }
            `}
            >
              {selectedOptions.includes(option.text) && (
                <svg
                  className="w-4 h-4 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
            <span className="flex-1 text-gray-900">{option.text}</span>
            {showCorrectAnswer && option.isCorrect && (
              <span className="text-green-600 font-semibold">✓ Correct</span>
            )}
          </div>
        </button>
      ))}
    </div>
  );
};

export default MultipleChoiceInput;
