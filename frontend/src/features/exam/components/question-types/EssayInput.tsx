// src/features/exam/components/question-types/EssayInput.tsx
"use client";

import React from "react";

interface EssayInputProps {
  value: string;
  onChange: (value: string) => void;
  minWords?: number;
  maxWords?: number;
}

/**
 * Essay textarea input with word counter
 */
const EssayInput: React.FC<EssayInputProps> = ({
  value,
  onChange,
  minWords = 50,
  maxWords = 600,
}) => {
  const wordCount = value.trim() === "" ? 0 : value.trim().split(/\s+/).length;
  const characterCount = value.length;

  const getWordCountColor = (): string => {
    if (wordCount < minWords) return "text-orange-600";
    if (wordCount > maxWords) return "text-red-600";
    return "text-green-600";
  };

  return (
    <div className="space-y-3">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Nhập câu trả lời của bạn tại đây..."
        rows={10}
        className="w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg text-sm
          focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500
          resize-none"
      />

      {/* Word Counter */}
      <div className="flex items-center justify-between text-xs">
        <span className={`font-medium ${getWordCountColor()}`}>
          {wordCount} từ {minWords && `(tối thiểu: ${minWords})`}
        </span>
        <span className="text-gray-500">{characterCount} ký tự</span>
      </div>

      {/* Warning if exceeded */}
      {wordCount > maxWords && (
        <div className="flex items-start gap-1.5 p-2.5 bg-red-50 border border-red-200 rounded-lg">
          <svg
            className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-xs text-red-700">
            Bạn đã vượt quá giới hạn {maxWords} từ
          </span>
        </div>
      )}
    </div>
  );
};

export default EssayInput;
