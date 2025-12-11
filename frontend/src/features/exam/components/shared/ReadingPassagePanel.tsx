// src/features/exam/components/shared/ReadingPassagePanel.tsx
"use client";

import React from "react";

interface ReadingPassagePanelProps {
  title: string;
  content: string;
  audioUrl?: string;
}

/**
 * Reading passage panel for English exams
 * Shows reading text in left column
 */
const ReadingPassagePanel: React.FC<ReadingPassagePanelProps> = ({
  title,
  content,
  audioUrl,
}) => {
  return (
    <div className="h-full flex flex-col bg-gray-50 border-r border-gray-200">
      {/* Header */}
      <div className="flex-shrink-0 px-6 py-4 bg-white border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>

        {audioUrl && (
          <div className="mt-3 flex items-center gap-3">
            <audio controls className="w-full max-w-md">
              <source src={audioUrl} type="audio/mpeg" />
            </audio>
          </div>
        )}
      </div>

      {/* Content - scrollable */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div
          className="prose prose-sm max-w-none text-gray-700 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>

      {/* Footer note */}
      <div className="flex-shrink-0 px-6 py-3 bg-blue-50 border-t border-blue-200">
        <p className="text-xs text-blue-700 flex items-center gap-2">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          Bạn có thể cuộn để xem toàn bộ đoạn văn
        </p>
      </div>
    </div>
  );
};

export default ReadingPassagePanel;
