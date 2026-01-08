"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import SectionHeader from "@/components/ui/SectionHeader";
import AdminStatsGrid from "./AdminStatsGrid";
import AdminActionToolbar from "./AdminActionToolbar";
import ExamManagementTable from "./ExamManagementTable";
import CreateExamModal from "../teacher/exams/CreateExamModal";
import { ExamMode } from "@/features/exam/types";
import {
  adminService,
  AdminExam,
  ExamStats,
} from "@/services/admin/admin.service";

const AdminDashboardView: React.FC = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<ExamMode | "all">("all");
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
    fetchExams();
  }, []);

  // Filter exams based on search and filter
  const filteredExams = useMemo(() => {
    let filtered = exams;

    // Filter by mode
    if (filterType !== "all") {
      filtered = filtered.filter((exam) => exam.mode === filterType);
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
    router.push(`/exam/${examId}?preview=true`);
  };

  const handleEdit = (examId: string) => {
    console.log("Edit exam:", examId);
    router.push(`/dashboard/exams/${examId}/edit`);
  };

  const handleDelete = async (examId: string) => {
    if (!confirm("Bạn có chắc muốn xóa đề thi này?")) return;

    console.log("Delete exam:", examId);
    // TODO: Implement delete API call
    alert("Chức năng xóa đang được phát triển");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-500">Đang tải danh sách đề thi...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-3">
          <div className="text-red-500 text-5xl">⚠️</div>
          <p className="text-red-600 font-medium">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <SectionHeader
        title="Quản lý đề thi"
        subtitle={`Đề thi do Admin tạo - Tổng cộng ${exams.length} đề`}
      />

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

      {/* Create Exam Modal */}
      <CreateExamModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateExam}
      />
    </div>
  );
};

export default AdminDashboardView;
