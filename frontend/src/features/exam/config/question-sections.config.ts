// src/features/exam/config/question-sections.config.ts

/**
 * Configuration for exam sections and grouping
 * Maps to backend ExamQuestion structure
 */

export interface SectionBadgeStyle {
  bg: string;
  text: string;
  border: string;
}

export const SECTION_BADGE_STYLES: Record<string, SectionBadgeStyle> = {
  "Phần I": {
    bg: "bg-blue-500",
    text: "text-white",
    border: "border-blue-600",
  },
  "Phần II": {
    bg: "bg-purple-500",
    text: "text-white",
    border: "border-purple-600",
  },
  "Phần III": {
    bg: "bg-orange-500",
    text: "text-white",
    border: "border-orange-600",
  },
  "Part I": {
    bg: "bg-purple-500",
    text: "text-white",
    border: "border-purple-600",
  },
  "Part II": {
    bg: "bg-teal-500",
    text: "text-white",
    border: "border-teal-600",
  },
  "Part III": {
    bg: "bg-orange-500",
    text: "text-white",
    border: "border-orange-600",
  },
};

export function getSectionBadgeStyle(sectionName: string): SectionBadgeStyle {
  return (
    SECTION_BADGE_STYLES[sectionName] || {
      bg: "bg-gray-500",
      text: "text-white",
      border: "border-gray-600",
    }
  );
}
