"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDashboard } from "@/features/dashboard/context/DashboardContext";
import SectionHeader from "@/components/ui/SectionHeader";
import { Button, Badge, Input } from "@/components/ui";
import NotificationModal from "@/components/ui/NotificationModal";
import ConfirmModal from "@/components/ui/ConfirmModal";
import CreateExamModal from "./CreateExamModal";
import AssignExamModal from "./AssignExamModal";
import DeleteExamModal from "./DeleteExamModal";
import { useTeacherData } from "@/features/dashboard/context/TeacherDataContext";
import { examApi } from "@/services/teacher";

interface Exam {
  _id: string;
  title: string;
  subject: string;
  durationMinutes: number;
  totalQuestions: number;
  totalPoints: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

const TeacherExamsView: React.FC = () => {
  const router = useRouter();
  const { userRole } = useDashboard();
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const { teacherData, deleteExam } = useTeacherData();
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
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

  // Fetch exams from API
  useEffect(() => {
    fetchExams();
  }, [pagination.page, subjectFilter]);

  const fetchExams = async () => {
    try {
      setLoading(true);
      const response = await examApi.getMyExams({
        page: pagination.page,
        limit: pagination.limit,
        subject: subjectFilter !== "all" ? subjectFilter : undefined,
      });

      if (response.success) {
        setExams(response.data.exams);
        setPagination((prev) => ({
          ...prev,
          total: response.data.pagination.total,
          totalPages: response.data.pagination.totalPages,
        }));
      }
    } catch (error) {
      console.error("Error fetching exams:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredExams = exams.filter((exam) => {
    const matchesSearch =
      exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.subject.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

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

  const handleAssignExam = (exam: Exam) => {
    setSelectedExam(exam);
    setShowAssignModal(true);
  };

  const handleAssignExamSubmit = async (assignmentData: any) => {
    try {
      if (selectedExam) {
        const result = await examApi.assignExamToClass(
          selectedExam._id,
          assignmentData
        );

        if (result.success) {
          setNotification({
            isOpen: true,
            message: result.message || "Gán đề thi thành công!",
            type: "success",
          });
          setShowAssignModal(false);
          setSelectedExam(null);
        } else {
          setNotification({
            isOpen: true,
            message:
              "Có lỗi xảy ra: " + (result.message || "Không thể gán đề thi"),
            type: "error",
          });
        }
      }
    } catch (error) {
      console.error("Error assigning exam:", error);
      setNotification({
        isOpen: true,
        message: "Đã xảy ra lỗi khi gán đề thi. Vui lòng thử lại.",
        type: "error",
      });
    }
  };

  const handleDeleteExam = async (examId: string) => {
    setIsDeleting(true);
    try {
      const response = await examApi.deleteExam(examId);
      if (response.success) {
        // Remove from local state
        setExams(exams.filter((e) => e._id !== examId));
        // Also update context
        deleteExam(examId);
        setShowDeleteModal(false);
        setSelectedExam(null);
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
    } finally {
      setIsDeleting(false);
    }
  };

  const handlePreviewExam = (exam: Exam) => {
    // Navigate to exam with preview mode instead of opening modal
    router.push(`/exam/${exam._id}/take?preview=true`);
  };

  const openDeleteModal = (exam: Exam) => {
    setSelectedExam(exam);
    setShowDeleteModal(true);
  };

  const getSubjectBadge = (subject: string) => {
    const subjectColors: Record<string, string> = {
      Toán: "bg-blue-100 text-blue-700",
      "Ngữ Văn": "bg-purple-100 text-purple-700",
      "Tiếng Anh": "bg-green-100 text-green-700",
      "Vật Lý": "bg-yellow-100 text-yellow-700",
      "Hóa Học": "bg-red-100 text-red-700",
      "Sinh Học": "bg-teal-100 text-teal-700",
      "Lịch Sử": "bg-orange-100 text-orange-700",
      "Địa Lý": "bg-indigo-100 text-indigo-700",
    };
    const colorClass = subjectColors[subject] || "bg-gray-100 text-gray-700";
    return <Badge className={colorClass}>{subject}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <SectionHeader
        title="Quản lý đề thi"
        subtitle={`Tổng cộng ${pagination.total} đề thi`}
        action={
          <Button
            variant="primary"
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600"
          >
            <span>+</span>
            Tạo đề thi mới
          </Button>
        }
      />

      {/* Filters */}
      <div className="flex gap-4">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Tìm kiếm theo tên đề thi hoặc môn học..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-gray-900 placeholder-gray-500"
          />
        </div>
        <select
          value={subjectFilter}
          onChange={(e) => setSubjectFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          <option value="all">Tất cả môn học</option>
          <option value="Toán">Toán</option>
          <option value="Ngữ Văn">Ngữ Văn</option>
          <option value="Tiếng Anh">Tiếng Anh</option>
          <option value="Vật Lý">Vật Lý</option>
          <option value="Hóa Học">Hóa Học</option>
          <option value="Sinh Học">Sinh Học</option>
          <option value="Lịch Sử">Lịch Sử</option>
          <option value="Địa Lý">Địa Lý</option>
        </select>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
        </div>
      )}

      {/* Exams Table */}
      {!loading && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          {/* Table Header */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-700">
              <div className="col-span-4">Tên đề thi</div>
              <div className="col-span-2 text-center">Môn học</div>
              <div className="col-span-2 text-center">Số câu</div>
              <div className="col-span-2 text-center">Thời gian</div>
              <div className="col-span-2 text-center">Thao tác</div>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-200">
            {filteredExams.length > 0 ? (
              filteredExams.map((exam) => (
                <div
                  key={exam._id}
                  className="px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="grid grid-cols-12 gap-4 items-center">
                    {/* Exam Title */}
                    <div className="col-span-4">
                      <div className="flex flex-col">
                        <h3 className="font-medium text-gray-900 mb-1">
                          {exam.title}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {exam.totalPoints} điểm
                        </p>
                      </div>
                    </div>

                    {/* Subject */}
                    <div className="col-span-2 text-center">
                      {getSubjectBadge(exam.subject)}
                    </div>

                    {/* Questions Count */}
                    <div className="col-span-2 text-center">
                      <span className="text-gray-900 font-medium">
                        {exam.totalQuestions} câu
                      </span>
                    </div>

                    {/* Duration */}
                    <div className="col-span-2 text-center">
                      <span className="text-gray-900 font-medium">
                        {exam.durationMinutes} phút
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="col-span-2 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {/* Preview Button */}
                        <button
                          onClick={() => handlePreviewExam(exam)}
                          className="p-2 text-gray-400 hover:text-teal-600 transition-colors"
                          title="Xem trước"
                        >
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
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        </button>

                        {/* Assignment Button */}
                        <button
                          onClick={() => handleAssignExam(exam)}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                          title="Gán đề thi"
                        >
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
                              d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                            />
                          </svg>
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => openDeleteModal(exam)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                          title="Xóa"
                        >
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
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-12 text-center">
                <div className="text-gray-500 mb-4">
                  {searchTerm
                    ? "Không tìm thấy đề thi nào"
                    : "Chưa có đề thi nào"}
                </div>
                <Button
                  variant="primary"
                  onClick={() => setShowCreateModal(true)}
                  className="bg-teal-500 hover:bg-teal-600"
                >
                  Tạo đề thi đầu tiên
                </Button>
              </div>
            )}
          </div>

          {/* Pagination */}
          {filteredExams.length > 0 && pagination.totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Hiển thị {(pagination.page - 1) * pagination.limit + 1} -{" "}
                  {Math.min(
                    pagination.page * pagination.limit,
                    pagination.total
                  )}{" "}
                  trong tổng số {pagination.total} đề thi
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    onClick={() =>
                      setPagination((prev) => ({
                        ...prev,
                        page: prev.page - 1,
                      }))
                    }
                    disabled={pagination.page === 1}
                    className="disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Trước
                  </Button>
                  <div className="flex items-center gap-2">
                    {[...Array(pagination.totalPages)].map((_, idx) => (
                      <button
                        key={idx + 1}
                        onClick={() =>
                          setPagination((prev) => ({ ...prev, page: idx + 1 }))
                        }
                        className={`px-3 py-1 rounded ${
                          pagination.page === idx + 1
                            ? "bg-teal-500 text-white"
                            : "bg-white text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {idx + 1}
                      </button>
                    ))}
                  </div>
                  <Button
                    variant="secondary"
                    onClick={() =>
                      setPagination((prev) => ({
                        ...prev,
                        page: prev.page + 1,
                      }))
                    }
                    disabled={pagination.page === pagination.totalPages}
                    className="disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Sau
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      {showCreateModal && (
        <CreateExamModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateExam}
        />
      )}

      {showAssignModal && selectedExam && (
        <AssignExamModal
          isOpen={showAssignModal}
          exam={selectedExam}
          onClose={() => {
            setShowAssignModal(false);
            setSelectedExam(null);
          }}
          onSubmit={handleAssignExamSubmit}
        />
      )}

      {showDeleteModal && selectedExam && (
        <DeleteExamModal
          isOpen={showDeleteModal}
          examTitle={selectedExam.title}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedExam(null);
          }}
          onConfirm={() => handleDeleteExam(selectedExam._id)}
          isLoading={isDeleting}
        />
      )}

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

export default TeacherExamsView;
