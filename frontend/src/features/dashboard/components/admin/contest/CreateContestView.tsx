"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import SectionHeader from "@/components/ui/SectionHeader";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { ContestFormData } from "@/features/dashboard/types/contest";
import SubjectSelector from "./SubjectSelector";
import ContestPreview from "./ContestPreview";
import { contestAdminService } from "@/services/admin/contestAdmin.service";
import NotificationModal from "@/components/ui/NotificationModal";
import ConfirmModal from "@/components/ui/ConfirmModal";

interface SelectedExam {
  _id: string;
  title: string;
  subject: string;
  durationMinutes: number;
  totalQuestions: number;
  totalPoints: number;
  order: number;
  weight: number;
}

const CreateContestView: React.FC = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ContestFormData>({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    subjects: [],
    isPublic: true,
  });
  const [selectedExams, setSelectedExams] = useState<SelectedExam[]>([]);
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

  const handleInputChange = (
    field: keyof ContestFormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubjectsChange = (subjects: string[]) => {
    setFormData((prev) => ({
      ...prev,
      subjects,
    }));
  };

  const validateForm = (): string | null => {
    if (!formData.title.trim()) {
      return "Vui lòng nhập tên cuộc thi";
    }
    if (!formData.startDate) {
      return "Vui lòng chọn ngày bắt đầu";
    }
    if (!formData.endDate) {
      return "Vui lòng chọn ngày kết thúc";
    }
    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      return "Ngày kết thúc phải sau ngày bắt đầu";
    }
    if (selectedExams.length === 0) {
      return "Vui lòng thêm ít nhất một đề thi";
    }
    return null;
  };

  const handleCreateContest = async () => {
    const validationError = validateForm();
    if (validationError) {
      setNotification({
        isOpen: true,
        message: validationError,
        type: "warning",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        name: formData.title.trim(),
        description: formData.description.trim(),
        startTime: new Date(formData.startDate).toISOString(),
        endTime: new Date(formData.endDate).toISOString(),
        isPublic: formData.isPublic,
        exams: selectedExams.map((exam) => ({
          examId: exam._id,
          order: exam.order,
          weight: exam.weight,
        })),
      };

      const result = await contestAdminService.createContest(payload);

      if (result) {
        setNotification({
          isOpen: true,
          message: "Tạo cuộc thi thành công!",
          type: "success",
        });
        handleReset();
        // Optionally navigate to contest list or detail
        // router.push(`/dashboard/contests/${result._id}`);
      } else {
        setNotification({
          isOpen: true,
          message: "Có lỗi xảy ra khi tạo cuộc thi. Vui lòng thử lại.",
          type: "error",
        });
      }
    } catch (error: any) {
      console.error("Error creating contest:", error);
      setNotification({
        isOpen: true,
        message: error?.message || "Có lỗi xảy ra. Vui lòng thử lại.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      title: "",
      description: "",
      startDate: "",
      endDate: "",
      subjects: [],
      isPublic: true,
    });
    setSelectedExams([]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <SectionHeader
        title="Tạo cuộc thi mới"
        subtitle="Tổ chức cuộc thi cho toàn hệ thống"
      />

      {/* Form Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
            <svg
              className="w-6 h-6 text-teal-600"
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
          </div>
          <h2 className="text-lg font-semibold text-gray-900">
            Thông tin cuộc thi
          </h2>
        </div>

        <div className="space-y-5">
          {/* Contest Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tên cuộc thi <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              placeholder="Ví dụ: Olympic Toán Toàn Quốc 2025"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              fullWidth
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mô tả cuộc thi
            </label>
            <textarea
              placeholder="Mô tả chi tiết về cuộc thi, quy định, giải thưởng..."
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={4}
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Public/Private Toggle */}
          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isPublic}
                onChange={(e) =>
                  handleInputChange("isPublic", e.target.checked)
                }
                className="w-4 h-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
              />
              <span className="text-sm font-medium text-gray-700">
                Cuộc thi công khai (Public)
              </span>
            </label>
            <p className="text-sm text-gray-500 mt-1 ml-6">
              Cho phép tất cả học sinh tham gia cuộc thi
            </p>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ngày bắt đầu <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                value={formData.startDate}
                onChange={(e) => handleInputChange("startDate", e.target.value)}
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ngày kết thúc <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                value={formData.endDate}
                onChange={(e) => handleInputChange("endDate", e.target.value)}
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Subject Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Môn thi <span className="text-red-500">*</span>
            </label>
            <p className="text-sm text-gray-500 mb-3">
              Chọn đề thi cho từng môn học
            </p>
            <SubjectSelector
              selectedSubjects={formData.subjects}
              onSubjectsChange={handleSubjectsChange}
              selectedExams={selectedExams}
              onExamsChange={setSelectedExams}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
          <Button
            variant="secondary"
            onClick={handleReset}
            disabled={isSubmitting}
          >
            Đặt lại
          </Button>
          <Button
            variant="primary"
            onClick={handleCreateContest}
            disabled={isSubmitting}
            icon={
              isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
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
              )
            }
          >
            {isSubmitting ? "Đang tạo..." : "Tạo cuộc thi"}
          </Button>
        </div>
      </div>

      {/* Preview Section */}
      {(formData.title || selectedExams.length > 0) && (
        <div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
            <h3 className="text-sm font-medium text-purple-800 mb-1">
              Xem trước
            </h3>
            <p className="text-sm text-purple-700">
              Cuộc thi sẽ hiển thị như thế này với người dùng
            </p>
          </div>
          <ContestPreview formData={formData} selectedExams={selectedExams} />
        </div>
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

export default CreateContestView;
