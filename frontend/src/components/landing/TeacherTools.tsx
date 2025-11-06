export default function TeacherTools() {
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-6">
                <div className="flex items-center gap-12">
                    <div className="w-1/2 space-y-6">
                        <h2 className="text-4xl font-bold text-gray-800">Tạo đề thi tự động cho giáo viên</h2>
                        <p className="text-gray-600 text-lg">Công cụ hỗ trợ giáo viên tạo đề thi nhanh chóng và hiệu quả</p>

                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold text-gray-800">Tạo đề thi chỉ trong vài phút</h3>
                            <p className="text-gray-600">Giáo viên có thể tạo đề thi dựa trên các tiêu chí được đặt trước</p>

                            <div className="space-y-3">
                                <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">📝</div>
                                    <span className="text-gray-800 font-medium">Chọn chủ đề và mức độ</span>
                                </div>

                                <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">⚙️</div>
                                    <span className="text-gray-800 font-medium">Tạo tự động</span>
                                </div>

                                <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                                    <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs">📊</div>
                                    <span className="text-gray-800 font-medium">Giám sát kết quả</span>
                                </div>

                                <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                                    <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs">📈</div>
                                    <span className="text-gray-800 font-medium">Phân tích kết quả</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-1/2">
                        <div className="bg-white rounded-2xl shadow-xl p-2">
                            <img
                                src="./images/teacher-teaching.png"
                                alt="Student studying"
                                className="rounded-xl w-full h-auto"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}