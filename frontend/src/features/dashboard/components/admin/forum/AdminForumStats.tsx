"use client";

import React from "react";
import { FileText, MessageCircle, Users, TrendingUp } from "lucide-react";
import { formatNumber } from "@/utils/format-date";

interface AdminForumStatsProps {
  stats: {
    totalArticles: number;
    totalDiscussionPosts: number;
    totalComments: number;
    avgEngagement: number;
  };
}

const AdminForumStats: React.FC<AdminForumStatsProps> = ({ stats }) => {
  const statCards = [
    {
      label: "Tổng bài viết",
      value: stats.totalArticles,
      icon: FileText,
      color: "bg-indigo-600",
      bgColor: "bg-indigo-50",
      textColor: "text-indigo-700",
    },
    {
      label: "Chủ đề thảo luận",
      value: stats.totalDiscussionPosts,
      icon: MessageCircle,
      color: "bg-purple-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-700",
    },
    {
      label: "Bình luận",
      value: stats.totalComments,
      icon: Users,
      color: "bg-emerald-600",
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-700",
    },
    {
      label: "Tương tác trung bình",
      value: stats.avgEngagement,
      icon: TrendingUp,
      color: "bg-amber-600",
      bgColor: "bg-amber-50",
      textColor: "text-amber-700",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all hover:border-gray-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.bgColor} p-3 rounded-lg shadow-sm`}>
                <Icon className={`w-6 h-6 ${stat.textColor}`} />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-bold text-gray-900">
                {formatNumber(stat.value)}
              </p>
              <p className="text-sm font-medium text-gray-600">{stat.label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AdminForumStats;
