// src/features/exam/components/question-types/TrueFalseInput.tsx
"use client";

import React from "react";
import { QuestionOption } from "@/features/exam/types/question";

interface TrueFalseInputProps {
  options: QuestionOption[];
  selectedAnswer?: Record<string, string>;
  onChange: (value: Record<string, string>) => void;
}

const TrueFalseInput: React.FC<TrueFalseInputProps> = ({
  options = [],
  selectedAnswer = {},
  onChange,
}) => {
  // Hàm xử lý khi người dùng click chọn Đúng/Sai cho một ý
  const handleSubChange = (optionId: string, value: "Đúng" | "Sai") => {
    const newAnswers = { ...selectedAnswer, [optionId]: value };
    onChange(newAnswers);
  };

  return (
    <div className="space-y-4 w-full">
      {options.map((opt) => {
        // Lấy giá trị hiện tại của ý này (Đúng, Sai hoặc undefined)
        const value = selectedAnswer[opt.id];

        return (
          <div
            key={opt.id}
            className={`bg-white rounded-2xl border-2 p-5 shadow-sm transition-all duration-200 ${
              value
                ? value === "Đúng"
                  ? "border-green-400 ring-2 ring-green-100" // Style khi chọn Đúng
                  : "border-rose-400 ring-2 ring-rose-100" // Style khi chọn Sai
                : "border-slate-200 hover:border-slate-300" // Style mặc định
            }`}
          >
            {/* Header: Label (a, b...) + Nội dung mệnh đề */}
            <div className="flex items-start gap-4 mb-4">
              <div className="flex-shrink-0 w-8 h-8 bg-slate-100 text-slate-600 rounded-lg flex items-center justify-center font-bold text-sm border border-slate-200">
                {opt.id})
              </div>
              <p className="flex-1 text-base text-slate-700 leading-relaxed pt-1 font-medium">
                {opt.content}
              </p>
            </div>

            {/* Buttons: Group nút chọn */}
            <div className="ml-12 flex items-center gap-3">
              {/* Nút ĐÚNG */}
              <button
                onClick={() => handleSubChange(opt.id, "Đúng")}
                className={`group flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${
                  value === "Đúng"
                    ? "bg-green-600 text-white shadow-md transform scale-105"
                    : "bg-white border border-slate-300 text-slate-500 hover:border-green-500 hover:text-green-600 hover:bg-green-50"
                }`}
              >
                <span>Đúng</span>
                {value === "Đúng" && (
                  <svg
                    className="w-4 h-4 animate-in zoom-in"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </button>

              {/* Nút SAI */}
              <button
                onClick={() => handleSubChange(opt.id, "Sai")}
                className={`group flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${
                  value === "Sai"
                    ? "bg-rose-500 text-white shadow-md transform scale-105"
                    : "bg-white border border-slate-300 text-slate-500 hover:border-rose-500 hover:text-rose-600 hover:bg-rose-50"
                }`}
              >
                <span>Sai</span>
                {value === "Sai" && (
                  <svg
                    className="w-4 h-4 animate-in zoom-in"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        );
      })}

      {/* Footer Hint */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center gap-2 text-sm text-slate-500 italic">
        <svg
          className="w-4 h-4 text-slate-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>Trong mỗi ý a), b), c), d), thí sinh chọn đúng hoặc sai.</span>
      </div>
    </div>
  );
};

export default TrueFalseInput;
