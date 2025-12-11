// src/features/exam/components/answer-input/EssayInput.tsx
"use client";

import React from "react";

interface EssayInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  minWords?: number;
  maxWords?: number;
}

const EssayInput: React.FC<EssayInputProps> = ({
  value,
  onChange,
  disabled = false,
  minWords = 50,
  maxWords = 500,
}) => {
  const wordCount = value.trim().split(/\s+/).filter(Boolean).length;
  const characterCount = value.length;

  const getWordCountColor = () => {
    if (wordCount < minWords) return "text-orange-600";
    if (wordCount > maxWords) return "text-red-600";
    return "text-green-600";
  };

  return (
    <div className="space-y-2">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder="Type your answer here..."
        className={`
          w-full min-h-[300px] p-4 border-2 rounded-lg
          focus:outline-none focus:ring-2 focus:ring-teal-500
          ${disabled ? "bg-gray-50 cursor-not-allowed" : "bg-white"}
        `}
      />

      <div className="flex justify-between text-sm">
        <span className={`font-medium ${getWordCountColor()}`}>
          {wordCount} words {minWords && `(min: ${minWords})`}
        </span>
        <span className="text-gray-500">{characterCount} characters</span>
      </div>

      {wordCount > maxWords && (
        <p className="text-red-600 text-sm">
          ⚠️ You have exceeded the maximum word limit of {maxWords} words
        </p>
      )}
    </div>
  );
};

export default EssayInput;
