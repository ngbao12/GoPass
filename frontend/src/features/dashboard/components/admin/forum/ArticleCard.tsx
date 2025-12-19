"use client";

import React from "react";
import { ForumArticle } from "@/features/dashboard/types/forum";
import { Eye, Trash2, TrendingUp, MessageCircle, ThumbsUp, Sparkles } from "lucide-react";

interface ArticleCardProps {
  article: ForumArticle;
  onView: () => void;
  onDelete: () => void;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, onView, onDelete }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md hover:border-gray-300 transition-all group">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span
              className="px-3 py-1 rounded-full text-xs font-medium"
              style={{
                backgroundColor: `${article.categoryColor}15`,
                color: article.categoryColor,
              }}
            >
              {article.category}
            </span>
            {article.isTrending && (
              <div className="flex items-center gap-1 px-2 py-1 bg-rose-50 text-rose-700 rounded-full text-xs font-semibold border border-rose-200">
                <TrendingUp className="w-3 h-3" />
                Trending
              </div>
            )}
          </div>
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
            {article.title}
          </h3>
        </div>
      </div>

      {/* Excerpt */}
      <p className="text-gray-600 text-sm line-clamp-2 mb-4">{article.excerpt}</p>

      {/* Stats */}
      <div className="flex items-center gap-4 text-sm text-gray-600 mb-4 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-1">
          <Eye className="w-4 h-4" />
          {article.views.toLocaleString()}
        </div>
        <div className="flex items-center gap-1">
          <ThumbsUp className="w-4 h-4" />
          {article.likes}
        </div>
        <div className="flex items-center gap-1">
          <MessageCircle className="w-4 h-4" />
          {article.commentsCount}
        </div>
        <div className="flex items-center gap-1">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span className="text-indigo-700 font-semibold">
            {article.discussionPostsCount} thảo luận
          </span>
        </div>
      </div>

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
