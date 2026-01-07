"use client";

import React from "react";
import TeacherStatsGrid from "./TeacherStatsGrid";
import TeacherClassList from "./TeacherClassList";
import RecentActivityFeed from "./RecentActivityFeed";

const TeacherOverviewView: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Tổng quan</h1>
        <p className="text-gray-600 mt-1">
          Chào mừng bạn đến với bảng điều khiển giáo viên
        </p>
      </div>

      {/* Stats Cards - Tự fetch data bên trong */}
      <TeacherStatsGrid />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Classes List (2/3 width) */}
        <div className="lg:col-span-2">
          <TeacherClassList />
        </div>

        {/* Right Column: Recent Activity (1/3 width) */}
        <div className="lg:col-span-1">
          <RecentActivityFeed />
        </div>
      </div>
    </div>
  );
};

export default TeacherOverviewView;