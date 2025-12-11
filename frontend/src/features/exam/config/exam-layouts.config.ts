// src/features/exam/config/exam-layouts.config.ts

/**
 * Configuration for different exam layout types
 * Based on subject and question structure
 */

export type ExamLayoutType =
  | "standard" // Single column: Sidebar + Questions (Toán, Đúng/Sai)
  | "reading-passage"; // Two columns: Passage + Questions (English Reading)

export interface ExamLayoutConfig {
  type: ExamLayoutType;
  sidebar: {
    width: string;
    position: "left";
  };
  content: {
    columns: 1 | 2;
    split?: [number, number]; // percentage split for 2 columns
  };
  navigation: {
    type: "question" | "section";
    buttonText: string;
  };
}

/**
 * Layout configurations per subject/exam type
 */
export const EXAM_LAYOUTS: Record<string, ExamLayoutConfig> = {
  // Toán Học - Standard layout
  "Toán Học": {
    type: "standard",
    sidebar: {
      width: "200px",
      position: "left",
    },
    content: {
      columns: 1,
    },
    navigation: {
      type: "question",
      buttonText: "Câu tiếp theo",
    },
  },

  // Tiếng Anh - Reading passage layout
  "Tiếng Anh": {
    type: "reading-passage",
    sidebar: {
      width: "240px",
      position: "left",
    },
    content: {
      columns: 2,
      split: [40, 60], // 40% passage, 60% questions
    },
    navigation: {
      type: "section",
      buttonText: "Next Section",
    },
  },

  // Default fallback
  default: {
    type: "standard",
    sidebar: {
      width: "200px",
      position: "left",
    },
    content: {
      columns: 1,
    },
    navigation: {
      type: "question",
      buttonText: "Câu tiếp theo",
    },
  },
};

export function getExamLayout(subject: string): ExamLayoutConfig {
  return EXAM_LAYOUTS[subject] || EXAM_LAYOUTS["default"];
}
