import React from "react";
import {
  Flame,
  Sparkles,
  List,
  Newspaper,
  Microscope,
  Palette,
} from "lucide-react";
import { vnsocialTopic } from "@/features/dashboard/types/forum";

interface ForumLeftNavProps {
  activeItem: string;
  onItemClick: (item: string) => void;
  vnsocialTopics: vnsocialTopic[];
  totalArticles: number;
}

export function ForumLeftNav({
  activeItem,
  onItemClick,
  vnsocialTopics,
  totalArticles,
}: ForumLeftNavProps) {
  const mainItems = [
    { id: "all", label: "Tất cả chủ đề", icon: List },
    { id: "trending", label: "Đang Hot", icon: Flame, highlight: true },
    { id: "for-you", label: "Dành cho bạn", icon: Sparkles },
  ];

  // Helper function to get icon and color for category
  const getCategoryIcon = (index: number) => {
    const icons = [Newspaper, Microscope, Palette];
    return icons[index % icons.length];
  };

  const getCategoryColor = (topicName: string) => {
    const colors: { [key: string]: string } = {
      "văn hóa số": "#3B82F6",
      "áp lực học tập": "#EF4444",
      "ứng xử văn minh": "#8B5CF6",
      "lối sống xanh": "#10B981",
      "sự tử tế": "#EC4899",
    };
    return colors[topicName.toLowerCase()] || "#F59E0B";
  };

  return (
    <aside className="w-64 flex-shrink-0">
      <div className="bg-white rounded-lg shadow-sm border border-[var(--gopass-border)] p-4 sticky top-8">
        {/* Main Navigation */}
        <div className="mb-6">
          <h3 className="text-gray-900 mb-3 px-2">Menu</h3>
          <nav className="space-y-1">
            {mainItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeItem === item.id;
              return (
                <button
                  key={item.id}
                  disabled
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 cursor-not-allowed opacity-60"
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Categories */}
        <div>
          <h3 className="text-gray-900 mb-3 px-2">Chủ đề</h3>
          <nav className="space-y-1">
            {vnsocialTopics.map((topic, index) => {
              const Icon = getCategoryIcon(index);
              const isActive = activeItem === topic.id;
              const color = getCategoryColor(topic.name);

              return (
                <button
                  key={topic.id}
                  onClick={() => onItemClick(topic.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all border-l-4 ${
                    isActive
                      ? "bg-blue-50 border-blue-500 text-blue-900"
                      : "text-gray-900 hover:bg-gray-50 border-transparent"
                  }`}
                >
                  <Icon
                    className="w-5 h-5 flex-shrink-0"
                    style={{ color: isActive ? "#3B82F6" : color }}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  <span
                    className={`${isActive ? "font-semibold" : "font-medium"}`}
                  >
                    {topic.name}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Quick Stats */}
        <div className="mt-6 pt-6 border-t border-[var(--gopass-border)]">
          <div className="text-sm space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Tổng bài viết</span>
              <span className="text-gray-600">{totalArticles}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Chủ đề</span>
              <span className="text-gray-600">{vnsocialTopics.length}</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
