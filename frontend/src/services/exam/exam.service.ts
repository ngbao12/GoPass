import { getMockExamById } from "@/features/exam/data/mock-exam";
import { ExamWithDetails } from "@/features/exam/types";

export const examService = {
  /**
   * Lấy chi tiết đề thi theo ID
   * (Hiện tại Mock, sau này thay bằng gọi API thật)
   */
  getExamById: async (id: string): Promise<ExamWithDetails | null> => {
    // Giả lập độ trễ của mạng (Network delay) nếu muốn
    // await new Promise(resolve => setTimeout(resolve, 500));

    // Sau này thay dòng dưới bằng: const res = await httpClient.get(...)
    const data = getMockExamById(id);

    return data || null;
  },
};
