// src/features/exam/components/question-types/TrueFalseInput.tsx
"use client";

import React from "react";

interface Option {
  text: string;
  isCorrect?: boolean;
}

interface TrueFalseInputProps {
  options: Option[];
  selectedOption?: string;
  onChange: (value: string) => void;
  subQuestions?: Array<{
    id: string;
    text: string;
    selectedValue?: "Đúng" | "Sai";
  }>;
  onSubQuestionChange?: (id: string, value: "Đúng" | "Sai") => void;
}

/**
 * True/False toggle input
 * For single true/false or multi-part true/false questions
 */
const TrueFalseInput: React.FC<TrueFalseInputProps> = ({
  options,
  selectedOption,
  onChange,
  subQuestions,
  onSubQuestionChange,
}) => {
  // Multi-part true/false (like in Math exam image)
  if (subQuestions && onSubQuestionChange) {
    return (
      <div className="space-y-3">
        {subQuestions.map((subQ) => (
          <div
            key={subQ.id}
            className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 bg-gray-50 text-sm"
          >
            {/* Sub-question label */}
            <div className="w-7 h-7 rounded-full bg-purple-500 text-white flex items-center justify-center text-sm font-semibold flex-shrink-0">
              {subQ.id}
            </div>

            {/* Sub-question text */}
            <div className="flex-1">
              <p className="text-sm text-gray-800 mb-2">{subQ.text}</p>

              {/* Toggle buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => onSubQuestionChange(subQ.id, "Đúng")}
                  className={`
                    px-4 py-1.5 rounded-lg text-sm font-medium transition-all
                    ${
                      subQ.selectedValue === "Đúng"
                        ? "bg-green-500 text-white shadow-sm"
                        : "bg-white border-2 border-gray-300 text-gray-700 hover:border-gray-400"
                    }
                  `}
                >
                  <div className="flex items-center gap-1.5">
                    {subQ.selectedValue === "Đúng" && (
                      <svg
                        className="w-3.5 h-3.5"
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
                    <span>Đúng</span>
                  </div>
                </button>

                <button
                  onClick={() => onSubQuestionChange(subQ.id, "Sai")}
                  className={`
                    px-4 py-1.5 rounded-lg text-sm font-medium transition-all
                    ${
                      subQ.selectedValue === "Sai"
                        ? "bg-red-500 text-white shadow-sm"
                        : "bg-white border-2 border-gray-300 text-gray-700 hover:border-gray-400"
                    }
                  `}
                >
                  <div className="flex items-center gap-1.5">
                    {subQ.selectedValue === "Sai" && (
                      <svg
                        className="w-3.5 h-3.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                    <span>Sai</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Check/Cross indicator */}
            {subQ.selectedValue && (
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                  subQ.selectedValue === "Đúng" ? "bg-green-100" : "bg-red-100"
                }`}
              >
                <svg
                  className={`w-3.5 h-3.5 ${
                    subQ.selectedValue === "Đúng"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  {subQ.selectedValue === "Đúng" ? (
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  ) : (
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  )}
                </svg>
              </div>
            )}
          </div>
        ))}

        {/* Hint */}
        <p className="text-xs text-purple-600 mt-3 flex items-start gap-1.5">
          <svg
            className="w-3.5 h-3.5 mt-0.5 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          <span>
            Hướng dẫn: Trong mỗi ý a), b), c), d), thí sinh chọn{" "}
            <strong>Đúng</strong> hoặc <strong>Sai</strong>.
          </span>
        </p>
      </div>
    );
  }

  // Simple true/false (single question)
  return (
    <div className="flex gap-3">
      {options.map((option) => {
        const isSelected = selectedOption === option.text;

        return (
          <button
            key={option.text}
            onClick={() => onChange(option.text)}
            className={`
              flex-1 py-3 rounded-lg text-sm font-semibold transition-all border-2
              ${
                isSelected
                  ? option.text === "Đúng"
                    ? "bg-green-500 border-green-600 text-white shadow-md"
                    : "bg-red-500 border-red-600 text-white shadow-md"
                  : "bg-white border-gray-300 text-gray-700 hover:border-gray-400"
              }
            `}
          >
            {option.text}
          </button>
        );
      })}
    </div>
  );
};

export default TrueFalseInput;
