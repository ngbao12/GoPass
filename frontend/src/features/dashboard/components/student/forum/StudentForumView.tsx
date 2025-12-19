"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ForumLeftNav } from "./components/ForumLeftNav";
import { TopicCard } from "./components/TopicCard";
import { TopInteractionsWidget } from "./components/TopInteractionsWidget";
import { ForumBanner } from "./components/ForumBanner";
import { ForumService } from "@/services/forum/forum.service";
import { ForumPost, ForumStats } from "@/features/dashboard/types/forum";

const POSTS_PER_PAGE = 3;

const StudentForumView: React.FC = () => {
    const [activeFilter, setActiveFilter] = useState("trending");
    const [forumPosts, setForumPosts] = useState<ForumPost[]>([]);
    const [forumStats, setForumStats] = useState<ForumStats>({
        totalArticles: 0,
        totalDiscussionPosts: 0,
        totalComments: 0,
        activeUsers: 0
    });
    const [displayedPosts, setDisplayedPosts] = useState<ForumPost[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [posts, stats] = await Promise.all([
                    ForumService.getPosts(),
                    ForumService.getStats()
                ]);
                setForumPosts(posts);
                setForumStats(stats);
                // Hiển thị 3 posts đầu tiên
                setDisplayedPosts(posts.slice(0, POSTS_PER_PAGE));
                setCurrentPage(1);
            } catch (error) {
                console.error('Error fetching forum data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleLoadMore = async () => {
        setLoadingMore(true);

        // Simulate loading delay
        setTimeout(() => {
            const nextPage = currentPage + 1;
            const startIndex = (nextPage - 1) * POSTS_PER_PAGE;
            const endIndex = startIndex + POSTS_PER_PAGE;
            const newPosts = forumPosts.slice(startIndex, endIndex);

            setDisplayedPosts(prev => [...prev, ...newPosts]);
            setCurrentPage(nextPage);
            setLoadingMore(false);
        }, 500);
    };

    const hasMorePosts = displayedPosts.length < forumPosts.length;

    const handleTopicClick = (post: ForumPost) => {
        router.push(`/dashboard/forum/post/${post.id}`);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Đang tải diễn đàn...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex gap-8">
                    {/* Left Navigation */}
                    <ForumLeftNav
                        activeItem={activeFilter}
                        onItemClick={setActiveFilter}
                    />

                    {/* Main Content */}
                    <div className="flex-1 min-w-0">
                        {/* Header */}
                        <div className="mb-6">
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                Diễn đàn học tập
                            </h1>
                            <p className="text-gray-600">
                                Kết nối sự kiện thời sự với kiến thức học tập
                            </p>
                        </div>

                        {/* Filter and Sort */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-600">Hiển thị</span>
                                    <span className="text-sm font-medium text-blue-600">
                                        {forumPosts.length} chủ đề
                                    </span>
                                </div>
                                <select className="text-sm border border-gray-200 rounded px-3 py-1.5">
                                    <option>Mới nhất</option>
                                    <option>Phổ biến nhất</option>
                                    <option>Nhiều bình luận nhất</option>
                                </select>
                            </div>
                        </div>

                        {/* Posts */}
                        <div className="space-y-4 mb-6">
                            {displayedPosts.map((post) => (
                                <TopicCard
                                    key={post.id}
                                    id={post.id}
                                    headline={post.title}
                                    excerpt={post.excerpt}
                                    source={post.source}
                                    timeAgo={post.timeAgo}
                                    likes={post.likes}
                                    comments={post.commentsCount}
                                    category={post.category}
                                    categoryColor={post.categoryColor}
                                    isTrending={post.isTrending}
                                    onClick={() => handleTopicClick(post)}
                                />
                            ))}
                        </div>

                        {/* Load More Button */}
                        {hasMorePosts && (
                            <div className="text-center">
                                <button
                                    onClick={handleLoadMore}
                                    disabled={loadingMore}
                                    className="px-8 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loadingMore ? (
                                        <span className="flex items-center gap-2">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                                            Đang tải...
                                        </span>
                                    ) : (
                                        "Tải thêm chủ đề"
                                    )}
                                </button>
                            </div>
                        )}

                        {/* No more posts message */}
                        {!hasMorePosts && displayedPosts.length > 0 && (
                            <div className="text-center py-6">
                                <p className="text-gray-500 text-sm">
                                    Đã hiển thị tất cả {forumPosts.length} chủ đề
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Right Sidebar */}
                    <div className="w-80 flex-shrink-0">
                        <div className="sticky top-8 space-y-6">
                            {/* Forum Banner */}
                            <ForumBanner />

                            {/* Top Interactions */}
                            <TopInteractionsWidget />

                            {/* Community Stats */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                                <h3 className="font-semibold text-gray-900 mb-4">
                                    Thống kê cộng đồng
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                                        <span className="text-gray-700">Bài viết</span>
                                        <span className="text-teal-600 font-semibold">
                                            {forumStats.totalArticles.toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                                        <span className="text-gray-700">Thảo luận</span>
                                        <span className="text-teal-600 font-semibold">{forumStats.totalDiscussionPosts}</span>
                                    </div>
                                    <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                                        <span className="text-gray-700">Bình luận</span>
                                        <span className="text-teal-600 font-semibold">
                                            {forumStats.totalComments.toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-700">Hoạt động</span>
                                        <span className="text-green-600 flex items-center gap-1">
                                            <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></span>
                                            {forumStats.activeUsers.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentForumView;