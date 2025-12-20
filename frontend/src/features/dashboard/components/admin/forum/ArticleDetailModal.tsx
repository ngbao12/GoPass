"use client";

import React, { useState, useEffect } from "react";
import {
  ForumArticle,
  ForumDiscussionPost,
} from "@/features/dashboard/types/forum";
import {
  X,
  Sparkles,
  Plus,
  Trash2,
  Eye,
  MessageCircle,
  Edit,
} from "lucide-react";
import { ForumService } from "@/services/forum/forum.service";

interface ArticleDetailModalProps {
  article: ForumArticle;
  onClose: () => void;
  onRefresh: () => void;
}

const ArticleDetailModal: React.FC<ArticleDetailModalProps> = ({
  article,
  onClose,
  onRefresh,
}) => {
  const [discussionPosts, setDiscussionPosts] = useState<ForumDiscussionPost[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchDiscussionPosts();
  }, [article.id]);

  const fetchDiscussionPosts = async () => {
    setLoading(true);
    try {
      const posts = await ForumService.getDiscussionPostsByArticleId(
        article.id
      );
      setDiscussionPosts(posts);
    } catch (error) {
      console.error("Error fetching discussion posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateDiscussions = async () => {
    setGenerating(true);
    try {
      // Simulate AI generation
      await new Promise((resolve) => setTimeout(resolve, 2000));
      // TODO: Call API to generate discussion posts
      alert("Tạo thành công 3 chủ đề thảo luận mới!");
      fetchDiscussionPosts();
    } catch (error) {
      console.error("Error generating discussions:", error);
    } finally {
      setGenerating(false);
    }
  };

  const handleDeleteDiscussion = async (discussionId: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa chủ đề thảo luận này?")) {
      // TODO: Implement delete API
      setDiscussionPosts(discussionPosts.filter((d) => d.id !== discussionId));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-start justify-between">
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
                <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs font-medium">
                  VnSocial
                </span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {article.title}
              </h2>
              <p className="text-gray-600">{article.excerpt}</p>
            </div>
            <button
              onClick={onClose}
              className="ml-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Article Content */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Nội dung bài viết
            </h3>
            <div className="space-y-2 text-gray-700">
              {article.content.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>

          {/* Discussion Posts Section */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Chủ đề thảo luận AI ({discussionPosts.length})
              </h3>
              <button
                onClick={handleGenerateDiscussions}
                disabled={generating}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-md hover:shadow-lg"
              >
                <Sparkles className="w-4 h-4" />
                {generating ? "Đang tạo..." : "Tạo thêm thảo luận"}
              </button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : discussionPosts.length > 0 ? (
              <div className="space-y-3">
                {discussionPosts.map((discussion, index) => (
                  <div
                    key={discussion.id}
                    className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {discussion.type === "ai-generated" ? (
                            <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded text-xs font-semibold flex items-center gap-1 border border-indigo-200">
                              <Sparkles className="w-3 h-3" />
                              AI
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-xs font-semibold border border-emerald-200">
                              Học sinh
                            </span>
                          )}
                          <span className="text-xs text-gray-500 font-medium">
                            #{index + 1}
                          </span>
                        </div>
                        <h4 className="font-medium text-gray-900 mb-1">
                          {discussion.question}
                        </h4>
                        <p className="text-sm text-gray-600 mb-3">
                          {discussion.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <MessageCircle className="w-4 h-4" />
                            {discussion.commentsCount} bình luận
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {discussion.likes} lượt thích
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteDiscussion(discussion.id)}
                        className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 mb-2">Chưa có chủ đề thảo luận</p>
                <p className="text-sm text-gray-500 mb-4">
                  Tạo chủ đề thảo luận để học sinh có thể bình luận
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div>
                <span className="font-medium text-gray-900">
                  {article.views.toLocaleString()}
                </span>{" "}
                lượt xem
              </div>
              <div>
                <span className="font-medium text-gray-900">
                  {article.likes}
                </span>{" "}
                lượt thích
              </div>
              <div>
                <span className="font-medium text-gray-900">
                  {article.commentsCount}
                </span>{" "}
                bình luận
              </div>
            </div>
            <a
              href={article.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              Xem trên VnSocial →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetailModal;
