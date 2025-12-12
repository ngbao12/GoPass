// src/features/exam/components/question-types/MultipleChoiceInput.tsx
"use client";

import React from "react";
import { QuestionOption } from "@/features/exam/types/question";
import MathText from "@/components/ui/MathText";

interface MultipleChoiceInputProps {
  options: QuestionOption[];
  selectedOptions: string[];
  onChange: (selected: string[]) => void;
}

const MultipleChoiceInput: React.FC<MultipleChoiceInputProps> = ({
  options,
  selectedOptions,
  onChange,
}) => {
  const handleSelect = (optionId: string) => {
    onChange([optionId]);
  };

  const isSelected = (optionId: string) => selectedOptions.includes(optionId);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {options.map((option, index) => {
          const selected = isSelected(option.id);
          const label = option.id || String.fromCharCode(65 + index);

          return (
            <button
              key={option.id}
              onClick={() => handleSelect(option.id)}
              className={`
                relative w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all duration-200 group
                ${
                  selected
                    ? "bg-teal-50 border-[#00747F] shadow-md z-10"
                    : "bg-white border-slate-200 hover:border-[#00747F]/60 hover:bg-slate-50"
                }
              `}
            >
              {/* Badge (A, B, C...) */}
              <div
                className={`
                  w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold flex-shrink-0 transition-colors
                  ${
                    selected
                      ? "bg-[#00747F] text-white"
                      : "bg-slate-100 text-slate-500 group-hover:bg-white group-hover:text-[#00747F] border border-slate-200"
                  }
                `}
              >
                {label}
              </div>

              {/* Text Content */}
              <span
                className={`flex-1 text-base ${
                  selected
                    ? "text-[#00747F] font-semibold"
                    : "text-slate-700 font-medium"
                }`}
              >
                <MathText
                  content={option.content || (option as any).text || ""}
                />
              </span>

              {/* Radio Circle */}
              <div
                className={`
                  w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all
                  ${
                    selected
                      ? "border-[#00747F] bg-[#00747F]"
                      : "border-slate-300 bg-white group-hover:border-[#00747F]"
                  }
                `}
              >
                {selected && (
                  <div className="w-2.5 h-2.5 bg-white rounded-full animate-in zoom-in" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      <p className="text-xs text-slate-400 mt-2 italic px-1">
        * Chọn 1 phương án đúng nhất
      </p>
    </div>
  );
};

export default MultipleChoiceInput;
