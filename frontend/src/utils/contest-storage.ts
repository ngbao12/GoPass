// src/utils/contest-storage.ts

const STORAGE_KEY_PREFIX = "contest_progress_";

export interface ContestProgressMap {
  [examId: string]: "ready" | "ongoing" | "completed" | "locked";
}

// 1. Lấy tiến độ từ LocalStorage
export const getContestProgress = (contestId: string): ContestProgressMap => {
  if (typeof window === "undefined") return {}; // Guard cho Server Side Rendering

  try {
    const data = localStorage.getItem(STORAGE_KEY_PREFIX + contestId);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error("Error reading contest progress", error);
    return {};
  }
};

export const updateExamStatus = (
  contestId: string,
  examId: string,
  status: "ongoing" | "completed"
) => {
  if (typeof window === "undefined") return;

  try {
    const currentProgress = getContestProgress(contestId);

    // Logic: Nếu đã completed thì không cho revert về ongoing
    if (currentProgress[examId] === "completed" && status === "ongoing") {
      return;
    }

    const newProgress = {
      ...currentProgress,
      [examId]: status,
    };

    localStorage.setItem(
      STORAGE_KEY_PREFIX + contestId,
      JSON.stringify(newProgress)
    );
  } catch (error) {
    // Bắt lỗi nếu Storage bị đầy hoặc bị hỏng để App không bị crash
    console.error("Error saving contest progress", error);
  }
};

// 3. Xóa status của một exam khỏi localStorage (khi admin xóa submission)
export const clearExamStatus = (contestId: string, examId: string) => {
  if (typeof window === "undefined") return;

  try {
    const currentProgress = getContestProgress(contestId);
    const newProgress = { ...currentProgress };
    delete newProgress[examId];

    localStorage.setItem(
      STORAGE_KEY_PREFIX + contestId,
      JSON.stringify(newProgress)
    );
  } catch (error) {
    console.error("Error clearing exam status", error);
  }
};

// 4. Sync localStorage với server data (xóa những status không còn đúng)
export const syncContestProgress = (
  contestId: string,
  serverStatuses: { examId: string; status: string }[]
) => {
  if (typeof window === "undefined") return;

  try {
    const currentProgress = getContestProgress(contestId);
    const newProgress: ContestProgressMap = {};

    // Chỉ giữ lại những status "ongoing" nếu server chưa completed
    serverStatuses.forEach(({ examId, status }) => {
      if (status === "completed") {
        newProgress[examId] = "completed";
      } else if (currentProgress[examId] === "ongoing") {
        newProgress[examId] = "ongoing";
      }
      // Không lưu những status khác (ready, locked) vì sẽ tính từ server
    });

    localStorage.setItem(
      STORAGE_KEY_PREFIX + contestId,
      JSON.stringify(newProgress)
    );
  } catch (error) {
    console.error("Error syncing contest progress", error);
  }
};
