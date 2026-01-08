"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import SectionHeader from "@/components/ui/SectionHeader";
import NotificationModal from "@/components/ui/NotificationModal";
import ConfirmModal from "@/components/ui/ConfirmModal";
import AdminStatsGrid from "./AdminStatsGrid";
import AdminActionToolbar from "./AdminActionToolbar";
import ExamManagementTable from "./ExamManagementTable";
import CreateExamModal from "../teacher/exams/CreateExamModal";
import AdminContestsListView from "./contest/AdminContestsListView";
import { ExamMode } from "@/features/exam/types";
import {
  adminService,
  AdminExam,
  ExamStats,
} from "@/services/admin/admin.service";

type TabType = "exams" | "contests";

const AdminDashboardView: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("exams");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [exams, setExams] = useState<AdminExam[]>([]);
  const [stats, setStats] = useState<ExamStats>({
    totalExams: 0,
    contestExams: 0,
    publicExams: 0,
    totalParticipants: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [notification, setNotification] = useState<{
    isOpen: boolean;
    message: string;
    type: "success" | "error" | "warning" | "info";
  }>({ isOpen: false, message: "", type: "info" });
  const [confirm, setConfirm] = useState<{
    isOpen: boolean;
    message: string;
    onConfirm: () => void;
    type: "danger" | "warning" | "info";
  }>({ isOpen: false, message: "", onConfirm: () => {}, type: "warning" });

  // Fetch exams and stats from API
  const fetchExams = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("🔍 Fetching exams and stats as admin...");

      const [examsResponse, statsResponse] = await Promise.all([
        adminService.getAllExams({ limit: 100 }),
        adminService.getExamStats(),
      ]);

      console.log("✅ Exams fetched:", examsResponse);
      console.log("✅ Stats fetched:", statsResponse);

      setExams(examsResponse.exams);
      setStats(statsResponse);
    } catch (err: any) {
      console.error("❌ Error fetching data:", err);
      const errorMsg =
        err?.message || err?.response?.data?.message || "Không thể tải dữ liệu";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "exams") {
      fetchExams();
    }
  }, [activeTab]);

  // Filter exams based on search and filter
  const filteredExams = useMemo(() => {
    let filtered = exams;

    // Filter by subject
    if (filterType !== "all") {
      filtered = filtered.filter((exam) => exam.subject === filterType);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (exam) =>
          exam.title.toLowerCase().includes(query) ||
          exam.subject.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [exams, searchQuery, filterType]);

  const handleCreateNew = () => {
    setShowCreateModal(true);
  };

  const handleCreateExam = async (examData: any) => {
    try {
      // Modal already handles the exam creation via processPdfToExam
      // Just close modal and refresh list
      setShowCreateModal(false);
      fetchExams(); // Refresh list
    } catch (error) {
      console.error("Error creating exam:", error);
    }
  };

  const handleView = (examId: string) => {
    console.log("View exam:", examId);
    // Use same preview route as teacher
    router.push(`/exam/${examId}/take?preview=true`);
  };

  const handleEdit = (examId: string) => {
    console.log("Edit exam:", examId);
    // Admin should not edit exams directly
    setNotification({
      isOpen: true,
      message: "Admin không thể chỉnh sửa đề thi trực tiếp",
      type: "warning",
    });
  };

  const handleDelete = async (examId: string) => {
    setConfirm({
      isOpen: true,
      message:
        "Bạn có chắc muốn xóa đề thi này? Hành động này không thể hoàn tác.",
      type: "danger",
      onConfirm: async () => {
        try {
          const { examApi } = await import("@/services/teacher/examApi");
          const response = await examApi.deleteExam(examId);

          if (response.success) {
            // Remove from local state
            setExams(exams.filter((e) => e.id !== examId));
            setNotification({
              isOpen: true,
              message: "Xóa đề thi thành công!",
              type: "success",
            });
            // Refresh to update stats
            fetchExams();
          } else {
            console.error("Delete failed:", response.error);
            setNotification({
              isOpen: true,
              message: `Không thể xóa đề thi: ${response.error}`,
              type: "error",
            });
          }
        } catch (error: any) {
          console.error("Error deleting exam:", error);
          setNotification({
            isOpen: true,
            message: `Lỗi: ${
              error.message || "Không thể xóa đề thi. Vui lòng thử lại."
            }`,
            type: "error",
          });
        }
      },
    });
  };

  return (
    <div className="space-y-8">
      {/* Header with Tabs */}
      <div>
        <SectionHeader
          title="Quản lý Đề thi & Cuộc thi"
          subtitle="Quản lý toàn bộ đề thi và cuộc thi của hệ thống"
        />

        {/* Tabs */}
        <div className="mt-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("exams")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "exams"
                  ? "border-teal-500 text-teal-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5"
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
                <span>Đề thi ({exams.length})</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab("contests")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "contests"
                  ? "border-purple-500 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                  />
                </svg>
                <span>Cuộc thi</span>
              </div>
            </button>
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "exams" && (
        <>
          {loading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center space-y-3">
                <div className="w-12 h-12 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mx-auto"></div>
                <p className="text-gray-500">Đang tải danh sách đề thi...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center space-y-3">
                <div className="text-red-500 text-5xl">⚠️</div>
                <p className="text-red-600 font-medium">{error}</p>
                <button
                  onClick={fetchExams}
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                >
                  Thử lại
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Stats Grid */}
              <AdminStatsGrid stats={stats} />

              {/* Action Toolbar */}
              <AdminActionToolbar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                filterType={filterType}
                onFilterChange={setFilterType}
                onCreateNew={handleCreateNew}
              />

              {/* Exam List */}
              {filteredExams.length > 0 ? (
                <ExamManagementTable
                  exams={filteredExams}
                  onView={handleView}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ) : (
                <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400 mb-4"
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
                  <h3 className="text-lg font-medium text-gray-900 mb-1">
                    Không tìm thấy đề thi nào
                  </h3>
                  <p className="text-gray-500">
                    Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
                  </p>
                </div>
              )}
            </>
          )}
        </>
      )}

      {activeTab === "contests" && <AdminContestsListView />}

      {/* Create Exam Modal */}
      <CreateExamModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateExam}
      />

      {/* Notification and Confirm Modals */}
      <NotificationModal
        isOpen={notification.isOpen}
        onClose={() =>
          setNotification({ isOpen: false, message: "", type: "info" })
        }
        message={notification.message}
        type={notification.type}
      />
      <ConfirmModal
        isOpen={confirm.isOpen}
        onClose={() =>
          setConfirm({
            isOpen: false,
            message: "",
            onConfirm: () => {},
            type: "warning",
          })
        }
        onConfirm={() => {
          confirm.onConfirm();
          setConfirm({
            isOpen: false,
            message: "",
            onConfirm: () => {},
            type: "warning",
          });
        }}
        message={confirm.message}
        type={confirm.type}
      />
    </div>
  );
};

export default AdminDashboardView;
