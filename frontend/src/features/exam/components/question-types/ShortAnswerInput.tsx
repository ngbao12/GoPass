// src/features/exam/components/question-types/ShortAnswerInput.tsx
"use client";

import React from "react";

interface ShortAnswerInputProps {
  value: string;
  onChange: (value: string) => void;
  hint?: string;
  fillInBlanks?: Array<{
    id: string;
    value: string;
  }>;
  onFillInBlanksChange?: (id: string, value: string) => void;
}

/**
 * Short answer text input
 * Can be single input or multiple fill-in-the-blanks
 */
const ShortAnswerInput: React.FC<ShortAnswerInputProps> = ({
  value,
  onChange,
  hint,
  fillInBlanks,
  onFillInBlanksChange,
}) => {
  // Fill-in-the-blanks type (like in Math image 3)
  if (fillInBlanks && onFillInBlanksChange) {
    return (
      <div className="space-y-3">
        {/* Input Grid */}
        <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4">
          <h4 className="text-xs font-semibold text-gray-900 mb-3 flex items-center gap-1.5">
            <svg
              className="w-4 h-4 text-orange-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
              <path
                fillRule="evenodd"
                d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                clipRule="evenodd"
              />
            </svg>
            Nhập đáp án của bạn
          </h4>

          <p className="text-xs text-gray-600 mb-3">Tối đa 4 ký tự</p>

          {/* Input boxes grid */}
          <div className="grid grid-cols-4 gap-3">
            {fillInBlanks.map((blank, index) => {
              const hasValue = blank.value.trim() !== "";

              return (
                <div key={blank.id} className="space-y-2">
                  {/* Label */}
                  <label className="text-xs font-medium text-gray-700 flex items-center gap-1.5">
                    {hasValue && (
                      <svg
                        className="w-3.5 h-3.5 text-teal-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                    <span>{blank.id}</span>
                  </label>

                  {/* Input */}
                  <input
                    type="text"
                    value={blank.value}
                    onChange={(e) => {
                      const val = e.target.value.slice(0, 4); // Max 4 chars
                      onFillInBlanksChange(blank.id, val);
                    }}
                    maxLength={4}
                    className={`
                      w-full px-3 py-2 text-center text-base font-semibold rounded-lg border-2
                      focus:outline-none focus:ring-2 focus:ring-orange-500
                      ${
                        hasValue
                          ? "border-teal-500 bg-white text-gray-900"
                          : "border-orange-300 bg-white text-gray-500"
                      }
                    `}
                    placeholder="..."
                  />
                </div>
              );
            })}
          </div>

          {/* Format hint */}
          <div className="mt-3 flex items-start gap-1.5 text-xs text-orange-800">
            <svg
              className="w-3.5 h-3.5 mt-0.5 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span>Ví dụ: 12.3 ⇒ [1][2][.][3] hoặc [1][2][3]</span>
          </div>
        </div>

        {/* Additional hint */}
        {hint && (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
            <p className="text-xs text-blue-800">{hint}</p>
          </div>
        )}
      </div>
    );
  }

  // Simple text input
  return (
    <div className="space-y-2">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Nhập câu trả lời..."
        className="w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg text-sm
          focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
      />

      {hint && (
        <p className="text-xs text-gray-600 flex items-start gap-1.5">
          <svg
            className="w-3.5 h-3.5 text-gray-400 mt-0.5 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          <span>{hint}</span>
        </p>
      )}
    </div>
  );
};

export default ShortAnswerInput;
