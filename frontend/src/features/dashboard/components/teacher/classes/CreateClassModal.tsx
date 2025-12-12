"use client";

import React, { useState } from "react";
import { Button, Input } from "@/components/ui";

interface CreateClassModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (classData: any) => void;
}

const CreateClassModal: React.FC<CreateClassModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
}) => {
    const [formData, setFormData] = useState({
        name: "",
        subject: "",
        grade: "",
        description: "",
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const subjects = ["Toán", "Lý", "Hóa", "Sinh", "Anh", "Văn", "Sử", "Địa"];
    const grades = ["10", "11", "12"];

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.name.trim()) {
            newErrors.name = "Tên lớp học là bắt buộc";
        }

        if (!formData.subject) {
            newErrors.subject = "Vui lòng chọn môn học";
        }

        if (!formData.grade) {
            newErrors.grade = "Vui lòng chọn khối lớp";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            onSubmit({
                ...formData,
                id: Date.now().toString(), // Temporary ID
                studentCount: 0,
                examCount: 0,
                createdAt: new Date().toISOString(),
            });
            setFormData({ name: "", subject: "", grade: "", description: "" });
            setErrors({});
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: "" }));
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">
                        Tạo lớp học mới
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        ✕
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Class Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tên lớp học *
                        </label>
                        <Input
                            type="text"
                            placeholder="VD: Lớp 12A1 - Toán"
                            value={formData.name}
                            onChange={(e) => handleInputChange("name", e.target.value)}
                            className={errors.name ? "border-red-500" : ""}
                        />
                        {errors.name && (
                            <p className="text-sm text-red-500 mt-1">{errors.name}</p>
                        )}
                    </div>

                    {/* Subject */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Môn học *
                        </label>
                        <select
                            value={formData.subject}
                            onChange={(e) => handleInputChange("subject", e.target.value)}
                            className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${errors.subject ? "border-red-500" : ""
                                }`}
                        >
                            <option value="">Chọn môn học</option>
                            {subjects.map((subject) => (
                                <option key={subject} value={subject}>
                                    {subject}
                                </option>
                            ))}
                        </select>
                        {errors.subject && (
                            <p className="text-sm text-red-500 mt-1">{errors.subject}</p>
                        )}
                    </div>

                    {/* Grade */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Khối lớp *
                        </label>
                        <select
                            value={formData.grade}
                            onChange={(e) => handleInputChange("grade", e.target.value)}
                            className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${errors.grade ? "border-red-500" : ""
                                }`}
                        >
                            <option value="">Chọn khối lớp</option>
                            {grades.map((grade) => (
                                <option key={grade} value={grade}>
                                    Lớp {grade}
                                </option>
                            ))}
                        </select>
                        {errors.grade && (
                            <p className="text-sm text-red-500 mt-1">{errors.grade}</p>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Mô tả (Tùy chọn)
                        </label>
                        <textarea
                            placeholder="Mô tả về lớp học..."
                            value={formData.description}
                            onChange={(e) => handleInputChange("description", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                            rows={3}
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={onClose}
                            className="flex-1"
                        >
                            Hủy
                        </Button>
                        <Button type="submit" variant="primary" className="flex-1">
                            Tạo lớp học
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateClassModal;