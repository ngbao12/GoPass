"use client";

import React from "react";
import { TeacherClass } from "@/features/dashboard/types/teacher";
import { Badge } from "@/components/ui";
import { useDashboard } from "@/features/dashboard/context/DashboardContext";

interface ClassCardProps {
    classData: TeacherClass;
}

const ClassCard: React.FC<ClassCardProps> = ({ classData }) => {
    const { setActiveTab } = useDashboard();

    const handleViewDetails = () => {
        // TODO: Navigate to class details page or open modal
        console.log("View class details:", classData.id);
    };

    const getSubjectBadgeColor = (subject: string) => {
        switch (subject.toLowerCase()) {
            case "toán":
                return "bg-blue-100 text-blue-700";
            case "lý":
                return "bg-purple-100 text-purple-700";
            case "hóa":
                return "bg-green-100 text-green-700";
            case "anh":
                return "bg-orange-100 text-orange-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div onClick={handleViewDetails}>
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-900 mb-1">
                            {classData.name}
                        </h3>
                        <div className="flex items-center gap-2">
                            <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getSubjectBadgeColor(classData.subject)}`}>
                                {classData.subject}
                            </span>
                            <span className="text-sm text-gray-500">
                                {classData.grade}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-teal-600">
                            {classData.studentCount}
                        </div>
                        <div className="text-sm text-gray-600">Học sinh</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                            {classData.examCount}
                        </div>
                        <div className="text-sm text-gray-600">Đề thi</div>
                    </div>
                </div>

                {/* Description */}
                {classData.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {classData.description}
                    </p>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>Tạo: {new Date(classData.createdAt).toLocaleDateString("vi-VN")}</span>
                    <Badge variant="active">Đang hoạt động</Badge>
                </div>
            </div>
        </div>
    );
};

export default ClassCard;