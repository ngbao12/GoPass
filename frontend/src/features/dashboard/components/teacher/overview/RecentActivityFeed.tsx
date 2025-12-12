"use client";

import React from "react";
import { RecentActivity } from "../../types/teacher";

interface RecentActivityFeedProps {
    activities: RecentActivity[];
}

const RecentActivityFeed: React.FC<RecentActivityFeedProps> = ({ activities }) => {
    const formatTimeAgo = (timestamp: string) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

        if (diffInMinutes < 60) {
            return `${diffInMinutes} phút trước`;
        } else if (diffInMinutes < 1440) {
            return `${Math.floor(diffInMinutes / 60)} giờ trước`;
        } else {
            return `${Math.floor(diffInMinutes / 1440)} ngày trước`;
        }
    };

    const getActivityIcon = (type: RecentActivity['type']) => {
        switch (type) {
            case 'exam_completion':
                return (
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                );
            case 'student_joined':
                return (
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                    </div>
                );
            case 'exam_created':
                return (
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                );
            default:
                return (
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                );
        }
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg">
            <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">Hoạt động gần đây</h3>
                <p className="text-sm text-gray-600">Cập nhật các sự kiện trong hệ thống</p>
            </div>

            <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                {activities.map((activity) => (
                    <div key={activity.id} className="p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start gap-3">
                            {getActivityIcon(activity.type)}
                            <div className="flex-1">
                                <p className="text-sm text-gray-800 mb-1">{activity.message}</p>
                                <p className="text-xs text-gray-500">{formatTimeAgo(activity.timestamp)}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecentActivityFeed;