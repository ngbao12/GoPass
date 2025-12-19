import React from "react";
import { ThumbsUp, MessageCircle, Share2, MoreHorizontal } from "lucide-react";

interface CommentBubbleProps {
  userName: string;
  userAvatar: string;
  timeAgo: string;
  content: string;
  likes: number;
  replies: number;
  isLiked?: boolean;
  badge?: string;
}

export function CommentBubble({
  userName,
  userAvatar,
  timeAgo,
  content,
  likes,
  replies,
  isLiked = false,
  badge,
}: CommentBubbleProps) {
  return (
    <div className="bg-white rounded-lg border border-[var(--gopass-border)] p-5 hover:shadow-sm transition-shadow">
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--gopass-primary)] to-[#008C7A] flex items-center justify-center text-white">
            {userAvatar}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[var(--gopass-text)]">{userName}</span>
            {badge && (
              <span className="px-2 py-0.5 bg-[var(--gopass-primary)]/10 text-[var(--gopass-primary)] text-xs rounded">
                {badge}
              </span>
            )}
            <span className="text-sm text-[var(--gopass-text-muted)]">
              • {timeAgo}
            </span>
            <button className="ml-auto text-[var(--gopass-text-muted)] hover:text-[var(--gopass-text)]">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>

          {/* Comment Text */}
          <p className="text-[var(--gopass-text)] mb-3 leading-relaxed">
            {content}
          </p>

          {/* Actions */}
          <div className="flex items-center gap-6">
            <button
              className={`flex items-center gap-1 text-sm transition-colors ${
                isLiked
                  ? "text-[var(--gopass-primary)]"
                  : "text-[var(--gopass-text-muted)] hover:text-[var(--gopass-primary)]"
              }`}
            >
              <ThumbsUp className="w-4 h-4" />
              <span>{likes}</span>
            </button>
            <button className="flex items-center gap-1 text-sm text-[var(--gopass-text-muted)] hover:text-[var(--gopass-primary)] transition-colors">
              <MessageCircle className="w-4 h-4" />
              <span>{replies > 0 ? replies : "Trả lời"}</span>
            </button>
            <button className="flex items-center gap-1 text-sm text-[var(--gopass-text-muted)] hover:text-[var(--gopass-primary)] transition-colors">
              <Share2 className="w-4 h-4" />
              <span>Chia sẻ</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
