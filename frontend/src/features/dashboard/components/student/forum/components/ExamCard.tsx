import React from "react";
import { Clock, FileText, Award } from "lucide-react";

interface ExamCardProps {
  title: string;
  subject: string;
  subjectColor: string;
  duration: number;
  questionCount: number;
  difficulty: "Dễ" | "Trung bình" | "Khó";
  status?: "Chưa làm" | "Đã hoàn thành" | "Đang làm";
  completionRate?: number;
}

export function ExamCard({
  title,
  subject,
  subjectColor,
  duration,
  questionCount,
  difficulty,
  status = "Chưa làm",
  completionRate,
}: ExamCardProps) {
  const difficultyColors = {
    Dễ: "bg-green-100 text-green-700",
    "Trung bình": "bg-yellow-100 text-yellow-700",
    Khó: "bg-red-100 text-red-700",
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-[var(--gopass-border)] hover:shadow-md transition-all p-6 flex flex-col h-full">
      {/* Header with Subject Badge */}
      <div className="flex items-start justify-between mb-4">
        <div
          className="px-3 py-1 rounded-md text-white"
          style={{ backgroundColor: subjectColor }}
        >
          {subject}
        </div>
        <div
          className={`px-2 py-1 rounded text-xs ${difficultyColors[difficulty]}`}
        >
          {difficulty}
        </div>
      </div>

      {/* Title */}
      <h3 className="text-[var(--gopass-text)] mb-4 flex-grow">{title}</h3>

      {/* Stats */}
      <div className="flex items-center gap-4 mb-4 text-[var(--gopass-text-muted)]">
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          <span className="text-sm">{duration} phút</span>
        </div>
        <div className="flex items-center gap-1">
          <FileText className="w-4 h-4" />
          <span className="text-sm">{questionCount} câu</span>
        </div>
      </div>

      {/* Status or Completion */}
      {completionRate !== undefined && completionRate > 0 ? (
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-[var(--gopass-text-muted)]">Hoàn thành</span>
            <span className="text-[var(--gopass-primary)]">
              {completionRate}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-[var(--gopass-primary)] h-2 rounded-full transition-all"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>
      ) : (
        <div className="mb-4">
          <span className="text-sm text-[var(--gopass-text-muted)]">
            {status}
          </span>
        </div>
      )}

      {/* Action Button */}
      <button className="w-full py-3 bg-[var(--gopass-primary)] text-white rounded-lg hover:bg-[var(--gopass-primary-hover)] transition-colors">
        {status === "Đã hoàn thành"
          ? "Xem lại"
          : status === "Đang làm"
          ? "Tiếp tục"
          : "Bắt đầu"}
      </button>
    </div>
  );
}
