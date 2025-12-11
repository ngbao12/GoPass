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
  passage?: string; // Dành cho bài đọc hiểu
}

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
  // Helper để render loại input tương ứng
  const renderQuestionInput = () => {
    switch (question.type) {
      case "multiple_choice":
        return (
          <div className="mt-5">
            <MultipleChoiceInput
              options={question.options || []}
              selectedOptions={
                Array.isArray(selectedAnswer) ? selectedAnswer : []
              }
              onChange={onAnswerChange}
            />
          </div>
        );

      case "true_false":
        // Logic xử lý câu hỏi Đúng/Sai nhiều ý (Sub-questions)
        if (question.subQuestions) {
          let currentAnswers: Record<string, "Đúng" | "Sai"> = {};
          try {
            if (typeof selectedAnswer === "string") {
              currentAnswers = JSON.parse(selectedAnswer);
            }
          } catch (e) {
            // Ignore parse error
          }

          const subQuestionsWithState = question.subQuestions.map((sq) => ({
            ...sq,
            selectedValue: currentAnswers[sq.id],
          }));

          return (
            <div className="mt-6 w-full">
              <TrueFalseInput
                options={question.options || []}
                onChange={() => {}} // Không dùng onChange cấp cao nhất ở đây
                subQuestions={subQuestionsWithState}
                onSubQuestionChange={(id, value) => {
                  const newAnswers = { ...currentAnswers, [id]: value };
                  onAnswerChange(JSON.stringify(newAnswers));
                }}
              />
            </div>
          );
        }

        // Logic xử lý câu hỏi Đúng/Sai đơn (1 ý)
        return (
          <div className="mt-5">
            <TrueFalseInput
              options={question.options || []}
              selectedOption={
                Array.isArray(selectedAnswer)
                  ? selectedAnswer[0]
                  : selectedAnswer
              }
              onChange={(value: string) => onAnswerChange([value])}
            />
          </div>
        );

      case "short_answer":
        // Logic xử lý câu trả lời ngắn (4 ô vuông)
        let displayValue = "";
        // Đảm bảo lấy ra string để truyền vào component 4 ô
        if (typeof selectedAnswer === "string") {
          displayValue = selectedAnswer;
        } else if (Array.isArray(selectedAnswer) && selectedAnswer.length > 0) {
          displayValue = selectedAnswer[0];
        }

        return (
          // Căn giữa component nhập liệu
          <div className="mt-8 mb-4 w-full flex justify-center">
            <ShortAnswerInput
              value={displayValue}
              onChange={(val) => onAnswerChange(val)}
              hint={question.hint || hint}
            />
          </div>
        );

      case "essay":
        return (
          <div className="mt-5">
            <EssayInput
              value={typeof selectedAnswer === "string" ? selectedAnswer : ""}
              onChange={onAnswerChange}
            />
          </div>
        );

      default:
        return (
          <div className="p-4 text-red-500 italic">
            Loại câu hỏi chưa được hỗ trợ hiển thị.
          </div>
        );
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto mb-6">
      {/* CARD CONTAINER:
        - Bo góc lớn (rounded-[2rem])
        - Border màu Slate nhẹ
        - Shadow mềm
      */}
      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
        {/* === HEADER SECTION === */}
        <div className="px-6 py-5 border-b border-slate-100 bg-gradient-to-b from-slate-50/50 to-white">
          <div className="flex items-start justify-between gap-4">
            {/* Left: Thông tin câu hỏi */}
            <div className="flex items-center gap-4 flex-1">
              {/* Badge Số câu: Nhỏ gọn (w-12), màu Teal (#00747F) */}
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-xl bg-[#00747F] text-white flex items-center justify-center shadow-md shadow-teal-900/10">
                  <span className="text-xl font-bold font-mono">
                    {questionNumber}
                  </span>
                </div>
              </div>

              {/* Meta Data */}
              <div className="flex flex-col gap-1">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
                  Câu hỏi {questionNumber}
                </h3>

                <div className="flex items-center gap-2 text-xs font-medium">
                  {/* Badge Phần thi: Teal nhạt */}
                  <span
                    className={`px-2.5 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-100`}
                  >
                    {sectionName}
                  </span>

                  <span className="w-1 h-1 rounded-full bg-slate-300"></span>

                  {/* Badge Điểm: Slate nhạt */}
                  <span className="text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded border border-slate-200">
                    {points} điểm
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Nút đánh dấu (Flag) - Màu Amber */}
            <button
              onClick={onToggleFlag}
              className={`p-2 rounded-xl transition-all duration-200 ${
                isFlagged
                  ? "bg-amber-50 text-amber-500 ring-1 ring-amber-200"
                  : "text-slate-300 hover:bg-slate-50 hover:text-slate-500"
              }`}
              title={isFlagged ? "Bỏ đánh dấu" : "Đánh dấu xem lại"}
            >
              <svg
                className={`w-5 h-5 ${
                  isFlagged ? "fill-current" : "fill-none"
                }`}
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"
                />
              </svg>
            </button>
          </div>

          {/* === NỘI DUNG CÂU HỎI === */}
          <div className="mt-5">
            {/* Chữ vừa phải (text-base), màu đậm dễ đọc */}
            <div className="text-base text-slate-800 font-medium leading-7">
              {question.content}
            </div>

            {/* Bài đọc hiểu (nếu có) */}
            {passage && (
              <div className="mt-4 p-4 bg-slate-50 rounded-xl border-l-4 border-slate-300 text-sm text-slate-600 italic">
                {passage}
              </div>
            )}
          </div>
        </div>

        {/* === INPUT AREA === */}
        <div className="px-6 pb-8 pt-2 bg-white min-h-[120px]">
          {renderQuestionInput()}
        </div>

        {/* === FOOTER: HINT / HƯỚNG DẪN === */}
        {hint && (
          <div className="px-6 py-4 bg-sky-50/50 border-t border-sky-100 flex gap-3">
            <div className="flex-shrink-0 mt-0.5 text-sky-500">
              <svg
                className="w-5 h-5"
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
            </div>
            <div>
              <p className="font-bold text-sky-900 text-xs mb-0.5 uppercase tracking-wider">
                Hướng dẫn giải
              </p>
              <p className="text-sky-800 text-sm leading-relaxed opacity-90">
                {hint}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionCard;
