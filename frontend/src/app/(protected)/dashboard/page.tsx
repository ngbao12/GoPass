"use client";

import React from "react";
import AdminDashboardView from "@/features/dashboard/components/admin/AdminDashboardView";
import StudentDashboardView from "@/features/dashboard/components/student/overview/StudentDashboardView";
import TeacherOverviewView from "@/features/dashboard/components/teacher/overview/TeacherOverviewView";
import { useDashboard } from "@/features/dashboard/context/DashboardContext";

const DashboardPage: React.FC = () => {
  const { userRole, isLoading } = useDashboard();

  const renderDashboardByRole = () => {
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

    switch (userRole) {
      case "admin":
        return <AdminDashboardView />;

      case "teacher":
        return <TeacherOverviewView />;

      case "student":
        return <StudentDashboardView />;

      default:
        return (
          <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Unknown User Role
            </h2>
            <p className="text-gray-600">
              Vui lòng liên hệ với quản trị viên nêu cần hỗ trợ.
            </p>
          </div>
        );
    }
  };

  return <>{renderDashboardByRole()}</>;
};

export default DashboardPage;