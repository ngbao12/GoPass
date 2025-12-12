"use client";

import React, { useState } from "react";
import { Button, Input } from "@/components/ui";
import { mockTeacherData } from "@/features/dashboard/data/mock-teacher";

interface AssignExamModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
}

const AssignExamModal: React.FC<AssignExamModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
}) => {
    const [selectedClasses, setSelectedClasses] = useState<string[]>([]);

    const classes = mockTeacherData.classes;

    const handleClassToggle = (classId: string) => {
        setSelectedClasses(prev =>
            prev.includes(classId)
                ? prev.filter(id => id !== classId)
                : [...prev, classId]
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedClasses.length === 0) return;

        onSubmit({
            classIds: selectedClasses,
            assignedAt: new Date().toISOString(),
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">
                        Gán đề thi cho lớp
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Chọn lớp học
                        </label>
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                            {classes.map((classItem) => (
                                <label
                                    key={classItem.id}
                                    className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedClasses.includes(classItem.id)}
                                        onChange={() => handleClassToggle(classItem.id)}
                                        className="rounded border-gray-300 text-teal-600 focus:ring-teal-500 mr-3"
                                    />
                                    <div className="flex-1">
                                        <div className="font-medium text-gray-900">
                                            {classItem.name}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {classItem.studentCount} học sinh
                                        </div>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={onClose}
                            className="flex-1"
                        >
                            Hủy
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            className="flex-1"
                            disabled={selectedClasses.length === 0}
                        >
                            Gán đề thi
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AssignExamModal;