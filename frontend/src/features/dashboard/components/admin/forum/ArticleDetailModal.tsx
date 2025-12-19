"use client";

import React, { useState, useEffect } from "react";
import { ForumArticle, ForumDiscussionPost } from "@/features/dashboard/types/forum";
import { X, Sparkles, Plus, Trash2, Eye, MessageCircle, Edit } from "lucide-react";
import { ForumService } from "@/services/forum/forum.service";

// Mock discussion posts data
const MOCK_DISCUSSIONS: { [key: number]: ForumDiscussionPost[] } = {
  1: [
    {
      id: "disc_1_1",
      articleId: 1,
      type: "ai-generated",
      question: "Trách nhiệm pháp lý của người nổi tiếng khác gì với người bình thường?",
      description: "Hãy thảo luận về sự khác biệt trong trách nhiệm pháp lý giữa người nổi tiếng và người bình thường.",
      commentsCount: 45,
      likes: 89,
      createdAt: "2025-12-19T10:05:00Z",
      generatedBy: "ai"
    },
    {
      id: "disc_1_2",
      articleId: 1,
      type: "ai-generated",
      question: "Làm thế nào để cân bằng giữa tự do cá nhân và trách nhiệm xã hội?",
      description: "Thảo luận về ranh giới giữa quyền tự do cá nhân và trách nhiệm đối với xã hội.",
      commentsCount: 38,
      likes: 72,
      createdAt: "2025-12-19T10:06:00Z",
      generatedBy: "ai"
    },
    {
      id: "disc_1_3",
      articleId: 1,
      type: "ai-generated",
      question: "Vai trò của truyền thông trong việc định hình hình ảnh người nổi tiếng?",
      description: "Phân tích ảnh hưởng của truyền thông đến hình ảnh công chúng của người nổi tiếng.",
      commentsCount: 52,
      likes: 95,
      createdAt: "2025-12-19T10:07:00Z",
      generatedBy: "ai"
    }
  ],
  2: [
    {
      id: "disc_2_1",
      articleId: 2,
      type: "ai-generated",
      question: "AI có thể thay thế được cảm xúc và sự đồng cảm của giáo viên không?",
      description: "Thảo luận về khả năng AI trong việc cung cấp sự đồng cảm và kết nối cảm xúc.",
      commentsCount: 67,
      likes: 124,
      createdAt: "2025-12-19T08:05:00Z",
      generatedBy: "ai"
    },
    {
      id: "disc_2_2",
      articleId: 2,
      type: "ai-generated",
      question: "Học sinh có thể phát triển kỹ năng mềm như thế nào nếu học với AI?",
      description: "Phân tích những kỹ năng mềm mà học sinh có thể bỏ lỡ khi học với AI.",
      commentsCount: 43,
      likes: 86,
      createdAt: "2025-12-19T08:06:00Z",
      generatedBy: "ai"
    },
    {
      id: "disc_2_3",
      articleId: 2,
      type: "ai-generated",
      question: "AI có giúp cá nhân hóa việc học tốt hơn giáo viên không?",
      description: "So sánh khả năng cá nhân hóa giữa AI và giáo viên truyền thống.",
      commentsCount: 39,
      likes: 71,
      createdAt: "2025-12-19T08:07:00Z",
      generatedBy: "ai"
    },
    {
      id: "disc_2_4",
      articleId: 2,
      type: "student-created",
      question: "Các bạn đã từng học với AI chưa? Cảm nhận thế nào?",
      description: "Chia sẻ trải nghiệm thực tế của bạn về việc học với AI.",
      commentsCount: 78,
      likes: 145,
      createdAt: "2025-12-19T09:00:00Z",
      createdBy: "u_student_03",
      authorName: "Trần Văn Cường",
      authorAvatar: "https://i.pravatar.cc/150?u=student-03"
    }
  ],
  3: [
    {
      id: "disc_3_1",
      articleId: 3,
      type: "ai-generated",
      question: "Văn học số có làm giảm chất lượng văn học truyền thống?",
      description: "Thảo luận về ảnh hưởng của số hóa đến chất lượng văn học.",
      commentsCount: 34,
      likes: 62,
      createdAt: "2025-12-19T07:05:00Z",
      generatedBy: "ai"
    },
    {
      id: "disc_3_2",
      articleId: 3,
      type: "ai-generated",
      question: "Nền tảng số có tạo cơ hội công bằng cho các tác giả trẻ?",
      description: "Phân tích cơ hội mà nền tảng số mang lại cho thế hệ tác giả mới.",
      commentsCount: 28,
      likes: 55,
      createdAt: "2025-12-19T07:06:00Z",
      generatedBy: "ai"
    },
    {
      id: "disc_3_3",
      articleId: 3,
      type: "ai-generated",
      question: "Làm thế nào để bảo vệ quyền tác giả trong thời đại số?",
      description: "Thảo luận về các biện pháp bảo vệ quyền sở hữu trí tuệ.",
      commentsCount: 31,
      likes: 58,
      createdAt: "2025-12-19T07:07:00Z",
      generatedBy: "ai"
    }
  ],
  4: [
    {
      id: "disc_4_1",
      articleId: 4,
      type: "ai-generated",
      question: "Giải pháp nào hiệu quả nhất để giảm thiểu tác động biến đổi khí hậu?",
      description: "Đánh giá các giải pháp khác nhau và tính khả thi của chúng.",
      commentsCount: 25,
      likes: 48,
      createdAt: "2025-12-18T12:05:00Z",
      generatedBy: "ai"
    },
    {
      id: "disc_4_2",
      articleId: 4,
      type: "ai-generated",
      question: "Vai trò của cộng đồng trong ứng phó biến đổi khí hậu?",
      description: "Thảo luận về sự tham gia của người dân trong các giải pháp môi trường.",
      commentsCount: 22,
      likes: 41,
      createdAt: "2025-12-18T12:06:00Z",
      generatedBy: "ai"
    },
    {
      id: "disc_4_3",
      articleId: 4,
      type: "ai-generated",
      question: "Công nghệ xanh có thể giải quyết vấn đề khí hậu không?",
      description: "Phân tích tiềm năng của công nghệ trong việc chống biến đổi khí hậu.",
      commentsCount: 19,
      likes: 37,
      createdAt: "2025-12-18T12:07:00Z",
      generatedBy: "ai"
    },
    {
      id: "disc_4_4",
      articleId: 4,
      type: "student-created",
      question: "Mình có thể làm gì để góp phần bảo vệ môi trường?",
      description: "Chia sẻ các hành động cụ thể mà mỗi người có thể thực hiện.",
      commentsCount: 29,
      likes: 52,
      createdAt: "2025-12-18T13:00:00Z",
      createdBy: "u_student_05",
      authorName: "Hoàng Thị Lan",
      authorAvatar: "https://i.pravatar.cc/150?u=student-05"
    }
  ],
  5: [
    {
      id: "disc_5_1",
      articleId: 5,
      type: "ai-generated",
      question: "Việt Nam có thể học được gì từ mô hình giáo dục Singapore?",
      description: "So sánh và rút ra bài học từ hệ thống giáo dục Singapore.",
      commentsCount: 21,
      likes: 39,
      createdAt: "2025-12-17T14:05:00Z",
      generatedBy: "ai"
    },
    {
      id: "disc_5_2",
      articleId: 5,
      type: "ai-generated",
      question: "Thách thức lớn nhất trong chuyển đổi số giáo dục là gì?",
      description: "Thảo luận về các rào cản và cách vượt qua chúng.",
      commentsCount: 18,
      likes: 35,
      createdAt: "2025-12-17T14:06:00Z",
      generatedBy: "ai"
    },
    {
      id: "disc_5_3",
      articleId: 5,
      type: "ai-generated",
      question: "Làm sao để đào tạo giáo viên sử dụng công nghệ hiệu quả?",
      description: "Đề xuất các chương trình đào tạo và hỗ trợ giáo viên.",
      commentsCount: 16,
      likes: 31,
      createdAt: "2025-12-17T14:07:00Z",
      generatedBy: "ai"
    }
  ]
};

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
  const [discussionPosts, setDiscussionPosts] = useState<ForumDiscussionPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchDiscussionPosts();
  }, [article.id]);

  const fetchDiscussionPosts = async () => {
    setLoading(true);
    try {
      // Use mock data for now
      // const posts = await ForumService.getDiscussionPostsByArticleId(article.id);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      const mockPosts = MOCK_DISCUSSIONS[article.id] || [];
      setDiscussionPosts(mockPosts);
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
      await new Promise(resolve => setTimeout(resolve, 2000));
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
      setDiscussionPosts(discussionPosts.filter(d => d.id !== discussionId));
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
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Nội dung bài viết</h3>
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
                          <span className="text-xs text-gray-500 font-medium">#{index + 1}</span>
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
                <span className="font-medium text-gray-900">{article.views.toLocaleString()}</span> lượt xem
              </div>
              <div>
                <span className="font-medium text-gray-900">{article.likes}</span> lượt thích
              </div>
              <div>
                <span className="font-medium text-gray-900">{article.commentsCount}</span> bình luận
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
