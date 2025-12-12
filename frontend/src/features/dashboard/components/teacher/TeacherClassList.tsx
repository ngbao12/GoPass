"use client";

import React from "react";
import { Badge } from "@/components/ui";
import { TeacherClass } from "../../types/teacher";

interface TeacherClassListProps {
    classes: TeacherClass[];
}

const TeacherClassList: React.FC<TeacherClassListProps> = ({ classes }) => {
    return (
        <div className="bg-white border border-gray-200 rounded-lg">
            <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-800">Lớp học của tôi</h3>
                    <Badge className="bg-blue-100 text-blue-700">
                        {classes.length} lớp
                    </Badge>
                </div>
            </div>

            <div className="divide-y divide-gray-200">
                {classes.map((classItem) => (
                    <div key={classItem.id} className="p-6 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h4 className="font-semibold text-gray-800">{classItem.name}</h4>
                                    <Badge className="bg-teal-100 text-teal-700">
                                        {classItem.subject}
                                    </Badge>
                                </div>
                                <div className="flex items-center gap-6 text-sm text-gray-600">
                                    <span className="flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        {classItem.studentCount} học sinh
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        {classItem.examCount} đề thi
                                    </span>
                                </div>
                            </div>

                            <button className="px-4 py-2 text-sm text-teal-600 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors">
                                Xem chi tiết →
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TeacherClassList;