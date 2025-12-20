"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ForumService } from "@/services/forum/forum.service";
import {
  ForumArticle,
  ForumTopic,
  ForumComment,
} from "@/features/dashboard/types/forum";
import {
  ArrowLeft,
  Share2,
  Bookmark,
  ThumbsUp,
  MessageCircle,
  Eye,
  Clock,
  Send,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ArticleDetailPage({ params }: PageProps) {
  const [articleId, setArticleId] = useState<string>("");
  const [article, setArticle] = useState<ForumArticle | null>(null);
  const [forumTopics, setForumTopics] = useState<ForumTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedTopics, setExpandedTopics] = useState<{
    [key: string]: boolean;
  }>({});
  const [topicLikes, setTopicLikes] = useState<{ [key: string]: boolean }>({});
  const [newComments, setNewComments] = useState<{ [key: string]: string }>({});

  // Resolve params
  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      setArticleId(resolvedParams.id);
    };
    resolveParams();
  }, [params]);

  // Fetch article and topics data
  useEffect(() => {
    const fetchData = async () => {
      if (!articleId) return;

      setLoading(true);
      try {
        // Fetch article by ID (this is actually a ForumPackage)
        const articleData = await ForumService.getArticleById(articleId);
        setArticle(articleData);
        console.log("Fetched article data:", articleData);

        // Fetch forum topics for this package
        const topics = await ForumService.getTopicsByPackageId(articleId);
        setForumTopics(topics);
      } catch (error) {
        console.error("Error fetching article data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [articleId]);

  const toggleTopic = (topicId: string) => {
    setExpandedTopics((prev) => ({
      ...prev,
      [topicId]: !prev[topicId],
    }));
  };

  const toggleTopicLike = async (topicId: string) => {
    try {
      if (topicLikes[topicId]) {
        await ForumService.unlikeTopic(topicId);
      } else {
        await ForumService.likeTopic(topicId);
      }
      setTopicLikes((prev) => ({
        ...prev,
        [topicId]: !prev[topicId],
      }));

      // Refresh topics to update like count
      const topics = await ForumService.getTopicsByPackageId(articleId);
      setForumTopics(topics);
    } catch (error) {
      console.error("Error toggling topic like:", error);
    }
  };

  const handleSubmitComment = async (topicId: string) => {
    const commentText = newComments[topicId];
    if (!commentText || !commentText.trim()) return;

    try {
      // createComment expects (topicId, content)
      await ForumService.createComment(topicId, commentText);

      // Clear input
      setNewComments((prev) => ({ ...prev, [topicId]: "" }));

      // Refresh topics to get new comment
      const topics = await ForumService.getTopicsByPackageId(articleId);
      setForumTopics(topics);
    } catch (error) {
      console.error("Error submitting comment:", error);
      alert("Không thể gửi bình luận. Vui lòng thử lại.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải bài viết...</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Không tìm thấy bài viết</p>
          <Link
            href="/dashboard/forum"
            className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại diễn đàn
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Back Button */}
        <Link
          href="/dashboard/forum"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-teal-600 transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Quay lại diễn đàn</span>
        </Link>

        {/* Package Header Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <span
                className="inline-block px-3 py-1 rounded text-sm font-medium text-white"
                style={{ backgroundColor: article.categoryColor || "#3B82F6" }}
              >
                {article.category || "Tổng hợp"}
              </span>
              <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs font-medium">
                {article.source || "VnSocial"}
              </span>
              <span className="text-sm text-gray-500">• {article.timeAgo}</span>
            </div>

            {/* Package Title - from ForumPackage.packageTitle */}
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {article.title}
            </h1>

            {/* Package Summary - from ForumPackage.packageSummary */}
            <div className="prose max-w-none">
              <p className="text-lg text-gray-700 leading-relaxed">
                {article.excerpt}
              </p>
            </div>

            {/* Stats */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-1.5">
                  <Eye className="w-4 h-4" />
                  <span>{article.views?.toLocaleString() || 0} lượt xem</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MessageCircle className="w-4 h-4" />
                  <span>{forumTopics.length} chủ đề thảo luận</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ThumbsUp className="w-4 h-4" />
                  <span>
                    {forumTopics.reduce(
                      (sum, t) => sum + (t.stats?.totalLikes || 0),
                      0
                    )}{" "}
                    lượt thích
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Discussion Topics Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-teal-50 to-transparent">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <MessageCircle className="w-6 h-6 text-teal-600" />
              Chủ đề thảo luận ({forumTopics.length})
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Tham gia thảo luận về các khía cạnh khác nhau của bài viết
            </p>
          </div>

          {/* Topics List */}
          <div className="divide-y divide-gray-200">
            {forumTopics.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <Sparkles className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-lg font-medium">
                  Chưa có chủ đề thảo luận nào
                </p>
                <p className="text-sm mt-1">
                  Các chủ đề sẽ được tạo tự động bởi AI
                </p>
              </div>
            ) : (
              forumTopics.map((topic) => (
                <div
                  key={topic._id}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  {/* Topic Header */}
                  <div className="mb-4">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {topic.seedComment && (
                            <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-xs font-medium">
                              🤖 AI Seed
                            </span>
                          )}
                          {topic.essayPrompt && (
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                              ✍️ Gợi ý viết
                            </span>
                          )}
                          <span className="text-xs text-gray-500">
                            {new Date(topic.createdAt).toLocaleDateString(
                              "vi-VN"
                            )}
                          </span>
                        </div>

                        {/* Topic Title */}
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {topic.title}
                        </h3>
                      </div>

                      <button
                        onClick={() => toggleTopic(topic._id)}
                        className="flex items-center gap-1 text-sm text-teal-600 hover:text-teal-700 font-medium transition-colors"
                      >
                        {expandedTopics[topic._id] ? (
                          <>
                            <ChevronUp className="w-4 h-4" />
                            Thu gọn
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-4 h-4" />
                            Xem thảo luận
                          </>
                        )}
                      </button>
                    </div>

                    {/* Seed Comment - Always visible as the starting point */}
                    {topic.seedComment && (
                      <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r mb-3">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-8 h-8 bg-amber-200 rounded-full flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-amber-700" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-amber-900 mb-1">
                              AI Seed Comment
                            </p>
                            <p className="text-sm text-amber-800 leading-relaxed">
                              {topic.seedComment}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Essay Prompt (if exists) */}
                    {topic.essayPrompt && (
                      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r mb-3">
                        <p className="text-sm font-medium text-blue-900 mb-1">
                          💡 Gợi ý viết bài:
                        </p>
                        <p className="text-sm text-blue-800 leading-relaxed">
                          {topic.essayPrompt}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Topic Stats & Actions */}
                  <div className="flex items-center gap-4 mb-4">
                    <button
                      onClick={() => toggleTopicLike(topic._id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        topicLikes[topic._id]
                          ? "bg-teal-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      <ThumbsUp className="w-4 h-4" />
                      <span>{topic.stats?.totalLikes || 0}</span>
                    </button>
                    <div className="flex items-center gap-1.5 text-sm text-gray-600">
                      <MessageCircle className="w-4 h-4" />
                      <span>{topic.stats?.totalComments || 0} bình luận</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-gray-500">
                      <Eye className="w-4 h-4" />
                      <span>{topic.stats?.totalViews || 0} lượt xem</span>
                    </div>
                  </div>

                  {/* Expanded Content - Comments Thread */}
                  {expandedTopics[topic._id] && (
                    <div className="mt-6 space-y-4 pl-4 border-l-2 border-gray-200">
                      {/* Comments placeholder - will show actual comments from backend */}
                      <div className="text-sm text-gray-500 italic py-4">
                        <MessageCircle className="w-5 h-5 inline-block mr-2 text-gray-400" />
                        {topic.stats?.totalComments === 0
                          ? "Chưa có bình luận. Hãy là người đầu tiên chia sẻ ý kiến!"
                          : `${topic.stats?.totalComments} bình luận`}
                      </div>

                      {/* Comment Input */}
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex gap-3">
                          <input
                            type="text"
                            placeholder="Chia sẻ ý kiến của bạn..."
                            value={newComments[topic._id] || ""}
                            onChange={(e) =>
                              setNewComments((prev) => ({
                                ...prev,
                                [topic._id]: e.target.value,
                              }))
                            }
                            onKeyPress={(e) => {
                              if (e.key === "Enter") {
                                handleSubmitComment(topic._id);
                              }
                            }}
                            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                          />
                          <button
                            onClick={() => handleSubmitComment(topic._id)}
                            disabled={!newComments[topic._id]?.trim()}
                            className="px-5 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                          >
                            <Send className="w-4 h-4" />
                            Gửi
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
