"use client";

import React from "react";
import TeacherStatsGrid from "./TeacherStatsGrid";
import TeacherClassList from "./TeacherClassList";

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

      { }
      <TeacherStatsGrid />

      { }
      <TeacherClassList />
    </div>
  );
};

export default TeacherOverviewView;
