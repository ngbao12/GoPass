import React from "react";
import { Sparkles, Lightbulb } from "lucide-react";

interface AISuggestionBlockProps {
  suggestion: string;
  type?: "question" | "insight";
}

export function AISuggestionBlock({
  suggestion,
  type = "question",
}: AISuggestionBlockProps) {
  return (
    <div className="bg-gradient-to-r from-[var(--gopass-primary)]/5 to-[#008C7A]/5 rounded-lg border-2 border-dashed border-[var(--gopass-primary)]/30 p-5 my-6">
      <div className="flex gap-3">
        {/* Icon */}
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-[var(--gopass-primary)] rounded-lg flex items-center justify-center">
            {type === "question" ? (
              <Sparkles className="w-5 h-5 text-white" />
            ) : (
              <Lightbulb className="w-5 h-5 text-white" />
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[var(--gopass-primary)]">
              AI GoPass Suggestion
            </span>
            <span className="px-2 py-0.5 bg-[var(--gopass-primary)] text-white text-xs rounded">
              AI
            </span>
          </div>
          <p className="text-[var(--gopass-text)]">
            <strong>Gợi ý thảo luận:</strong> {suggestion}
          </p>

          {/* Quick Actions */}
          <div className="flex gap-2 mt-3">
            <button className="px-3 py-1 bg-white border border-[var(--gopass-primary)] text-[var(--gopass-primary)] rounded text-sm hover:bg-[var(--gopass-primary)]/10 transition-colors">
              Trả lời
            </button>
            <button className="px-3 py-1 text-[var(--gopass-text-muted)] text-sm hover:text-[var(--gopass-text)] transition-colors">
              Gợi ý khác
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
