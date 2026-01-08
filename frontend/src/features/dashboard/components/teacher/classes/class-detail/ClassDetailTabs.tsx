"use client";

import React from "react";

interface ClassDetailTabsProps {
  activeTab: "members" | "progress" | "exams";
  onTabChange: (tab: "members" | "progress" | "exams") => void;
  stats: {
    totalMembers: number;
    pendingRequests: number;
    activeAssignments: number;
    averageScore: number;
  };
}

const ClassDetailTabs: React.FC<ClassDetailTabsProps> = ({ 
  activeTab, 
  onTabChange, 
  stats 
}) => {
  const tabs = [
    {
      id: "members" as const,
      name: "Quản lý thành viên",
      count: stats.totalMembers,
      badge: stats.pendingRequests > 0 ? stats.pendingRequests : undefined,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      )
    },
    {
      id: "exams" as const,
      name: "Đề thi",
      count: stats.activeAssignments,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    }
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex items-center gap-3 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-teal-500 text-teal-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.icon}
              <span>{tab.name}</span>
              <span className="flex items-center gap-1">
                <span className="text-gray-400">({tab.count})</span>
                {tab.badge && (
                  <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] h-5 flex items-center justify-center">
                    {tab.badge}
                  </span>
                )}
              </span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default ClassDetailTabs;