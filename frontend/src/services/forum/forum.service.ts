import { ForumArticle, ForumPost, ForumDiscussionPost, ForumComment, ForumStats, ForumCategory, RelatedExam, vnsocialTopic } from "@/features/dashboard/types/forum";
import { httpClient } from "@/lib/http";

export class ForumService {
    // Get all articles from VnSocial
    static async getArticles(): Promise<ForumArticle[]> {
        try {
            return await httpClient.get<ForumArticle[]>('/forum_articles', { requiresAuth: true });
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
}