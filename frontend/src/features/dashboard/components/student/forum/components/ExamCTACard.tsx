import React from "react";
import { BookOpen, Clock, FileText, ArrowRight, Star } from "lucide-react";

interface ExamCTACardProps {
  title: string;
  subject: string;
  duration: number;
  questionCount: number;
  relevanceScore?: number;
}

export function ExamCTACard({
  title,
  subject,
  duration,
  questionCount,
  relevanceScore = 95,
}: ExamCTACardProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg border-2 border-[var(--gopass-primary)] overflow-hidden sticky top-8">
      {/* Badge */}
      <div className="bg-gradient-to-r from-[var(--gopass-primary)] to-[#008C7A] px-4 py-2">
        <div className="flex items-center gap-2 text-white">
          <Star className="w-4 h-4" />
          <span className="text-sm">Liên quan {relevanceScore}%</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start gap-2 mb-3">
          <BookOpen className="w-5 h-5 text-[var(--gopass-primary)] flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs text-[var(--gopass-text-muted)] mb-1">
              Thử sức ngay
            </p>
            <h3 className="text-[var(--gopass-text)]">{title}</h3>
          </div>
        </div>

        {/* Subject Badge */}
        <div className="inline-block px-3 py-1 bg-[var(--gopass-primary)]/10 text-[var(--gopass-primary)] rounded text-sm mb-4">
          {subject}
        </div>

        {/* Stats */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-[var(--gopass-text-muted)]">
            <Clock className="w-4 h-4" />
            <span>{duration} phút</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-[var(--gopass-text-muted)]">
            <FileText className="w-4 h-4" />
            <span>{questionCount} câu hỏi</span>
          </div>
        </div>

        {/* CTA Button */}
        <button className="w-full py-3 bg-[var(--gopass-primary)] text-white rounded-lg hover:bg-[var(--gopass-primary-hover)] transition-colors flex items-center justify-center gap-2 group">
          <span>Làm bài ngay</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Info */}
        <p className="text-xs text-center text-[var(--gopass-text-muted)] mt-3">
          Đề thi này giúp bạn áp dụng kiến thức từ thảo luận
        </p>
      </div>
    </div>
  );
}
