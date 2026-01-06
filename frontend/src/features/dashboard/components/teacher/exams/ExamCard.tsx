"use client";

import React from "react";
import { TeacherClass } from "@/features/dashboard/types/teacher";
import { Badge } from "@/components/ui";
import { useDashboard } from "@/features/dashboard/context/DashboardContext";

interface ClassCardProps {
    classData: TeacherClass;
    featured?: boolean;
}

const ClassCard: React.FC<ClassCardProps> = ({ classData, featured = false }) => {
    const { setActiveTab } = useDashboard();

    const handleViewDetails = () => {
        console.log("View class details:", classData.id);
    };

    const getSubjectColor = (subject: string) => {
        switch (subject.toLowerCase()) {
            case "toán":
                return featured ? "from-teal-400 to-teal-500" : "bg-blue-100 text-blue-700";
            case "lý":
                return featured ? "from-purple-400 to-purple-500" : "bg-purple-100 text-purple-700";
            case "hóa":
                return featured ? "from-green-400 to-green-500" : "bg-green-100 text-green-700";
            case "anh":
                return featured ? "from-orange-400 to-orange-500" : "bg-orange-100 text-orange-700";
            default:
                return featured ? "from-gray-400 to-gray-500" : "bg-gray-100 text-gray-700";
        }
    };

    return (
        <div
            className={`${featured
                    ? `bg-gradient-to-br ${getSubjectColor(classData.subject)} text-white`
                    : "bg-white border border-gray-200"
                } rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer relative`}
            onClick={handleViewDetails}
        >
            {/* Featured Star */}
            {featured && (
                <div className="absolute top-4 right-4">
                    <svg className="w-6 h-6 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                </div>
            )}

            {/* Header */}
            <div className="flex items-start justify-between mb-4 pr-8">
                <div className="flex-1">
                    <h3 className={`font-semibold text-lg mb-2 ${featured ? "text-white" : "text-gray-900"}`}>
                        {classData.name}
                    </h3>
                    <div className="flex items-center gap-2 mb-2">
                        {featured ? (
                            <span className="text-white/90 text-sm font-medium">
                                {classData.subject}
                            </span>
                        ) : (
                            <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getSubjectColor(classData.subject)}`}>
                                {classData.subject}
                            </span>
                        )}
                        <span className={`text-sm ${featured ? "text-white/80" : "text-gray-500"}`}>
                            {classData.grade}
                        </span>
                    </div>
                    {classData.description && (
                        <p className={`text-sm ${featured ? "text-white/80" : "text-gray-600"} mb-3 line-clamp-2`}>
                            {classData.description}
                        </p>
                    )}
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div className={`text-center p-3 rounded-lg ${featured ? "bg-white/20" : "bg-gray-50"}`}>
                    <div className={`text-xl font-bold ${featured ? "text-white" : "text-teal-600"}`}>
                        {classData.studentCount}
                    </div>
                    <div className={`text-sm ${featured ? "text-white/80" : "text-gray-600"}`}>Học sinh</div>
                </div>
                <div className={`text-center p-3 rounded-lg ${featured ? "bg-white/20" : "bg-gray-50"}`}>
                    <div className={`text-xl font-bold ${featured ? "text-white" : "text-blue-600"}`}>
                        {classData.examCount}
                    </div>
                    <div className={`text-sm ${featured ? "text-white/80" : "text-gray-600"}`}>Đề thi</div>
                </div>
            </div>

            {/* Footer */}
            <div className={`flex items-center justify-between text-sm ${featured ? "text-white/70" : "text-gray-500"}`}>
                <span>
                    {featured ? classData.subject.toUpperCase() + "2025" : new Date(classData.createdAt).toLocaleDateString("vi-VN")}
                </span>
                {!featured && <Badge variant="active">Đang hoạt động</Badge>}
            </div>
        </div>
    );
};

export default ClassCard;