"use client";

import React from "react";
import { ForumArticle } from "@/features/dashboard/types/forum";
import {
  Eye,
  Trash2,
  TrendingUp,
  MessageCircle,
  ThumbsUp,
  Sparkles,
} from "lucide-react";

interface ArticleCardProps {
  article: ForumArticle;
  onView: () => void;
  onDelete: () => void;
}

const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  onView,
  onDelete,
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md hover:border-gray-300 transition-all group">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
            {article.title}
          </h3>
        </div>
      </div>

      {/* Excerpt */}
      <p className="text-gray-600 text-sm line-clamp-2 mb-4">
        {article.excerpt}
      </p>

      {/* Meta */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs font-medium">
            VnSocial
          </span>
          <span>•</span>
          <span>{article.timeAgo}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={onView}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-sm hover:shadow"
        >
          <Eye className="w-4 h-4" />
          Xem chi tiết
        </button>
        <button
          onClick={onDelete}
          className="px-4 py-2.5 border-2 border-red-300 text-red-700 rounded-lg hover:bg-red-50 hover:border-red-400 transition-colors font-medium"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ArticleCard;
