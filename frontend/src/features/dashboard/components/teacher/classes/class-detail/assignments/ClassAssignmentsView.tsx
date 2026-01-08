"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import type { ClassDetail } from "@/services/teacher/types";
import { classApi } from "@/services/teacher";

interface ClassAssignmentsViewProps {
  classDetail: ClassDetail;
  onUpdate: () => void;
}

const ClassAssignmentsView: React.FC<ClassAssignmentsViewProps> = ({
  classDetail,
  onUpdate,
}) => {
  const router = useRouter();
  // Use assignments data from classDetail (already fetched by parent)
  const assignments = classDetail.assignments || [];

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<any | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [editData, setEditData] = useState({
    startTime: "",
    endTime: "",
    attemptLimit: 1,
    allowLateSubmission: false,
  });

  console.log("📊 ClassAssignmentsView - Assignments:", assignments);
  console.log("📊 ClassAssignmentsView - Length:", assignments.length);

  const handleViewSubmissions = (assignment: any) => {
    const examId =
      assignment.examId ||
      assignment.exam_id ||
      assignment.exam?.id ||
      assignment.exam?._id ||
      assignment._id; // fallback to assignment id

    console.log("🔍 Assignment object:", assignment);
    console.log("🔍 Extracted examId:", examId);

    if (!examId) {
      alert("Không thể lấy ID đề thi từ bài tập này. Hãy thử lại.");
      return;
    }

    const url = new URL("/dashboard/grading", window.location.origin);
    url.searchParams.set("classId", classDetail.id);
    url.searchParams.set("examId", examId);
    
    console.log("🚀 Navigating to:", url.toString());
    router.push(url.pathname + "?" + url.searchParams.toString());
  };

  return (
    <div className="p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Quản lý đề thi
            </h3>
            <p className="text-sm text-gray-600">
              Giao và quản lý các đề thi cho lớp học
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
              {assignments.length} đề thi
            </span>
            {/* HIDDEN: Assignment button - Use TeacherExamsView to assign exams */}
          </div>
        </div>

        {/* Assignments List */}
        {assignments.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {assignments.map((assignment: any) => (
              <div
                key={assignment._id}
                className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-teal-600"
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
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {assignment.title || "Không có tiêu đề"}
                        </h4>
                      </div>
                    </div>

                    {/* First Row: Start, End, Duration, Questions */}
                    <div className="flex items-center gap-4 mt-3 text-sm text-gray-600 overflow-x-auto">
                      <div className="flex items-center gap-1 whitespace-nowrap">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span>
                          Bắt đầu:{" "}
                          {assignment.startTime
                            ? new Date(assignment.startTime).toLocaleDateString(
                                "vi-VN"
                              )
                            : "N/A"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 whitespace-nowrap">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span>
                          Kết thúc:{" "}
                          {assignment.endTime
                            ? new Date(assignment.endTime).toLocaleDateString(
                                "vi-VN"
                              )
                            : "N/A"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 whitespace-nowrap">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span>{assignment.duration || 0} phút</span>
                      </div>
                      <div className="flex items-center gap-1 whitespace-nowrap">
                        <svg
                          className="w-4 h-4"
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
                        <span>{assignment.questionCount || 0} câu hỏi</span>
                      </div>
                    </div>

                    {/* Second Row: Submissions, Attempt Limit, Late Submission */}
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600 overflow-x-auto">
                      <div className="flex items-center gap-1 whitespace-nowrap">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span>{assignment.submittedCount || 0} bài nộp</span>
                      </div>
                      <div className="flex items-center gap-1 whitespace-nowrap border-l border-gray-300 pl-4">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                          />
                        </svg>
                        <span>{assignment.attemptLimit || 1} lần làm bài</span>
                      </div>
                      <div className="flex items-center gap-1 whitespace-nowrap">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span>
                          {assignment.allowLateSubmission
                            ? "✓ Cho phép nộp muộn"
                            : "Không cho phép nộp muộn"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        assignment.status === "ongoing"
                          ? "bg-green-100 text-green-700"
                          : assignment.status === "upcoming"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {assignment.status === "ongoing"
                        ? "Đang diễn ra"
                        : assignment.status === "upcoming"
                        ? "Sắp tới"
                        : "Đã kết thúc"}
                    </span>
                    <button
                      className="p-2 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                      onClick={() => handleViewSubmissions(assignment)}
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
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    </button>
                    <button
                      className="p-2 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                      onClick={() => {
                        setSelectedAssignment(assignment);
                        setEditData({
                          startTime: assignment.startTime
                            ? new Date(assignment.startTime)
                                .toISOString()
                                .slice(0, 16)
                            : "",
                          endTime: assignment.endTime
                            ? new Date(assignment.endTime)
                                .toISOString()
                                .slice(0, 16)
                            : "",
                          attemptLimit: assignment.attemptLimit || 1,
                          allowLateSubmission:
                            assignment.allowLateSubmission || false,
                        });
                        setEditError(null);
                        setShowEditModal(true);
                      }}
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
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                    </button>
                    <button
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      onClick={() => {
                        setSelectedAssignment(assignment);
                        setDeleteError(null);
                        setShowDeleteModal(true);
                      }}
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
            ))}
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
            <svg
              className="w-12 h-12 text-gray-400 mx-auto mb-3"
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
            <p className="text-gray-500 mb-4">
              Chưa có đề thi nào được giao cho lớp này
            </p>
            <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
              Giao đề thi đầu tiên
            </button>
          </div>
        )}
      </div>

      {/* Delete Assignment Modal */}
      {showDeleteModal && selectedAssignment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-xl">
            <div className="mb-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                <svg
                  className="w-6 h-6 text-red-600"
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
              </div>
              <h3 className="text-xl font-semibold text-gray-900 text-center mb-2">
                Xóa đề giao?
              </h3>
              <p className="text-sm text-gray-600 text-center">
                Bạn có chắc muốn xóa đề thi{" "}
                <span className="font-semibold">
                  {selectedAssignment.title}
                </span>{" "}
                khỏi lớp{" "}
                <span className="font-semibold">{classDetail.className}</span>?
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
                onClick={async () => {
                  try {
                    setIsDeleting(true);
                    setDeleteError(null);
                    const resp = await classApi.deleteAssignment(
                      classDetail.id,
                      selectedAssignment.assignmentId || selectedAssignment._id
                    );
                    if (resp.success) {
                      setShowDeleteModal(false);
                      setSelectedAssignment(null);
                      onUpdate();
                    } else {
                      setDeleteError(resp.error || "Không thể xóa đề giao");
                    }
                  } catch (e) {
                    setDeleteError("Đã xảy ra lỗi khi xóa");
                  } finally {
                    setIsDeleting(false);
                  }
                }}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <svg
                      className="w-4 h-4 animate-spin"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                      />
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

      {/* Edit Assignment Modal */}
      {showEditModal && selectedAssignment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-xl">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Chỉnh sửa đề giao
              </h3>
              <p className="text-sm text-gray-600">
                Cập nhật thời gian, số lần làm bài và chính sách nộp bài
              </p>
            </div>

            {editError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{editError}</p>
              </div>
            )}

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Thời gian bắt đầu
                </label>
                <input
                  type="datetime-local"
                  value={editData.startTime}
                  onChange={(e) =>
                    setEditData({ ...editData, startTime: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Thời gian kết thúc
                </label>
                <input
                  type="datetime-local"
                  value={editData.endTime}
                  onChange={(e) =>
                    setEditData({ ...editData, endTime: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số lần làm bài tối đa
                </label>
                <input
                  type="number"
                  min="1"
                  value={editData.attemptLimit}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      attemptLimit: parseInt(e.target.value) || 1,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="allowLate"
                  checked={editData.allowLateSubmission}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      allowLateSubmission: e.target.checked,
                    })
                  }
                  className="w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                />
                <label
                  htmlFor="allowLate"
                  className="text-sm font-medium text-gray-700"
                >
                  Cho phép nộp bài muộn
                </label>
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
                onClick={async () => {
                  try {
                    setIsEditing(true);
                    setEditError(null);
                    const payload = {
                      startTime: editData.startTime
                        ? new Date(editData.startTime).toISOString()
                        : selectedAssignment.startTime,
                      endTime: editData.endTime
                        ? new Date(editData.endTime).toISOString()
                        : selectedAssignment.endTime,
                      attemptLimit: editData.attemptLimit,
                      allowLateSubmission: editData.allowLateSubmission,
                    };
                    const resp = await classApi.updateAssignment(
                      classDetail.id,
                      selectedAssignment.assignmentId || selectedAssignment._id,
                      payload
                    );
                    if (resp.success) {
                      setShowEditModal(false);
                      setSelectedAssignment(null);
                      onUpdate();
                    } else {
                      setEditError(resp.error || "Không thể cập nhật đề giao");
                    }
                  } catch (e) {
                    setEditError("Đã xảy ra lỗi khi cập nhật");
                  } finally {
                    setIsEditing(false);
                  }
                }}
                disabled={isEditing}
                className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isEditing ? (
                  <>
                    <svg
                      className="w-4 h-4 animate-spin"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                      />
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

export default ClassAssignmentsView;
