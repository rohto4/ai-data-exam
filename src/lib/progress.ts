import { createStorageAPI, CompletedSection } from "./storage";

const api = createStorageAPI();

// === 進捗計算ユーティリティ ===

export interface ProgressStats {
  totalSections: number;
  textRead: number;
  quizCompleted: number;
  quizReviewed: number;
  textProgress: number;
  quizProgress: number;
  reviewProgress: number;
}

export interface ChapterProgress {
  chapterId: string;
  totalSections: number;
  textRead: number;
  quizCompleted: number;
  quizReviewed: number;
  textProgress: number;
  quizProgress: number;
  reviewProgress: number;
}

export interface SectionProgress {
  sectionId: string;
  status: "unread" | "read" | "in_progress" | "quiz_done" | "reviewed";
  textRead: boolean;
  quizCompleted: boolean;
  quizReviewed: boolean;
  lastActivity?: string;
}

// 全体進捗を計算
export function calculateOverallProgress(totalSections: number): ProgressStats {
  const progress = api.getProgress();
  
  const textRead = progress.completedSections.filter((cs) => cs.textRead).length;
  const quizCompleted = progress.completedSections.filter((cs) => cs.quizCompleted).length;
  const quizReviewed = progress.completedSections.filter((cs) => cs.quizReviewed).length;

  return {
    totalSections,
    textRead,
    quizCompleted,
    quizReviewed,
    textProgress: Math.round((textRead / totalSections) * 100),
    quizProgress: Math.round((quizCompleted / totalSections) * 100),
    reviewProgress: Math.round((quizReviewed / totalSections) * 100),
  };
}

// 章ごとの進捗を計算
export function calculateChapterProgress(
  chapterId: string,
  sectionIds: string[]
): ChapterProgress {
  const progress = api.getProgress();
  const totalSections = sectionIds.length;

  const chapterSections = progress.completedSections.filter((cs) =>
    sectionIds.includes(cs.sectionId)
  );

  const textRead = chapterSections.filter((cs) => cs.textRead).length;
  const quizCompleted = chapterSections.filter((cs) => cs.quizCompleted).length;
  const quizReviewed = chapterSections.filter((cs) => cs.quizReviewed).length;

  return {
    chapterId,
    totalSections,
    textRead,
    quizCompleted,
    quizReviewed,
    textProgress: Math.round((textRead / totalSections) * 100),
    quizProgress: Math.round((quizCompleted / totalSections) * 100),
    reviewProgress: Math.round((quizReviewed / totalSections) * 100),
  };
}

// 節の進捗状態を取得
export function getSectionProgress(sectionId: string): SectionProgress {
  const progress = api.getProgress();
  const section = progress.completedSections.find((cs) => cs.sectionId === sectionId);

  if (!section) {
    return {
      sectionId,
      status: "unread",
      textRead: false,
      quizCompleted: false,
      quizReviewed: false,
    };
  }

  let status: SectionProgress["status"] = "unread";
  if (section.quizReviewed) {
    status = "reviewed";
  } else if (section.quizCompleted) {
    status = "quiz_done";
  } else if (section.textRead) {
    status = "in_progress";
  }

  // 最終アクティビティを計算
  const timestamps = [
    section.textReadAt,
    section.quizCompletedAt,
    section.quizReviewedAt,
  ].filter(Boolean) as string[];
  
  const lastActivity = timestamps.length > 0
    ? timestamps.sort().reverse()[0]
    : undefined;

  return {
    sectionId,
    status,
    textRead: section.textRead,
    quizCompleted: section.quizCompleted,
    quizReviewed: section.quizReviewed,
    lastActivity,
  };
}

// 教本を読了としてマーク
export function markTextAsRead(sectionId: string): void {
  const progress = api.getProgress();
  const existingIndex = progress.completedSections.findIndex(
    (cs) => cs.sectionId === sectionId
  );

  if (existingIndex >= 0) {
    progress.completedSections[existingIndex].textRead = true;
    progress.completedSections[existingIndex].textReadAt = new Date().toISOString();
  } else {
    progress.completedSections.push({
      sectionId,
      textRead: true,
      textReadAt: new Date().toISOString(),
      quizCompleted: false,
      quizResults: [],
      quizReviewed: false,
    });
  }

  api.saveProgress(progress);
}

// クイズを完了としてマーク
export function markQuizAsCompleted(
  sectionId: string,
  quizResults: CompletedSection["quizResults"]
): void {
  const progress = api.getProgress();
  const existingIndex = progress.completedSections.findIndex(
    (cs) => cs.sectionId === sectionId
  );

  if (existingIndex >= 0) {
    progress.completedSections[existingIndex].quizCompleted = true;
    progress.completedSections[existingIndex].quizCompletedAt = new Date().toISOString();
    progress.completedSections[existingIndex].quizResults = quizResults;
  } else {
    progress.completedSections.push({
      sectionId,
      textRead: false,
      quizCompleted: true,
      quizCompletedAt: new Date().toISOString(),
      quizResults,
      quizReviewed: false,
    });
  }

  api.saveProgress(progress);
}

// 復習を完了としてマーク
export function markReviewAsCompleted(sectionId: string): void {
  const progress = api.getProgress();
  const existingIndex = progress.completedSections.findIndex(
    (cs) => cs.sectionId === sectionId
  );

  if (existingIndex >= 0) {
    progress.completedSections[existingIndex].quizReviewed = true;
    progress.completedSections[existingIndex].quizReviewedAt = new Date().toISOString();
  } else {
    progress.completedSections.push({
      sectionId,
      textRead: false,
      quizCompleted: false,
      quizResults: [],
      quizReviewed: true,
      quizReviewedAt: new Date().toISOString(),
    });
  }

  api.saveProgress(progress);
}

// 次に学習すべき節を取得
export function getNextLearningSection(chapterSections: string[]): string | null {
  const progress = api.getProgress();

  // 未読の節を探す
  for (const sectionId of chapterSections) {
    const section = progress.completedSections.find((cs) => cs.sectionId === sectionId);
    if (!section || !section.textRead) {
      return sectionId;
    }
  }

  // すべて読了済みなら最初の節を返す
  return chapterSections[0] || null;
}

// 学習時間の統計
export function getLearningStats(): {
  totalSectionsStarted: number;
  totalSectionsCompleted: number;
  totalQuizzesTaken: number;
  averageQuizScore: number;
} {
  const progress = api.getProgress();
  
  const startedSections = progress.completedSections.filter(
    (cs) => cs.textRead || cs.quizCompleted
  );
  
  const completedSections = progress.completedSections.filter(
    (cs) => cs.quizCompleted
  );

  const allQuizResults = progress.completedSections.flatMap((cs) => cs.quizResults);
  const totalQuizzes = allQuizResults.length;
  const correctQuizzes = allQuizResults.filter((r) => r.isCorrect).length;
  const averageScore = totalQuizzes > 0 ? Math.round((correctQuizzes / totalQuizzes) * 100) : 0;

  return {
    totalSectionsStarted: startedSections.length,
    totalSectionsCompleted: completedSections.length,
    totalQuizzesTaken: totalQuizzes,
    averageQuizScore: averageScore,
  };
}
