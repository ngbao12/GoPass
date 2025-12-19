import React from "react";
import { Sparkles } from "lucide-react";

export function AdBanner() {
  return (
    <div className="bg-gradient-to-br from-[var(--gopass-primary)] to-[#008C7A] rounded-lg shadow-sm p-6 text-white">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-5 h-5" />
        <span className="text-sm opacity-90">Khóa học Premium</span>
      </div>

      <h3 className="mb-2">Luyện thi THPT Quốc Gia 2025</h3>

      <p className="text-sm opacity-90 mb-4">
        Học với giáo viên hàng đầu, nắm chắc kiến thức, tự tin đạt điểm cao
      </p>

      <ul className="text-sm space-y-1 mb-4 opacity-90">
        <li>✓ 100+ giờ video bài giảng</li>
        <li>✓ 500+ đề thi thử độc quyền</li>
        <li>✓ Chấm chữa chi tiết từng bài</li>
      </ul>

      <button className="w-full py-3 bg-white text-[var(--gopass-primary)] rounded-lg hover:bg-gray-50 transition-colors">
        Đăng ký ngay
      </button>

      <p className="text-xs text-center mt-3 opacity-75">
        Ưu đãi đặc biệt: Giảm 30% cho 100 học viên đầu tiên
      </p>
    </div>
  );
}
