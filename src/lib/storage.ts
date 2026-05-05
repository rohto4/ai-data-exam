// === 基本型 ===
export type QuestionId = string;
export type SectionId = string;
export type ChapterId = string;

// === LocalStorage データ型 ===
export interface ProgressData {
  version: string;
  completedSections: CompletedSection[];
  lastAccessedAt: string;
}

export interface CompletedSection {
  sectionId: SectionId;
  completedAt: string;
  quizResults: QuizResult[];
}

export interface QuizResult {
  questionId: QuestionId;
  isCorrect: boolean;
  answeredAt: string;
  attempts: number;
}

export interface MistakeHistory {
  version: string;
  mistakes: MistakeItem[];
}

export interface MistakeItem {
  questionId: QuestionId;
  sectionId: SectionId;
  chapterId: ChapterId;
  wrongAnswerIndex: number;
  firstMistakeAt: string;
  totalAttempts: number;
  resolved: boolean;
  resolvedAt?: string;
}

export interface Settings {
  version: string;
  theme: "light" | "dark" | "system";
  quizDefaultCount: number;
  randomizeChoices: boolean;
}

// === データJSON型 ===
export interface Quiz {
  id: QuestionId;
  sectionId: SectionId;
  chapterId: ChapterId;
  question: string;
  choices: [string, string, string, string];
  correctIndex: number;
  explanation: string;
  difficulty: "easy" | "normal" | "hard";
  tags: string[];
}

export interface Section {
  id: SectionId;
  chapterId: ChapterId;
  title: string;
  content: string;
  order: number;
  quizCount: number;
}

export interface Chapter {
  id: ChapterId;
  title: string;
  description: string;
  order: number;
  sections: Section[];
}

// === エクスポート型 ===
export interface ExportData {
  version: string;
  exportedAt: string;
  appName: string;
  data: {
    progress: ProgressData;
    history: MistakeHistory;
    settings: Settings;
  };
}

// === Storage API インターフェース（実装はプロンプト3で行う）===
export interface StorageAPI {
  getProgress(): ProgressData;
  saveProgress(data: ProgressData): void;
  getHistory(): MistakeHistory;
  saveHistory(data: MistakeHistory): void;
  getSettings(): Settings;
  saveSettings(data: Settings): void;
  exportData(): ExportData;
  importData(data: unknown): void;
  clearAll(): void;
}
