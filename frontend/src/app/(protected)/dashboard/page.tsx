"use client";

import React from "react";
import AdminDashboardView from "@/features/dashboard/components/admin/AdminDashboardView";
import QuestionBankView from "@/features/dashboard/components/admin/questionbank/QuestionBankView";
import CreateContestView from "@/features/dashboard/components/admin/contest/CreateContestView";
import StudentDashboardView from "@/features/dashboard/components/student/overview/StudentDashboardView";
import StudentPracticeView from "@/features/dashboard/components/student/practice/StudentPracticeView";
import StudentContestsView from "@/features/dashboard/components/student/contest/StudentContestsView";
import StudentHistoryView from "@/features/dashboard/components/student/history/StudentHistoryView";
import { useDashboard } from "@/features/dashboard/context/DashboardContext";
import { TeacherOverviewView } from '@/features/dashboard/components/teacher';

const DashboardPage: React.FC = () => {
  const { activeTab, userRole } = useDashboard();

  const renderAdminContent = () => {
    switch (activeTab) {
      case "exams":
        return <AdminDashboardView />;

      case "question-bank":
        return <QuestionBankView />;

      case "contests":
        return <CreateContestView />;

      default:
        return <AdminDashboardView />;
    }
  };

  const renderStudentContent = () => {
    switch (activeTab) {
      case "overview":
        return <StudentDashboardView />;

      case "practice":
        return <StudentPracticeView />;

      case "contests":
        return <StudentContestsView />;

      case "history":
        return <StudentHistoryView />;

      default:
        return <StudentDashboardView />;
    }
  };

  const renderTeacherContent = () => {
    switch (activeTab) {
      case "overview":
        return <TeacherOverviewView />;

      case "classes":
        return (
          <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
            <svg
              className="mx-auto h-16 w-16 text-teal-500 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Classes Management
            </h2>
            <p className="text-gray-600 mb-4">
              Detailed class management view coming soon...
            </p>
          </div>
        );

      case "exams":
        return (
          <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
            <svg
              className="mx-auto h-16 w-16 text-purple-500 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Exam Management
            </h2>
            <p className="text-gray-600 mb-4">
              Create and manage exams for your classes...
            </p>
          </div>
        );

      case "students":
        return (
          <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
            <svg
              className="mx-auto h-16 w-16 text-green-500 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Student Management
            </h2>
            <p className="text-gray-600 mb-4">
              Track student progress and performance...
            </p>
          </div>
        );

      default:
        return <TeacherOverviewView />;
    }
  };

  const renderDashboardByRole = () => {
    switch (userRole) {
      case "admin":
        return renderAdminContent();

      case "teacher":
        return renderTeacherContent();

      case "student":
        return renderStudentContent();

      default:
        return null;
    }
  };

  return <>{renderDashboardByRole()}</>;
};

export default DashboardPage;