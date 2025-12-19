import React from "react";
import { Trophy, Flame, MessageCircle } from "lucide-react";

interface TopTopic {
  rank: number;
  title: string;
  comments: number;
  category: string;
}

const topTopics: TopTopic[] = [
  {
    rank: 1,
    title: "Thuỳ Tiên bị bắt 2 năm: Bài học về danh hiệu?",
    comments: 248,
    category: "Xã hội",
  },
  {
    rank: 2,
    title: "AI có thể thay thế giáo viên không?",
    comments: 189,
    category: "Khoa học",
  },
  {
    rank: 3,
    title: "Văn học Việt Nam trong thời đại số",
    comments: 156,
    category: "Văn hóa",
  },
];

export function TopInteractionsWidget() {
  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-yellow-500 text-white";
      case 2:
        return "bg-gray-400 text-white";
      case 3:
        return "bg-orange-600 text-white";
      default:
        return "bg-gray-200 text-gray-900";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-[var(--gopass-border)] p-5">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-5 h-5 text-[var(--gopass-primary)]" />
        <h3 className="text-gray-900">Top Tương Tác</h3>
      </div>

      <div className="space-y-4">
        {topTopics.map((topic) => (
          <a key={topic.rank} href="#" className="block group">
            <div className="flex gap-3 items-start">
              {/* Rank Badge */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${getRankColor(
                  topic.rank
                )}`}
              >
                {topic.rank}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-gray-900 line-clamp-2 mb-1 group-hover:text-[var(--gopass-primary)] transition-colors">
                  {topic.title}
                </p>
                <div className="flex items-center gap-3 text-xs text-gray-600">
                  <span>{topic.category}</span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="w-3 h-3" />
                    {topic.comments}
                  </span>
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>

      <button className="w-full mt-4 py-2 text-gray-900 border border-gray-900 rounded-lg hover:bg-gray-50 transition-colors text-sm">
        Xem tất cả
      </button>
    </div>
  );
}