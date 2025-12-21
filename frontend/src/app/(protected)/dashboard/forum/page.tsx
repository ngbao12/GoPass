"use client";

import React from "react";
import { useDashboard } from "@/features/dashboard/context/DashboardContext";
import StudentForumView from "@/features/dashboard/components/student/forum/StudentForumView";
import AdminForumView from "@/features/dashboard/components/admin/forum/AdminForumView";

export default function ForumPage() {
  const { userRole, isLoading } = useDashboard();

  if (isLoading || !userRole) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  // Render based on user role
  switch (userRole) {
    case "admin":
      return <AdminForumView />;

    case "teacher":
      // Teachers can use the same view as students for now
      return <StudentForumView />;

    case "student":
      return <StudentForumView />;

    default:
      return (
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
          <p className="text-gray-600">Không có quyền truy cập</p>
        </div>
      );
  }
}
