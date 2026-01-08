"use client";

import React from "react";
import { SubjectStats } from "@/services/questionbank";

interface SubjectTabsProps {
  subjects: string[];
  activeSubject: string;
  onSubjectChange: (subject: string) => void;
  stats: SubjectStats[];
}

const SubjectTabs: React.FC<SubjectTabsProps> = ({
  subjects,
  activeSubject,
  onSubjectChange,
  stats,
}) => {
  return (
    <div className="flex gap-3 flex-wrap">
      {subjects.map((subject) => {
        const isActive = activeSubject === subject;
        const stat = stats.find((s) => s.subject === subject);
        return (
          <button
            key={subject}
            onClick={() => onSubjectChange(subject)}
            className={`
              px-6 py-2.5 rounded-lg font-medium text-sm transition-all
              ${
                isActive
                  ? "bg-teal-500 text-white shadow-md"
                  : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
              }
            `}
          >
            <div className="flex items-center gap-2">
              <span>{subject}</span>
              {stat && (
                <span
                  className={`text-xs ${
                    isActive ? "text-teal-100" : "text-gray-500"
                  }`}
                >
                  ({stat.total})
                </span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default SubjectTabs;
