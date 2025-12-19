import React from "react";
import { TrendingUp, MessageCircle } from "lucide-react";

interface RelatedTopic {
  title: string;
  category: string;
  comments: number;
}

const relatedTopics: RelatedTopic[] = [
  {
    title: "Đạo đức nghề nghiệp trong kỷ nguyên số",
    category: "Xã hội",
    comments: 124,
  },
  {
    title: "Trách nhiệm pháp lý của người nổi tiếng",
    category: "Xã hội",
    comments: 89,
  },
  {
    title: "Ảnh hưởng của mạng xã hội đến hành vi",
    category: "Khoa học",
    comments: 156,
  },
  {
    title: "Giáo dục đạo đức trong nhà trường",
    category: "Giáo dục",
    comments: 67,
  },
];

export function RelatedTopicsWidget() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-[var(--gopass-border)] p-5">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-[var(--gopass-primary)]" />
        <h3 className="text-gray-900">Chủ đề liên quan</h3>
      </div>

      <div className="space-y-3">
        {relatedTopics.map((topic, index) => (
          <a
            key={index}
            href="#"
            className="block p-3 rounded-lg hover:bg-[var(--gopass-background)] transition-colors group"
          >
            <p className="text-[var(--gopass-text)] mb-2 line-clamp-2 group-hover:text-[var(--gopass-primary)] transition-colors">
              {topic.title}
            </p>
            <div className="flex items-center justify-between text-xs text-[var(--gopass-text-muted)]">
              <span>{topic.category}</span>
              <span className="flex items-center gap-1">
                <MessageCircle className="w-3 h-3" />
                {topic.comments}
              </span>
            </div>
          </a>
        ))}
      </div>

      <button className="w-full mt-4 py-2 text-[var(--gopass-primary)] border border-[var(--gopass-primary)] rounded-lg hover:bg-[var(--gopass-primary)]/5 transition-colors text-sm">
        Xem thêm
      </button>
    </div>
  );
}
