"use client";

import React from "react";
import AdminDashboardView from "@/features/dashboard/components/admin/AdminDashboardView";
import StudentDashboardView from "@/features/dashboard/components/student/overview/StudentDashboardView";

import { useDashboard } from "@/features/dashboard/context/DashboardContext";

const DashboardPage: React.FC = () => {
  const { userRole, isLoading } = useDashboard();
  };

  const renderDashboardByRole = () => {
    // Wait for loading to complete and userRole to be available
    if (isLoading || !userRole) {
      return null;
    }

    switch (userRole) {
      case "admin":
        return <AdminDashboardView />;

      case "teacher":
        return renderTeacherContent();

      case "student":
        return <StudentDashboardView />;

      default:
        return (
          <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
            <p className="text-gray-600">Invalid user role</p>
          </div>
        );
    }
  };

  return <>{renderDashboardByRole()}</>;
};

export default DashboardPage;
