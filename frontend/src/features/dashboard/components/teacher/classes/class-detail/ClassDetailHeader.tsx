"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";
import { classApi } from "@/services/teacher";
import type { ClassDetail } from "@/services/teacher/types";

interface ClassDetailHeaderProps {
  classDetail: ClassDetail;
  onGoBack: () => void;
}

const ClassDetailHeader: React.FC<ClassDetailHeaderProps> = ({ 
  classDetail, 
  onGoBack 
}) => {
  const router = useRouter();
  const [showShareModal, setShowShareModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [editData, setEditData] = useState({
    className: classDetail.className,
    description: classDetail.description || '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(classDetail.classCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy class code:", err);
    }
  };

  const handleShareClassCode = () => {
    setShowShareModal(true);
  };

  const handleDeleteClass = async () => {
    try {
      setIsDeleting(true);
      setDeleteError(null);
      
      const response = await classApi.deleteClass(classDetail.id);
      
      if (response.success) {
        // Redirect to classes list after successful deletion
        router.push("/dashboard/teacher/classes");
      } else {
        setDeleteError(response.error || "Không thể xóa lớp học");
      }
    } catch (err) {
      console.error("Error deleting class:", err);
      setDeleteError("Đã xảy ra lỗi khi xóa lớp học");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUpdateClass = async () => {
    try {
      setIsEditing(true);
      setEditError(null);

      const response = await classApi.updateClass(classDetail.id, {
        className: editData.className,
        description: editData.description,
      });

      if (response.success) {
        setShowEditModal(false);
        // Reload page to see updated info
        window.location.reload();
      } else {
        setEditError(response.error || "Không thể cập nhật lớp học");
      }
    } catch (err) {
      console.error("Error updating class:", err);
      setEditError("Đã xảy ra lỗi khi cập nhật lớp học");
    } finally {
      setIsEditing(false);
    }
  };
  return (
    <div className="bg-white border border-gray-200 rounded-lg">
      {/* Header with gradient background */}
      <div className="bg-gradient-to-r from-teal-500 to-blue-600 text-white rounded-t-lg p-6">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-4 flex-1">
            <button
              onClick={onGoBack}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{classDetail.className}</h1>
              <p className="text-teal-100 mt-1">{classDetail.description}</p>
            </div>
          </div>

          <button
            onClick={() => setShowEditModal(true)}
            className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors font-medium text-sm"
          >
            Chỉnh sửa
          </button>
        </div>

        {/* Class Info */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <div>
                <p className="text-2xl font-bold">{classDetail.stats.totalMembers}</p>
                <p className="text-sm text-teal-100">Học sinh</p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <div>
                <p className="text-2xl font-bold">{classDetail.stats.activeAssignments}</p>
                <p className="text-sm text-teal-100">Đề thi</p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <div>
                <p className="text-2xl font-bold">{classDetail.stats.averageScore}</p>
                <p className="text-sm text-teal-100">Điểm TB</p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-2xl font-bold">85%</p>
                <p className="text-sm text-teal-100">Hoàn thành</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom section with class code */}
      <div className="p-6 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <p className="text-sm text-gray-600">Mã lớp học</p>
              <code className="text-lg font-mono bg-gray-100 px-3 py-1 rounded-lg text-gray-800">
                {classDetail.classCode}
              </code>
            </div>
            <div>
              <p className="text-sm text-gray-600">Giáo viên</p>
              <p className="font-medium text-gray-900">{classDetail.teacher.full_name}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button 
              variant="secondary" 
              className="text-sm"
              onClick={handleShareClassCode}
            >
              {copied ? "Đã sao chép!" : "Chia sẻ mã lớp"}
            </Button>
            <Button 
              variant="primary" 
              className="text-sm bg-red-600 hover:bg-red-700"
              onClick={() => setShowDeleteModal(true)}
            >
              Xóa lớp học
            </Button>
          </div>
        </div>
      </div>

      {/* Share Class Code Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-xl">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Chia sẻ mã lớp</h3>
              <p className="text-sm text-gray-600">Chia sẻ mã này với học sinh để họ có thể tham gia lớp</p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6 text-center">
              <p className="text-sm text-gray-600 mb-3">Mã lớp</p>
              <code className="text-3xl font-mono font-bold text-teal-600">
                {classDetail.classCode}
              </code>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCopyCode}
                className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                {copied ? "Đã sao chép!" : "Sao chép"}
              </button>
              <button
                onClick={() => setShowShareModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Class Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-xl">
            <div className="mb-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 text-center mb-2">Xóa lớp học?</h3>
              <p className="text-sm text-gray-600 text-center">
                Bạn có chắc muốn xóa lớp học <span className="font-semibold">{classDetail.className}</span>? Hành động này không thể hoàn tác.
              </p>
            </div>

            {deleteError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{deleteError}</p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                onClick={handleDeleteClass}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                    </svg>
                    Đang xóa...
                  </>
                ) : (
                  "Xóa"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Class Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-xl">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Chỉnh sửa thông tin lớp học</h3>
              <p className="text-sm text-gray-600">Cập nhật tên và mô tả lớp học</p>
            </div>

            {editError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{editError}</p>
              </div>
            )}

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên lớp học
                </label>
                <input
                  type="text"
                  value={editData.className}
                  onChange={(e) => setEditData({ ...editData, className: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Nhập tên lớp học"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mô tả
                </label>
                <textarea
                  value={editData.description}
                  onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  rows={3}
                  placeholder="Nhập mô tả lớp học"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowEditModal(false)}
                disabled={isEditing}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                onClick={handleUpdateClass}
                disabled={isEditing}
                className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isEditing ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                    </svg>
                    Đang lưu...
                  </>
                ) : (
                  "Lưu thay đổi"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassDetailHeader;