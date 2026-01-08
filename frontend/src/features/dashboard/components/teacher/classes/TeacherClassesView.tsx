"use client";

import React, { useState, useEffect } from "react";
import { useDashboard } from "@/features/dashboard/context/DashboardContext";
import SectionHeader from "@/components/ui/SectionHeader";
import { Button, Badge, Input } from "@/components/ui";
import { classApi, TeacherClass, CreateClassData } from "@/services/teacher";
import ClassCard from "./ClassCard";
import CreateClassModal from "./CreateClassModal";
import NotificationModal from "@/components/ui/NotificationModal";
import ConfirmModal from "@/components/ui/ConfirmModal";

const TeacherClassesView: React.FC = () => {
  const { userRole } = useDashboard();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [classes, setClasses] = useState<TeacherClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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

  // Fetch classes on component mount
  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await classApi.getClasses();

      if (response.success) {
        setClasses(response.data);
      } else {
        setError(response.error || "Không thể tải danh sách lớp học");
      }
    } catch (err) {
      console.error("Error loading classes:", err);
      setError("Đã xảy ra lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const filteredClasses = classes.filter((cls) => {
    const matchesSearch =
      cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      selectedFilter === "all" || cls.subject.toLowerCase() === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const handleCreateClass = async (classData: CreateClassData) => {
    try {
      console.log("Creating class:", classData);
      const response = await classApi.createClass(classData);

      if (response.success) {
        // Reload classes after successful creation
        await loadClasses();
        setShowCreateModal(false);
      } else {
        // Handle error - could show a toast notification here
        console.error("Failed to create class:", response.error);
        setNotification({
          isOpen: true,
          message: response.error || "Không thể tạo lớp học",
          type: "error",
        });
      }
    } catch (err) {
      console.error("Error creating class:", err);
      setNotification({
        isOpen: true,
        message: "Đã xảy ra lỗi khi tạo lớp học",
        type: "error",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <SectionHeader
        title="Quản lý lớp học"
        subtitle={
          loading ? "Đang tải..." : `Tổng cộng ${classes.length} lớp học`
        }
        action={
          <Button
            variant="primary"
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600"
            disabled={loading}
          >
            <span>+</span>
            Tạo lớp học mới
          </Button>
        }
      />

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Đang tải danh sách lớp học...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <svg
            className="w-12 h-12 text-red-500 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <p className="text-red-700 mb-4">{error}</p>
          <Button
            onClick={loadClasses}
            variant="primary"
            className="bg-teal-500 hover:bg-teal-600"
          >
            Thử lại
          </Button>
        </div>
      )}

      {/* Main Content - Only show when not loading and no error */}
      {!loading && !error && (
        <>
          {/* Search and Filter Row */}
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Tìm kiếm lớp học theo tên hoặc mã..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-gray-900 placeholder-gray-500"
              />
            </div>

            {/* Filter Dropdown */}
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="all">Tất cả</option>
                <option value="toán">Toán</option>
                <option value="lý">Lý</option>
                <option value="hóa">Hóa</option>
                <option value="sinh">Sinh</option>
                <option value="anh">Tiếng Anh</option>
                <option value="văn">Văn</option>
              </select>
            </div>
          </div>

          {/* Classes Grid */}
          <div>
            {filteredClasses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredClasses.map((classItem) => (
                  <ClassCard key={classItem.id} classData={classItem} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-500 mb-4">
                  Không tìm thấy lớp học nào
                </div>
                <Button
                  variant="primary"
                  onClick={() => setShowCreateModal(true)}
                >
                  Tạo lớp học đầu tiên
                </Button>
              </div>
            )}
          </div>
        </>
      )}

      {/* Create Class Modal */}
      {showCreateModal && (
        <CreateClassModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateClass}
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

export default TeacherClassesView;
