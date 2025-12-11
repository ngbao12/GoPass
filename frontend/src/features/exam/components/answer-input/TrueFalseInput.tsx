// src/features/exam/components/answer-input/TrueFalseInput.tsx
"use client";

import React from "react";

interface TrueFalseInputProps {
  selectedOption?: string;
  onChange: (option: string) => void;
  disabled?: boolean;
  correctAnswer?: string;
}

const TrueFalseInput: React.FC<TrueFalseInputProps> = ({
  selectedOption,
  onChange,
  disabled = false,
  correctAnswer,
}) => {
  const options = ["True", "False"];

  const getOptionStyle = (option: string) => {
    if (!correctAnswer) {
      const isSelected = selectedOption === option;
      return isSelected
        ? "border-teal-500 bg-teal-50"
        : "border-gray-300 bg-white hover:border-gray-400";
    }

    const isSelected = selectedOption === option;
    const isCorrect = option === correctAnswer;

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
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onChange(option)}
          disabled={disabled}
          className={`
            w-full p-4 text-left rounded-lg border-2 transition-all
            ${getOptionStyle(option)}
            ${disabled ? "cursor-default" : "cursor-pointer"}
          `}
        >
          <div className="flex items-center gap-3">
            <div
              className={`
              w-6 h-6 rounded-full border-2 flex items-center justify-center
              ${
                selectedOption === option
                  ? "bg-teal-500 border-teal-500"
                  : "border-gray-400"
              }
            `}
            >
              {selectedOption === option && (
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
            <span className="flex-1 text-gray-900 font-medium">{option}</span>
            {correctAnswer && option === correctAnswer && (
              <span className="text-green-600 font-semibold">✓ Correct</span>
            )}
          </div>
        </button>
      ))}
    </div>
  );
};

export default TrueFalseInput;
