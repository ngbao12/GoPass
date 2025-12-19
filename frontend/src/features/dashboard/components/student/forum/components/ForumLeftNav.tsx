import React from "react";
import {
  Flame,
  Sparkles,
  List,
  Newspaper,
  Microscope,
  Palette,
} from "lucide-react";

interface ForumLeftNavProps {
  activeItem: string;
  onItemClick: (item: string) => void;
}

export function ForumLeftNav({ activeItem, onItemClick }: ForumLeftNavProps) {
  const mainItems = [
    { id: "all", label: "Tất cả chủ đề", icon: List },
    { id: "trending", label: "Đang Hot", icon: Flame, highlight: true },
    { id: "for-you", label: "Dành cho bạn", icon: Sparkles },
  ];

  const categories = [
    { id: "social", label: "Xã hội", icon: Newspaper, color: "#3B82F6" },
    { id: "science", label: "Khoa học", icon: Microscope, color: "#10B981" },
    { id: "culture", label: "Văn hóa", icon: Palette, color: "#8B5CF6" },
  ];

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
                  onClick={() => onItemClick(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${isActive
                    ? "bg-[var(--gopass-primary)] text-white"
                    : item.highlight
                      ? "text-orange-600 hover:bg-orange-50"
                      : "text-gray-900 hover:bg-gray-50"
                    }`}
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
            {categories.map((category) => {
              const Icon = category.icon;
              const isActive = activeItem === category.id;
              return (
                <button
                  key={category.id}
                  onClick={() => onItemClick(category.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${isActive
                    ? "bg-[var(--gopass-primary)] text-white"
                    : "text-gray-900 hover:bg-gray-50"
                    }`}
                >
                  <Icon
                    className="w-5 h-5"
                    style={{ color: isActive ? "white" : category.color }}
                  />
                  <span>{category.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Quick Stats */}
        <div className="mt-6 pt-6 border-t border-[var(--gopass-border)]">
          <div className="text-sm space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Chủ đề hôm nay</span>
              <span className="text-gray-600">24</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Thành viên online</span>
              <span className="text-gray-600">1,234</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}