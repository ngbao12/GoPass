"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { CommentBubble } from "@/features/dashboard/components/student/forum/components/CommentBubble";
import { RelatedTopicsWidget } from "@/features/dashboard/components/student/forum/components/RelatedTopicsWidget";
import { ForumService } from "@/services/forum/forum.service";
import { ForumPost, ForumComment, RelatedExam } from "@/features/dashboard/types/forum";
import {
    ArrowLeft,
    Share2,
    Bookmark,
    ThumbsUp,
    MessageCircle,
    Eye,
    BookOpen,
    Clock,
    FileText,
    ArrowRight,
    Sparkles,
    Plus,
    Send,
} from "lucide-react";

interface DiscussionThread {
    id: string;
    type: "ai-suggestion" | "student-question";
    question: string;
    aiGenerated?: boolean;
    authorName?: string;
    authorAvatar?: string;
    timeAgo?: string;
    comments: ForumComment[];
}

interface ExtendedForumPost extends ForumPost {
    relatedExam?: RelatedExam;
    discussionThreads: DiscussionThread[];
    generalComments: ForumComment[];
}

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export default function ForumPostPage({ params }: PageProps) {
    const [postId, setPostId] = useState<string>("");
    const [posts, setPosts] = useState<ExtendedForumPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedComments, setExpandedComments] = useState<{ [key: number]: boolean }>({});
    const [expandedThreads, setExpandedThreads] = useState<{ [key: string]: boolean }>({});
    const [showNewQuestion, setShowNewQuestion] = useState<{ [key: number]: boolean }>({});
    const [newQuestionText, setNewQuestionText] = useState<{ [key: number]: string }>({});
    const [postLikes, setPostLikes] = useState<{ [key: number]: boolean }>({});
    const [postBookmarks, setPostBookmarks] = useState<{ [key: number]: boolean }>({});

    // Resolve params
    useEffect(() => {
        const resolveParams = async () => {
            const resolvedParams = await params;
            setPostId(resolvedParams.id);
        };
        resolveParams();
    }, [params]);

    // Fetch posts data
    useEffect(() => {
        const fetchPostsData = async () => {
            if (!postId) return;

            setLoading(true);
            try {
                // Fetch multiple posts (fetch first post and additional posts)
                const [post, postComments, exam] = await Promise.all([
                    ForumService.getPostById(postId),
                    ForumService.getCommentsByPostId(parseInt(postId)),
                    ForumService.getRelatedExam(parseInt(postId))
                ]);

                if (!post) {
                    setLoading(false);
                    return;
                }

                // Create extended posts array with multiple posts
                const extendedPosts: ExtendedForumPost[] = [];

                // First post with discussion threads
                const discussionThreads1: DiscussionThread[] = [
                    {
                        id: `ai-${post.id}-1`,
                        type: "ai-suggestion",
                        question: "Trách nhiệm pháp lý của người nổi tiếng khác gì với người bình thường?",
                        aiGenerated: true,
                        comments: postComments.slice(0, 2) || [],
                    },
                    {
                        id: `ai-${post.id}-2`,
                        type: "ai-suggestion",
                        question: "Làm thế nào để cân bằng giữa tự do cá nhân và trách nhiệm xã hội?",
                        aiGenerated: true,
                        comments: postComments.slice(2, 3) || [],
                    },
                ];

                extendedPosts.push({
                    ...post,
                    relatedExam: exam || undefined,
                    discussionThreads: discussionThreads1,
                    generalComments: postComments.slice(3) || [],
                });

                // Add second post
                extendedPosts.push({
                    id: 2,
                    title: "AI có thể thay thế giáo viên không? Quan điểm từ nghiên cứu mới nhất",
                    content: [
                        "Công nghệ AI đang phát triển nhanh chóng trong lĩnh vực giáo dục. Tuy nhiên, nghiên cứu mới nhất cho thấy vai trò của con người trong giáo dục vẫn không thể thay thế hoàn toàn.",
                        "Các chuyên gia cho rằng AI chỉ nên được sử dụng như một công cụ hỗ trợ, không phải thay thế hoàn toàn giáo viên trong việc truyền đạt kiến thức và định hướng phát triển cho học sinh."
                    ],
                    excerpt: "Công nghệ AI đang phát triển nhanh chóng, nhưng vai trò của con người trong giáo dục vẫn không thể thay thế.",
                    category: "Khoa học",
                    categoryColor: "#10B981",
                    source: "VnSocial",
                    sourceUrl: "https://vnsocial.vn/article/2",
                    timeAgo: "4 giờ trước",
                    views: 1892,
                    likes: 278,
                    discussionPostsCount: 4,
                    commentsCount: 189,
                    isTrending: true,
                    createdAt: "2025-12-18T08:00:00Z",
                    updatedAt: "2025-12-18T08:00:00Z",
                    tags: ["AI", "giáo dục", "công nghệ"],
                    relatedExamId: "exam_2",
                    relatedExam: {
                        id: "exam_2",
                        articleId: 2,
                        examId: "exam_2",
                        title: "Luyện thi THPT Quốc gia - Môn Tin học",
                        subject: "Tin học",
                        duration: 50,
                        questionCount: 40,
                        relevanceScore: 88,
                    },
                    discussionThreads: [
                        {
                            id: "ai-2-1",
                            type: "ai-suggestion",
                            question: "AI có thể thay thế được cảm xúc và sự đồng cảm của giáo viên không?",
                            aiGenerated: true,
                            comments: postComments.slice(0, 1) || [],
                        },
                    ],
                    generalComments: [],
                });

                // Add third post
                extendedPosts.push({
                    id: 3,
                    title: "Văn học Việt Nam trong thời đại số: Cơ hội hay thách thức?",
                    content: [
                        "Sự phát triển của mạng xã hội và nền tảng số đang thay đổi cách chúng ta tiếp cận và sáng tạo văn học. Nhiều tác giả trẻ đã tìm được tiếng nói của mình qua các nền tảng trực tuyến.",
                        "Tuy nhiên, điều này cũng đặt ra câu hỏi về chất lượng và giá trị văn học trong bối cảnh số hóa. Làm thế nào để cân bằng giữa sự phổ biến và giá trị nghệ thuật?"
                    ],
                    excerpt: "Sự phát triển của mạng xã hội và nền tảng số đang thay đổi cách chúng ta tiếp cận và sáng tạo văn học.",
                    category: "Văn hóa",
                    categoryColor: "#8B5CF6",
                    source: "VnSocial",
                    sourceUrl: "https://vnsocial.vn/article/3",
                    timeAgo: "5 giờ trước",
                    views: 1567,
                    likes: 234,
                    discussionPostsCount: 3,
                    commentsCount: 156,
                    isTrending: false,
                    createdAt: "2025-12-18T07:00:00Z",
                    updatedAt: "2025-12-18T07:00:00Z",
                    tags: ["văn học", "số hóa", "sáng tạo"],
                    relatedExamId: "exam_3",
                    relatedExam: {
                        id: "exam_3",
                        articleId: 3,
                        examId: "exam_3",
                        title: "Luyện thi THPT Quốc gia - Môn Ngữ văn",
                        subject: "Ngữ văn",
                        duration: 90,
                        questionCount: 50,
                        relevanceScore: 92,
                    },
                    discussionThreads: [],
                    generalComments: postComments.slice(0, 1) || [],
                });

                setPosts(extendedPosts);
            } catch (error) {
                console.error('Error fetching post data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPostsData();
    }, [postId]);

    const toggleComments = (postId: number) => {
        setExpandedComments((prev) => ({
            ...prev,
            [postId]: !prev[postId],
        }));
    };

    const toggleThread = (threadId: string) => {
        setExpandedThreads((prev) => ({
            ...prev,
            [threadId]: !prev[threadId],
        }));
    };

    const toggleLike = (postId: number) => {
        setPostLikes((prev) => ({
            ...prev,
            [postId]: !prev[postId],
        }));
    };

    const toggleBookmark = (postId: number) => {
        setPostBookmarks((prev) => ({
            ...prev,
            [postId]: !prev[postId],
        }));
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

    if (!posts.length) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600">Không tìm thấy bài viết</p>
                    <Link
                        href="/dashboard"
                        className="mt-4 inline-flex items-center gap-2 text-teal-600 hover:text-teal-700"
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
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Back Button */}
                <Link
                    href="/dashboard"
                    className="flex items-center gap-2 text-gray-600 hover:text-teal-600 transition-colors mb-6"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Quay lại diễn đàn</span>
                </Link>

                <div className="flex gap-8">
                    {/* Main Content - Posts Feed */}
                    <div className="flex-1 min-w-0 space-y-6">
                        {posts.map((post) => (
                            <div key={post.id}>
                                {/* Post Card */}
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                    {/* Post Header */}
                                    <div className="p-6 pb-4">
                                        <div className="flex items-center gap-2 mb-4">
                                            <span
                                                className="inline-block px-3 py-1 rounded text-sm font-medium text-white"
                                                style={{ backgroundColor: post.categoryColor }}
                                            >
                                                {post.category}
                                            </span>
                                            <span className="text-sm text-gray-500">
                                                {post.source} • {post.timeAgo}
                                            </span>
                                        </div>

                                        {/* Post Title */}
                                        <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                            {post.title}
                                        </h2>

                                        {/* Post Content */}
                                        <div className="space-y-3 mb-4">
                                            {post.content.map((paragraph, idx) => (
                                                <p key={idx} className="text-gray-600 leading-relaxed">
                                                    {paragraph}
                                                </p>
                                            ))}
                                        </div>

                                        {/* Related Exam Link */}
                                        {post.relatedExam && (
                                            <div className="mt-4 p-4 bg-gradient-to-r from-teal-50 to-transparent border-l-4 border-teal-600 rounded">
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <BookOpen className="w-4 h-4 text-teal-600" />
                                                            <span className="text-xs font-semibold text-teal-600 uppercase">
                                                                Liên quan {post.relatedExam.relevanceScore}%
                                                            </span>
                                                        </div>
                                                        <h4 className="text-sm font-semibold text-gray-900 mb-2">
                                                            {post.relatedExam.title}
                                                        </h4>
                                                        <div className="flex items-center gap-4 text-xs text-gray-500">
                                                            <div className="flex items-center gap-1">
                                                                <Clock className="w-3 h-3" />
                                                                <span>{post.relatedExam.duration} phút</span>
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                <FileText className="w-3 h-3" />
                                                                <span>{post.relatedExam.questionCount} câu hỏi</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <button className="flex items-center gap-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium whitespace-nowrap">
                                                        <span>Làm bài ngay</span>
                                                        <ArrowRight className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Combined Stats & Action Buttons */}
                                    <div className="border-t border-gray-200">
                                        {/* Action Buttons */}
                                        <div className="px-6 py-3 flex space-x-4">
                                            <button
                                                onClick={() => toggleLike(post.id)}
                                                className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-colors min-w-[140px] ${
                                                    postLikes[post.id]
                                                        ? "bg-teal-600 text-white"
                                                        : "bg-gray-50 text-gray-700 hover:bg-gray-200"
                                                }`}
                                            >
                                                <ThumbsUp className="w-5 h-5" />
                                                <span>{post.likes}</span>
                                            </button>
                                            <button
                                                onClick={() => toggleComments(post.id)}
                                                className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-medium bg-gray-50 text-gray-700 hover:bg-gray-200 transition-colors min-w-[140px]"
                                            >
                                                <MessageCircle className="w-5 h-5" />
                                                <span>
                                                    {post.discussionThreads.reduce(
                                                        (acc, thread) => acc + thread.comments.length,
                                                        post.generalComments.length
                                                    )}
                                                </span>
                                            </button>
                                            <button
                                                onClick={() => toggleBookmark(post.id)}
                                                className={`flex items-center justify-center px-4 py-2.5 rounded-lg font-medium transition-colors ${
                                                    postBookmarks[post.id]
                                                        ? "bg-teal-600 text-white"
                                                        : "bg-gray-50 text-gray-700 hover:bg-gray-200"
                                                }`}
                                            >
                                                <Bookmark className="w-5 h-5" />
                                            </button>
                                            <button className="flex items-center justify-center px-4 py-2.5 rounded-lg font-medium bg-gray-50 text-gray-700 hover:bg-gray-200 transition-colors">
                                                <Share2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Comments Section - Collapsible */}
                                    {expandedComments[post.id] && (
                                        <div className="border-t border-gray-200 bg-gray-50 p-6 space-y-6">
                                            {/* Discussion Threads */}
                                            {post.discussionThreads.length > 0 && (
                                                <div className="space-y-4">
                                                    <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                                                        <MessageCircle className="w-5 h-5 text-teal-600" />
                                                        Câu hỏi thảo luận ({post.discussionThreads.length})
                                                    </h3>

                                                    {post.discussionThreads.map((thread) => (
                                                        <div
                                                            key={thread.id}
                                                            className="bg-white rounded-lg border border-gray-200 overflow-hidden"
                                                        >
                                                            {/* Thread Header */}
                                                            <div
                                                                className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                                                                    thread.type === "ai-suggestion"
                                                                        ? "bg-gradient-to-r from-purple-50 to-transparent border-l-4 border-purple-500"
                                                                        : "border-l-4 border-blue-500"
                                                                }`}
                                                                onClick={() => toggleThread(thread.id)}
                                                            >
                                                                <div className="flex items-start gap-3">
                                                                    {thread.type === "ai-suggestion" ? (
                                                                        <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                                            <Sparkles className="w-4 h-4 text-white" />
                                                                        </div>
                                                                    ) : (
                                                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white flex-shrink-0 mt-0.5">
                                                                            {thread.authorName?.charAt(0) || "U"}
                                                                        </div>
                                                                    )}
                                                                    <div className="flex-1 min-w-0">
                                                                        <div className="flex items-center gap-2 mb-1">
                                                                            {thread.type === "ai-suggestion" ? (
                                                                                <span className="text-xs font-semibold text-purple-600 uppercase">
                                                                                    AI Suggestion
                                                                                </span>
                                                                            ) : (
                                                                                <>
                                                                                    <span className="text-sm font-medium text-gray-900">
                                                                                        {thread.authorName}
                                                                                    </span>
                                                                                    <span className="text-xs text-gray-500">
                                                                                        • {thread.timeAgo}
                                                                                    </span>
                                                                                </>
                                                                            )}
                                                                        </div>
                                                                        <p className="text-sm font-medium text-gray-900">
                                                                            {thread.question}
                                                                        </p>
                                                                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                                                            <span>{thread.comments.length} câu trả lời</span>
                                                                            <span>•</span>
                                                                            <span>
                                                                                {expandedThreads[thread.id] ? "Thu gọn" : "Xem thảo luận"}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Thread Comments */}
                                                            {expandedThreads[thread.id] && (
                                                                <div className="p-4 bg-gray-50 space-y-3 border-t border-gray-200">
                                                                    <div className="pt-3">
                                                                        <div className="flex gap-3">
                                                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white flex-shrink-0">
                                                                                BN
                                                                            </div>
                                                                            <div className="flex-1 relative">
                                                                                <textarea
                                                                                    placeholder="Chia sẻ ý kiến của bạn..."
                                                                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                                                                                    rows={2}
                                                                                />
                                                                                <button className="absolute bottom-2 right-2 p-2 text-teal-600 hover:bg-teal-600 hover:text-white rounded-lg transition-colors">
                                                                                    <Send className="w-4 h-4" />
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    {thread.comments.map((comment, idx) => (
                                                                        <CommentBubble key={idx} {...comment} />
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Add New Discussion Question */}
                                            <div className="border-t border-gray-200 pt-4">
                                                {!showNewQuestion[post.id] ? (
                                                    <button
                                                        onClick={() =>
                                                            setShowNewQuestion((prev) => ({
                                                                ...prev,
                                                                [post.id]: true,
                                                            }))
                                                        }
                                                        className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-200 rounded-lg text-gray-500 hover:border-teal-600 hover:text-teal-600 transition-colors"
                                                    >
                                                        <Plus className="w-5 h-5" />
                                                        <span className="font-medium">Đặt câu hỏi thảo luận mới</span>
                                                    </button>
                                                ) : (
                                                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                                                        <div className="flex gap-3 mb-3">
                                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white flex-shrink-0">
                                                                BN
                                                            </div>
                                                            <div className="flex-1">
                                                                <p className="text-sm font-medium text-gray-900 mb-2">
                                                                    Đặt câu hỏi của bạn
                                                                </p>
                                                                <textarea
                                                                    value={newQuestionText[post.id] || ""}
                                                                    onChange={(e) =>
                                                                        setNewQuestionText((prev) => ({
                                                                            ...prev,
                                                                            [post.id]: e.target.value,
                                                                        }))
                                                                    }
                                                                    placeholder="Ví dụ: Các bạn nghĩ sao về..."
                                                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                                                                    rows={3}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="flex justify-end gap-2">
                                                            <button
                                                                onClick={() =>
                                                                    setShowNewQuestion((prev) => ({
                                                                        ...prev,
                                                                        [post.id]: false,
                                                                    }))
                                                                }
                                                                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                                            >
                                                                Hủy
                                                            </button>
                                                            <button className="px-4 py-2 text-sm font-medium bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
                                                                Đăng câu hỏi
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {/* Load More Button */}
                        <div className="text-center py-6">
                            <button className="px-8 py-3 border border-gray-200 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors font-medium">
                                Xem thêm bài viết
                            </button>
                        </div>
                    </div>

                    {/* Right Sidebar */}
                    <div className="w-80 flex-shrink-0">
                        <div className="sticky top-8 space-y-6">
                            <RelatedTopicsWidget />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}