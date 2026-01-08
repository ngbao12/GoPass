"use client";

import React, { useState, useEffect } from "react";
import {
  Contest,
  contestAdminService,
} from "@/services/admin/contestAdmin.service";
import NotificationModal from "@/components/ui/NotificationModal";
import ConfirmModal from "@/components/ui/ConfirmModal";

interface EditContestModalProps {
  isOpen: boolean;
  onClose: () => void;
  contestId: string;
  onSuccess: () => void;
}

const EditContestModalProps: React.FC<EditContestModalProps> = ({
  isOpen,
  onClose,
  contestId,
  onSuccess,
}) => {
  const [contest, setContest] = useState<Contest | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    startTime: "",
    endTime: "",
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

  useEffect(() => {
    if (isOpen && contestId) {
      fetchContestDetail();
    }
  }, [isOpen, contestId]);

  const fetchContestDetail = async () => {
    setLoading(true);
    try {
      const data = await contestAdminService.getContestById(contestId);
      if (data) {
        setContest(data);
        // Convert to datetime-local format
        setFormData({
          startTime: new Date(data.startTime).toISOString().slice(0, 16),
          endTime: new Date(data.endTime).toISOString().slice(0, 16),
        });
      }
    } catch (error) {
      console.error("Error fetching contest:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate
    const start = new Date(formData.startTime);
    const end = new Date(formData.endTime);

    if (end <= start) {
      setNotification({
        isOpen: true,
        message: "Thời gian kết thúc phải sau thời gian bắt đầu",
        type: "warning",
      });
      return;
    }

    setSaving(true);
    try {
      await contestAdminService.updateContest(contestId, {
        startTime: start.toISOString(),
        endTime: end.toISOString(),
      });
      setNotification({
        isOpen: true,
        message: "Cập nhật thời gian cuộc thi thành công!",
        type: "success",
      });
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error updating contest:", error);
      setNotification({
        isOpen: true,
        message: "Có lỗi xảy ra khi cập nhật cuộc thi",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            Chỉnh sửa cuộc thi
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600"></div>
            </div>
          ) : contest ? (
            <div className="space-y-6">
              {/* Contest Name (Read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên cuộc thi
                </label>
                <input
                  type="text"
                  value={contest.name}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                />
              </div>

              {/* Start Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Thời gian bắt đầu *
                </label>
                <input
                  type="datetime-local"
                  value={formData.startTime}
                  onChange={(e) =>
                    setFormData({ ...formData, startTime: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              {/* End Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Thời gian kết thúc *
                </label>
                <input
                  type="datetime-local"
                  value={formData.endTime}
                  onChange={(e) =>
                    setFormData({ ...formData, endTime: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              {/* Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex gap-3">
                  <svg
                    className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Lưu ý:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Thời gian kết thúc phải sau thời gian bắt đầu</li>
                      <li>
                        Chỉ có thể chỉnh sửa thời gian, không thể sửa tên và mô
                        tả
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">Không tìm thấy thông tin cuộc thi</p>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={saving || loading}
              className="px-5 py-2.5 rounded-lg bg-teal-600 text-white font-medium hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>
        </form>

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
    </div>
  );
};

export default EditContestModalProps;
