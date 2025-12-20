import { ForumArticle, ForumPost, ForumDiscussionPost, ForumComment, ForumStats, ForumCategory, RelatedExam, vnsocialTopic, ForumPackage } from "@/features/dashboard/types/forum";
import { httpClient } from "@/lib/http";

// Helper function to generate a color for a category
const getCategoryColor = (categoryName: string): string => {
    const colors: { [key: string]: string } = {
        'văn hóa số': '#3B82F6',
        'áp lực học tập': '#EF4444',
        'ứng xử văn minh': '#8B5CF6',
        'lối sống xanh': '#10B981',
        'sự tử tế': '#EC4899',
    };
    
    const key = categoryName.toLowerCase();
    return colors[key] || '#F59E0B';
};

// Helper function to calculate time ago
const getTimeAgo = (date: string): string => {
    const now = new Date();
    const past = new Date(date);
    const diffMs = now.getTime() - past.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    return `${diffDays} ngày trước`;
};

// Transform ForumPackage to ForumArticle
const transformPackageToArticle = (pkg: ForumPackage): ForumArticle => {
    return {
        id: pkg._id as any, // Convert string to number for compatibility
        title: pkg.packageTitle,
        content: [pkg.packageSummary],
        excerpt: pkg.packageSummary.substring(0, 200) + '...',
        category: pkg.vnsocialTopic?.name || 'Chưa phân loại',
        categoryColor: getCategoryColor(pkg.vnsocialTopic?.name || ''),
        source: 'VnSocial',
        sourceUrl: pkg.sourceArticle?.url || '',
        timeAgo: getTimeAgo(pkg.createdAt),
        views: 0, // Default, can be added to backend later
        likes: 0, // Default, can be added to backend later
        discussionPostsCount: pkg.forumTopics?.length || 0,
        commentsCount: 0, // Default, can be calculated from topics
        isTrending: false, // Can be determined by backend logic
        createdAt: pkg.createdAt,
        updatedAt: pkg.updatedAt,
        tags: pkg.tags,
        relatedExamId: undefined,
    };
};

export class ForumService {
    // Get all articles from VnSocial (now from ForumPackages)
    static async getArticles(): Promise<ForumArticle[]> {
        try {
            const response = await httpClient.get<{ success: boolean; data: { packages: ForumPackage[]; total: number } }>(
                '/forum/packages',
                { requiresAuth: true }
            );
            
            const packages = response.data?.packages || [];
            return packages.map(transformPackageToArticle);
        } catch (error) {
            console.error('Error fetching forum articles:', error);
            return [];
        }
    }

    // Legacy method for backward compatibility
    static async getPosts(): Promise<ForumPost[]> {
        return this.getArticles();
    }

    // Get a single article by ID
    static async getArticleById(id: string): Promise<ForumArticle | null> {
        try {
            return await httpClient.get<ForumArticle>(`/forum_articles/${id}`, { requiresAuth: true });
        } catch (error) {
            console.error('Error fetching forum article:', error);
            return null;
        }
    }

    // Legacy method for backward compatibility
    static async getPostById(id: string): Promise<ForumPost | null> {
        return this.getArticleById(id);
    }

    // Get discussion posts for an article
    static async getDiscussionPostsByArticleId(articleId: number): Promise<ForumDiscussionPost[]> {
        try {
            return await httpClient.get<ForumDiscussionPost[]>(
                `/forum_discussion_posts?articleId=${articleId}`,
                { requiresAuth: true }
            );
        } catch (error) {
            console.error('Error fetching discussion posts:', error);
            return [];
        }
    }

    // Get comments for a discussion post
    static async getCommentsByDiscussionPostId(discussionPostId: string): Promise<ForumComment[]> {
        try {
            return await httpClient.get<ForumComment[]>(
                `/forum_comments?discussionPostId=${discussionPostId}`,
                { requiresAuth: true }
            );
        } catch (error) {
            console.error('Error fetching comments:', error);
            return [];
        }
    }

    // Legacy method - now gets comments for the first discussion post of an article
    static async getCommentsByPostId(articleId: number): Promise<ForumComment[]> {
        try {
            // Get discussion posts for the article
            const discussionPosts = await this.getDiscussionPostsByArticleId(articleId);
            if (discussionPosts.length === 0) return [];
            
            // Get comments for the first discussion post
            return this.getCommentsByDiscussionPostId(discussionPosts[0].id);
        } catch (error) {
            console.error('Error fetching comments:', error);
            return [];
        }
    }

    static async getCategories(): Promise<ForumCategory[]> {
        try {
            return await httpClient.get<ForumCategory[]>('/forum_categories', { requiresAuth: true });
        } catch (error) {
            console.error('Error fetching categories:', error);
            return [];
        }
    }

    static async getStats(): Promise<ForumStats> {
        try {
            return await httpClient.get<ForumStats>('/forum_stats', { requiresAuth: true });
        } catch (error) {
            console.error('Error fetching stats:', error);
            return {
                totalArticles: 0,
                totalDiscussionPosts: 0,
                totalComments: 0,
                activeUsers: 0
            };
        }
    }

    // Get related exam for an article
    static async getRelatedExam(articleId: number): Promise<RelatedExam | null> {
        try {
            const exams = await httpClient.get<RelatedExam[]>(
                `/related_exams?articleId=${articleId}`,
                { requiresAuth: true }
            );
            return exams[0] || null;
        } catch (error) {
            console.error('Error fetching related exam:', error);
            return null;
        }
    }

    // Get VnSocial topics
    static async getVnSocialTopics(type?: string): Promise<vnsocialTopic[]> {
        try {
            const endpoint = type ? `/vnsocial/topics?type=${type}` : '/vnsocial/topics';
            const result = await httpClient.get<{ success: boolean; data: { topics: vnsocialTopic[]; total: number } }>(
                endpoint,
                { requiresAuth: true }
            );
            return result.data?.topics || [];
        } catch (error) {
            console.error('Error fetching VnSocial topics:', error);
            return [];
        }
    }

    // Generate forum articles (Admin only)
    static async generateArticles(params: {
        topicId: string;
        count?: number;
        source?: string;
        startTime?: number;
        endTime?: number;
    }): Promise<{ success: boolean; message: string; data: any }> {
        try {
            // If startTime and endTime are not provided, use last 7 days
            const endTime = params.endTime || Date.now();
            const startTime = params.startTime || (endTime - 7 * 24 * 60 * 60 * 1000);

            const response = await httpClient.post<{ success: boolean; message: string; data: any }>(
                '/forum/topics/generate',
                {
                    topicId: params.topicId,
                    count: params.count || 3,
                    source: params.source || 'baochi',
                    startTime: startTime,
                    endTime: endTime,
                },
                { 
                    requiresAuth: true,
                    timeout: 180000 // 3 minutes timeout for AI generation (VnSocial + SmartBot can be slow)
                }
            );
            return response;
        } catch (error: any) {
            console.error('Error generating articles:', error);
            throw new Error(error?.message || 'Failed to generate articles');
        }
    }
}