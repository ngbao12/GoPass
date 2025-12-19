import React from "react";
import { BookOpen, ArrowRight } from "lucide-react";

export function ForumBanner() {
  return (
    <div className="bg-[#008C7A] rounded-lg shadow-sm p-6 text-white">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
          <BookOpen className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h3 className="mb-2 text-white">Từ Tin Tức đến Bài Học</h3>
          <p className="text-sm opacity-90 mb-4 text-white">
            Mỗi sự kiện là một cơ hội học tập. Khám phá cách sự kiện hôm nay
            liên quan đến kiến thức kỳ thi.
          </p>
          <button className="flex items-center gap-2 px-4 py-2 bg-white text-gray-900 rounded-lg hover:bg-gray-50 transition-colors text-sm">
            <span>Tìm hiểu thêm</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}