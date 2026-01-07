"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui";
import { examApi } from "@/services/teacher";

interface CreateExamModalProps {
  onClose: () => void;
  onSubmit: (examData: any) => void;
}

const CreateExamModal: React.FC<CreateExamModalProps> = ({
  onClose,
  onSubmit,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedFileInfo, setUploadedFileInfo] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    subject: "",
    totalQuestions: "",
    durationMinutes: "",
    difficulty: "medium",
    showAnswers: false,
    mode: "practice_test",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const examData: any = {
        title: formData.title,
        description: formData.description,
        subject: formData.subject,
        durationMinutes: Number(formData.durationMinutes),
        mode: formData.mode,
        totalQuestions: Number(formData.totalQuestions) || 0,
        totalPoints: 10,
        shuffleQuestions: false,
        showResultsImmediately: formData.showAnswers,
        isPublished: false,
      };

      // Add file info if uploaded
      if (uploadedFileInfo) {
        examData.pdfFilePath = uploadedFileInfo.path;
        examData.pdfFileName = uploadedFileInfo.originalName;
      }

      await onSubmit(examData);

      // Reset form
      setFormData({
        title: "",
        description: "",
        subject: "",
        totalQuestions: "",
        durationMinutes: "",
        difficulty: "medium",
        showAnswers: false,
        mode: "practice_test",
      });
      setUploadedFile(null);
      setUploadedFileInfo(null);
      setCurrentStep(1);
    } catch (error) {
      console.error("Error creating exam:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Vui lòng chọn file PDF");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("File không được vượt quá 10MB");
      return;
    }

    setIsUploading(true);
    try {
      setUploadedFile(file);

      // Upload file to server
      const response = await examApi.uploadExamFile(file);
      if (response.success) {
        setUploadedFileInfo(response.data);
        console.log("File uploaded successfully:", response.data);
      } else {
        alert("Upload file thất bại");
        setUploadedFile(null);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Lỗi khi upload file");
      setUploadedFile(null);
    } finally {
      setIsUploading(false);
    }
  };

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  return (
    <>
      {/* Backdrop with blur */}
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden transform transition-all">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Tạo đề thi mới
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Bước {currentStep} / 4
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="flex items-center">
                {[1, 2, 3, 4].map((step) => (
                  <React.Fragment key={step}>
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                        step <= currentStep
                          ? "bg-teal-600 text-white"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {step}
                    </div>
                    {step < 4 && (
                      <div
                        className={`flex-1 h-1 mx-2 rounded transition-colors ${
                          step < currentStep ? "bg-teal-600" : "bg-gray-200"
                        }`}
                      />
                    )}
                  </React.Fragment>
                ))}
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span>Thông tin</span>
                <span>Upload đề</span>
                <span>Cấu hình</span>
                <span>Xác nhận</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <form
            onSubmit={handleSubmit}
            className="overflow-y-auto max-h-[calc(90vh-200px)]"
          >
            <div className="p-6">
              {/* Step 1: Basic Info */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tên đề thi <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      placeholder="VD: Đề thi thử THPT QG lần 1 - Toán"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Môn học <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({ ...formData, subject: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-gray-900"
                    >
                      <option value="" className="text-gray-500">
                        Chọn môn học
                      </option>
                      <option value="Toán" className="text-gray-900">
                        Toán
                      </option>
                      <option value="Ngữ Văn" className="text-gray-900">
                        Ngữ Văn
                      </option>
                      <option value="Tiếng Anh" className="text-gray-900">
                        Tiếng Anh
                      </option>
                      <option value="Vật Lý" className="text-gray-900">
                        Vật Lý
                      </option>
                      <option value="Hóa Học" className="text-gray-900">
                        Hóa Học
                      </option>
                      <option value="Sinh Học" className="text-gray-900">
                        Sinh Học
                      </option>
                      <option value="Lịch Sử" className="text-gray-900">
                        Lịch Sử
                      </option>
                      <option value="Địa Lý" className="text-gray-900">
                        Địa Lý
                      </option>
                      <option value="GDCD" className="text-gray-900">
                        GDCD
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mô tả đề thi
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      placeholder="Mô tả về đề thi, yêu cầu, mục tiêu..."
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all resize-none text-gray-900 placeholder-gray-500"
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Upload PDF */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="mb-4">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Upload đề thi PDF
                    </h3>
                    <p className="text-sm text-gray-500 mb-6">
                      Tải lên file PDF chứa đề thi của bạn
                    </p>

                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileUpload}
                        disabled={isUploading}
                        className="hidden"
                      />
                      <div
                        className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg transition-all shadow-md hover:shadow-lg ${
                          isUploading
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-teal-600 text-white hover:bg-teal-700"
                        }`}
                      >
                        {isUploading ? (
                          <>
                            <svg
                              className="animate-spin h-5 w-5 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Đang tải lên...
                          </>
                        ) : (
                          <>
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
                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                              />
                            </svg>
                            Chọn file PDF
                          </>
                        )}
                      </div>
                    </label>

                    <p className="mt-3 text-xs text-gray-500">
                      Định dạng: PDF | Dung lượng tối đa: 10MB
                    </p>
                  </div>

                  {uploadedFile && (
                    <div className="mt-6 bg-teal-50 border border-teal-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
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
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {uploadedFile.name}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setUploadedFile(null);
                            setUploadedFileInfo(null);
                          }}
                          className="flex-shrink-0 text-gray-400 hover:text-red-600 transition-colors"
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
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <div className="flex gap-3">
                      <svg
                        className="flex-shrink-0 w-5 h-5 text-amber-600"
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
                      <div className="text-sm text-amber-800">
                        <p className="font-medium mb-1">Lưu ý:</p>
                        <ul className="list-disc list-inside space-y-1 text-amber-700">
                          <li>File PDF nên có định dạng rõ ràng, dễ đọc</li>
                          <li>
                            Hệ thống sẽ lưu trữ file để học sinh có thể tải về
                          </li>
                          <li>
                            Bạn vẫn cần tạo câu hỏi thủ công trong hệ thống
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Configuration */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Số câu hỏi <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        required
                        min="1"
                        value={formData.totalQuestions}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            totalQuestions: e.target.value,
                          })
                        }
                        placeholder="50"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Thời gian (phút) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        required
                        min="1"
                        value={formData.durationMinutes}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            durationMinutes: e.target.value,
                          })
                        }
                        placeholder="90"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Độ khó
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { value: "easy", label: "Dễ", color: "green" },
                        {
                          value: "medium",
                          label: "Trung bình",
                          color: "orange",
                        },
                        { value: "hard", label: "Khó", color: "red" },
                      ].map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              difficulty: option.value,
                            })
                          }
                          className={`p-3 border rounded-lg text-sm font-medium transition-all ${
                            formData.difficulty === option.value
                              ? `border-${option.color}-500 bg-${option.color}-50 text-${option.color}-700`
                              : "border-gray-300 text-gray-700 hover:border-gray-400"
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={formData.showAnswers}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            showAnswers: e.target.checked,
                          })
                        }
                        className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Hiển thị đáp án sau khi hoàn thành
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {/* Step 4: Confirmation */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-xl p-6 border border-teal-100">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center">
                        <svg
                          className="w-6 h-6 text-white"
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
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-lg mb-2">
                          Xác nhận thông tin đề thi
                        </h4>
                        <p className="text-sm text-gray-600">
                          Vui lòng kiểm tra kỹ trước khi tạo đề thi
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-white border border-gray-200 rounded-lg p-5">
                      <h5 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
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
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        Thông tin cơ bản
                      </h5>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between items-start py-2 border-b border-gray-100">
                          <span className="text-gray-600">Tên đề thi:</span>
                          <span className="font-medium text-gray-900 text-right ml-4">
                            {formData.title}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="text-gray-600">Môn học:</span>
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                            {formData.subject}
                          </span>
                        </div>
                        {formData.description && (
                          <div className="py-2 border-b border-gray-100">
                            <span className="text-gray-600 block mb-1">
                              Mô tả:
                            </span>
                            <p className="text-gray-900 text-sm bg-gray-50 p-3 rounded">
                              {formData.description}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {uploadedFile && (
                      <div className="bg-white border border-gray-200 rounded-lg p-5">
                        <h5 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
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
                              d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                            />
                          </svg>
                          File đề thi
                        </h5>
                        <div className="flex items-center gap-3 bg-teal-50 p-4 rounded-lg">
                          <div className="flex-shrink-0 w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
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
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {uploadedFile.name}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="bg-white border border-gray-200 rounded-lg p-5">
                      <h5 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
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
                            d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                          />
                        </svg>
                        Cấu hình đề thi
                      </h5>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <span className="text-gray-600 block mb-2">
                            Số câu hỏi
                          </span>
                          <span className="font-semibold text-xl text-gray-900">
                            {formData.totalQuestions || 0}
                          </span>
                          <span className="text-gray-500 ml-1">câu</span>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <span className="text-gray-600 block mb-2">
                            Thời gian
                          </span>
                          <span className="font-semibold text-xl text-gray-900">
                            {formData.durationMinutes}
                          </span>
                          <span className="text-gray-500 ml-1">phút</span>
                        </div>
                      </div>
                      <div className="mt-4 space-y-2 text-sm">
                        <div className="flex items-center justify-between py-2">
                          <span className="text-gray-600">
                            Hiển thị đáp án:
                          </span>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              formData.showAnswers
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {formData.showAnswers ? "Có" : "Không"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-100 flex justify-between">
              <button
                type="button"
                onClick={currentStep === 1 ? onClose : prevStep}
                className="px-5 py-2.5 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                {currentStep === 1 ? "Hủy" : "Quay lại"}
              </button>

              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={
                    (currentStep === 1 &&
                      (!formData.title || !formData.subject)) ||
                    (currentStep === 3 &&
                      (!formData.totalQuestions || !formData.durationMinutes))
                  }
                  className="px-6 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium shadow-md hover:shadow-lg"
                >
                  Tiếp tục
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:bg-teal-400 disabled:cursor-not-allowed transition-colors font-medium shadow-md hover:shadow-lg flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Đang tạo...
                    </>
                  ) : (
                    <>
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
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Tạo đề thi
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateExamModal;
