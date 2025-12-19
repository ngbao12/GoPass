"use client";

import React from "react";
// Thay đổi import này:
// import { Link } from "react-router-dom"; 
import Link from "next/link"; // Sửa thành này
import { TrendingUp, MessageCircle, ThumbsUp } from "lucide-react";

interface TopicCardProps {
  id: number;
  headline: string;
  excerpt: string;
  source: string;
  timeAgo: string;
  likes: number;
  comments: number;
  category: string;
  categoryColor: string;
  isTrending: boolean;
  onClick?: (id: number) => void;
}

export const TopicCard: React.FC<TopicCardProps> = ({
  id,
  headline,
  excerpt,
  source,
  timeAgo,
  likes,
  comments,
  category,
  categoryColor,
  isTrending,
  onClick,
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick(id);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all cursor-pointer group"
    >
      <div className="flex items-start gap-4">
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 mb-3">
            <span
              className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-white"
              style={{ backgroundColor: categoryColor }}
            >
              {category}
            </span>
            {isTrending && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-600 rounded-full text-xs font-medium">
                <TrendingUp className="w-3 h-3" />
                Trending
              </span>
            )}
            <span className="text-sm text-gray-500">{timeAgo}</span>
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-teal-600 transition-colors line-clamp-2">
            {headline}
          </h3>

          {/* Excerpt */}
          <p className="text-gray-600 mb-4 line-clamp-2">{excerpt}</p>

        </div>
      </div>
    </div>
  );
};