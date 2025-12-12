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
import {
  TeacherOverviewView,
  TeacherClassesView,
  TeacherExamsView
} from "@/features/dashboard/components/teacher";

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
        return <TeacherClassesView />;
      case "exams":
        return <TeacherExamsView />;
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