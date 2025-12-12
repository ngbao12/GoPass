// src/features/exam/components/shared/QuestionCard.tsx
"use client";

import React from "react";
import { Question } from "../../types";
import MathText from "@/components/ui/MathText";
import {
  MultipleChoiceInput,
  TrueFalseInput,
  ShortAnswerInput,
  EssayInput,
} from "../question-types";

// --- SUB-COMPONENTS ---

const QuestionImage = ({
  data,
}: {
  data: { url: string; caption?: string };
}) => (
  <div className="my-5 flex flex-col items-center">
    <div className="relative rounded-xl overflow-hidden border border-slate-200 shadow-sm max-w-full">
      <img
        src={data.url}
        alt="Question illustration"
        className="max-h-[400px] w-auto object-contain bg-slate-50"
      />
    </div>
    {data.caption && (
      <p className="mt-2 text-sm text-slate-500 italic text-center">
        {data.caption}
      </p>
    )}
  </div>
);

// --- COMPONENT BẢNG SỐ LIỆU ĐÃ CHỈNH SỬA ---
const QuestionTable = ({
  data,
}: {
  data: { headers: string[]; rows: string[][] };
}) => (
  <div className="my-6 flex justify-center">
    {" "}
    {/* Căn giữa bảng trong container */}
    <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm inline-block max-w-full">
      <table className="min-w-full text-sm text-slate-700">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            {data.headers.map((head, i) => (
              <th
                key={i}
                className="px-6 py-3 font-bold text-center whitespace-nowrap text-slate-800 uppercase text-xs tracking-wider"
              >
                <MathText content={head} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {data.rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-slate-50 transition-colors">
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className="px-6 py-3 text-center whitespace-nowrap" // Thêm text-center
                >
                  <MathText content={cell} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// --- MAIN COMPONENT ---

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  sectionName: string;
  sectionBadgeColor: string;
  points: number;
  selectedAnswer?: string[] | string | Record<string, string>;
  onAnswerChange: (answer: string[] | string | Record<string, string>) => void;
  isFlagged: boolean;
  onToggleFlag: () => void;
  hint?: string;
  passage?: string;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  questionNumber,
  sectionName,
  points,
  selectedAnswer,
  onAnswerChange,
  isFlagged,
  onToggleFlag,
  hint,
  passage,
}) => {
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
              onChange={(val) => onAnswerChange(val)}
            />
          </div>
        );

      case "true_false":
        let parsedTrueFalse: Record<string, string> = {};
        if (
          typeof selectedAnswer === "object" &&
          selectedAnswer !== null &&
          !Array.isArray(selectedAnswer)
        ) {
          parsedTrueFalse = selectedAnswer as Record<string, string>;
        } else if (typeof selectedAnswer === "string") {
          try {
            if (selectedAnswer.startsWith("{")) {
              parsedTrueFalse = JSON.parse(selectedAnswer);
            }
          } catch (e) {}
        }

        return (
          <div className="mt-6 w-full">
            <TrueFalseInput
              options={question.options || []}
              selectedAnswer={parsedTrueFalse}
              onChange={(newVal) => onAnswerChange(JSON.stringify(newVal))}
            />
          </div>
        );

      case "short_answer":
        let shortAnsValue = "";
        if (typeof selectedAnswer === "string") {
          shortAnsValue = selectedAnswer;
        } else if (Array.isArray(selectedAnswer) && selectedAnswer.length > 0) {
          shortAnsValue = selectedAnswer[0] || "";
        }

        return (
          <div className="mt-8 mb-4 w-full flex justify-center">
            <ShortAnswerInput
              value={shortAnsValue}
              onChange={(val) => onAnswerChange(val)}
            />
          </div>
        );

      case "essay":
        let essayValue = "";
        if (typeof selectedAnswer === "string") {
          essayValue = selectedAnswer;
        }
        return (
          <div className="mt-5">
            <EssayInput
              value={essayValue}
              onChange={(val) => onAnswerChange(val)}
            />
          </div>
        );

      default:
        return (
          <div className="p-4 text-red-500 italic">
            Loại câu hỏi chưa hỗ trợ.
          </div>
        );
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto mb-6">
      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
        {/* HEADER */}
        <div className="px-6 py-5 border-b border-slate-100 bg-gradient-to-b from-slate-50/50 to-white">
          <div className="flex items-start justify-between gap-4">
            {/* Info */}
            <div className="flex items-center gap-4 flex-1">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-xl bg-[#00747F] text-white flex items-center justify-center shadow-md shadow-teal-900/10">
                  <span className="text-xl font-bold font-mono">
                    {questionNumber}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
                  Câu hỏi {questionNumber}
                </h3>
                <div className="flex items-center gap-2 text-xs font-medium">
                  <span className="px-2.5 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-100">
                    {sectionName}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                  <span className="text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded border border-slate-200">
                    {points} điểm
                  </span>
                </div>
              </div>
            </div>

            {/* Flag */}
            <button
              onClick={onToggleFlag}
              className={`p-2 rounded-xl transition-all duration-200 ${
                isFlagged
                  ? "bg-amber-50 text-amber-500 ring-1 ring-amber-200"
                  : "text-slate-300 hover:bg-slate-50 hover:text-slate-500"
              }`}
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

          {/* CONTENT AREA */}
          <div className="mt-5 space-y-5">
            {/* 1. Text Content */}
            <div className="text-base text-slate-800 font-medium leading-7">
              <MathText content={question.content} />
            </div>

            {/* 2. Image (If any) */}
            {question.image && <QuestionImage data={question.image} />}

            {/* 3. Table (If any) */}
            {question.tableData && <QuestionTable data={question.tableData} />}

            {/* 4. Reading Passage (If any) */}
            {passage && (
              <div className="p-4 bg-slate-50 rounded-xl border-l-4 border-slate-300 text-sm text-slate-600 italic">
                <MathText content={passage} />
              </div>
            )}
          </div>
        </div>

        {/* INPUT AREA */}
        <div className="px-6 pb-8 pt-2 bg-white min-h-[120px]">
          {renderQuestionInput()}
        </div>

        {/* FOOTER HINT */}
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
            <div className="w-full">
              <p className="font-bold text-sky-900 text-xs mb-0.5 uppercase tracking-wider">
                Hướng dẫn giải
              </p>
              <div className="text-sky-800 text-sm leading-relaxed opacity-90">
                <MathText content={hint} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionCard;
