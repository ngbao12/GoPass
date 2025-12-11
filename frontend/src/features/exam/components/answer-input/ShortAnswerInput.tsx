// src/features/exam/components/answer-input/ShortAnswerInput.tsx
"use client";

import React from "react";

interface ShortAnswerInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  correctAnswer?: string;
  placeholder?: string;
}

const ShortAnswerInput: React.FC<ShortAnswerInputProps> = ({
  value,
  onChange,
  disabled = false,
  correctAnswer,
  placeholder = "Type your answer...",
}) => {
  const showCorrect = disabled && correctAnswer;
  const isCorrect =
    showCorrect &&
    value.toLowerCase().trim() === correctAnswer.toLowerCase().trim();

  return (
    <div className="space-y-2">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        className={`
          w-full p-4 border-2 rounded-lg text-lg
          focus:outline-none focus:ring-2 focus:ring-teal-500
          ${disabled ? "bg-gray-50 cursor-not-allowed" : "bg-white"}
          ${showCorrect && isCorrect ? "border-green-500 bg-green-50" : ""}
          ${showCorrect && !isCorrect ? "border-red-500 bg-red-50" : ""}
        `}
      />

      {showCorrect && (
        <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
          <p className="text-sm text-gray-600">Correct Answer:</p>
          <p className="text-green-600 font-semibold">{correctAnswer}</p>
        </div>
      )}
    </div>
  );
};

export default ShortAnswerInput;
