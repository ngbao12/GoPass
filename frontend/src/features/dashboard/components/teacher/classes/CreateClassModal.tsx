"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui";

interface CreateClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (classData: any) => void;
}

// Generate a random class code: 10 chars, uppercase, alphanumeric
const generateClassCode = (): string => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 10; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

const CreateClassModal: React.FC<CreateClassModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState({
    className: "",
    description: "",
    classCode: generateClassCode(),
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.className.trim()) {
      newErrors.className = "Tên lớp học là bắt buộc";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Transform field names to match API expectations
      const classDataToSubmit = {
        className: formData.className,
        description: formData.description,
        classCode: formData.classCode,
        requireApproval: true, // Default value
      };

      await onSubmit(classDataToSubmit);
      // Reset form after successful submission
      setFormData({
        className: "",
        description: "",
        classCode: generateClassCode(),
      });
      setErrors({});
    } catch (error) {
      console.error("Error creating class:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegenerateCode = () => {
    setFormData({ ...formData, classCode: generateClassCode() });
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop with blur */}
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" onClick={onClose} />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Tạo lớp học mới</h2>
                <p className="text-sm text-gray-500 mt-1">Tạo và quản lý lớp học của bạn</p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Class Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên lớp học <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.className}
                onChange={(e) => {
                  setFormData({ ...formData, className: e.target.value });
                  if (errors.className) setErrors({ ...errors, className: "" });
                }}
                placeholder="VD: Lớp 12A1 - THPT Nguyễn Huệ"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-500 ${
                  errors.className ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.className && (
                <p className="text-red-500 text-sm mt-1">{errors.className}</p>
              )}
            </div>

            {/* Class Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mã lớp học <span className="text-gray-500">(Tự động)</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  disabled
                  value={formData.classCode}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 font-mono font-semibold"
                />
                <button
                  type="button"
                  onClick={handleRegenerateCode}
                  disabled={isSubmitting}
                  className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Tạo mã mới"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">Mã lớp dùng để học sinh tham gia. Bạn có thể tạo mã mới nếu cần.</p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mô tả lớp học
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Mô tả về lớp học, mục tiêu, yêu cầu..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all resize-none text-gray-900 placeholder-gray-500"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                className="flex-1"
                disabled={isSubmitting}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                variant="primary"
                className="flex-1 bg-teal-600 hover:bg-teal-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Đang tạo...
                  </div>
                ) : (
                  "Tạo lớp học"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateClassModal;