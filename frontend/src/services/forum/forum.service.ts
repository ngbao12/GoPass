import { ForumArticle, ForumPost, ForumDiscussionPost, ForumComment, ForumStats, ForumCategory, RelatedExam } from "@/features/dashboard/types/forum";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export class ForumService {
    // Get all articles from VnSocial
    static async getArticles(): Promise<ForumArticle[]> {
        try {
            const response = await fetch(`${API_BASE_URL}/forum_articles`);
            if (!response.ok) throw new Error('Failed to fetch articles');
            return response.json();
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
            const response = await fetch(`${API_BASE_URL}/forum_articles/${id}`);
            if (!response.ok) throw new Error('Failed to fetch article');
            return response.json();
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
            const response = await fetch(`${API_BASE_URL}/forum_discussion_posts?articleId=${articleId}`);
            if (!response.ok) throw new Error('Failed to fetch discussion posts');
            return response.json();
        } catch (error) {
            console.error('Error fetching discussion posts:', error);
            return [];
        }
    }

    // Get comments for a discussion post
    static async getCommentsByDiscussionPostId(discussionPostId: string): Promise<ForumComment[]> {
        try {
            const response = await fetch(`${API_BASE_URL}/forum_comments?discussionPostId=${discussionPostId}`);
            if (!response.ok) throw new Error('Failed to fetch comments');
            return response.json();
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
            const response = await fetch(`${API_BASE_URL}/forum_categories`);
            if (!response.ok) throw new Error('Failed to fetch categories');
            return response.json();
        } catch (error) {
            console.error('Error fetching categories:', error);
            return [];
        }
    }

    static async getStats(): Promise<ForumStats> {
        try {
            const response = await fetch(`${API_BASE_URL}/forum_stats`);
            if (!response.ok) throw new Error('Failed to fetch stats');
            return response.json();
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
            const response = await fetch(`${API_BASE_URL}/related_exams?articleId=${articleId}`);
            if (!response.ok) throw new Error('Failed to fetch related exam');
            const exams = await response.json();
            return exams[0] || null;
        } catch (error) {
            console.error('Error fetching related exam:', error);
            return null;
        }
    }
}