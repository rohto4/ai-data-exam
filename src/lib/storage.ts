// === 基本型 ===
export type QuestionId = string;
export type SectionId = string;
export type ChapterId = string;

// === LocalStorage データ型（Phase 2: 3ステップ進捗対応）===
export interface ProgressData {
  version: "2.0"; // Phase 2でバージョンアップ
  completedSections: CompletedSection[];
  lastAccessedAt: string;
}

// 3ステップ進捗: テキスト読了 / クイズ完了 / 復習完了
export interface CompletedSection {
  sectionId: SectionId;
  // ステップ1: 教本読了
  textRead: boolean;
  textReadAt?: string;
  // ステップ2: クイズ完了
  quizCompleted: boolean;
  quizCompletedAt?: string;
  quizResults: QuizResult[];
  // ステップ3: 復習完了
  quizReviewed: boolean;
  quizReviewedAt?: string;
}

export interface QuizResult {
  questionId: QuestionId;
  isCorrect: boolean;
  answeredAt: string;
  attempts: number;
}

export interface MistakeHistory {
  version: "2.0";
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
  // Phase 2: 復習完了フラグ（復習モードで使用）
  reviewed: boolean;
  reviewedAt?: string;
}

// Phase 2: ダークモード撤廃、theme削除
export interface Settings {
  version: "2.0";
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
  content: string; // Phase 2: 大幅に拡充（2000〜3000文字）
  order: number;
  quizCount: number;
}

// Phase 2: 参考文献・出典情報を追加
export interface Reference {
  title: string;
  url: string;
  section?: string; // 章や節の指定（任意）
}

export interface Chapter {
  id: ChapterId;
  title: string;
  description: string;
  order: number;
  sections: Section[];
  references: Reference[]; // Phase 2: 出典リンク
}

export interface Syllabus {
  version: string;
  title: string;
  description: string;
  chapters: Chapter[];
}

// === エクスポート型 ===
export interface ExportData {
  version: "2.0";
  exportedAt: string;
  appName: string;
  data: {
    progress: ProgressData;
    history: MistakeHistory;
    settings: Settings;
  };
}

// === Storage API インターフェース ===
export interface StorageAPI {
  // 進捗データ
  getProgress(): ProgressData;
  saveProgress(data: ProgressData): void;
  
  // 誤答履歴
  getHistory(): MistakeHistory;
  saveHistory(data: MistakeHistory): void;
  
  // 設定
  getSettings(): Settings;
  saveSettings(data: Settings): void;
  
  // エクスポート/インポート
  exportData(): ExportData;
  importData(data: unknown): void;
  
  // 全削除
  clearAll(): void;
  
  // Phase 2: データマイグレーション
  migrateFromV1(): ProgressData | null;
}

// === LocalStorage キー ===
const KEYS = {
  PROGRESS: "ai-exam-progress",
  HISTORY: "ai-exam-history",
  SETTINGS: "ai-exam-settings",
};

// === デフォルト値 ===
const DEFAULT_PROGRESS: ProgressData = {
  version: "2.0",
  completedSections: [],
  lastAccessedAt: new Date().toISOString(),
};

const DEFAULT_HISTORY: MistakeHistory = {
  version: "2.0",
  mistakes: [],
};

const DEFAULT_SETTINGS: Settings = {
  version: "2.0",
  quizDefaultCount: 10,
  randomizeChoices: true,
};

// === ユーティリティ関数 ===
function safeJsonParse<T>(json: string | null, defaultValue: T): T {
  if (!json) return defaultValue;
  try {
    return JSON.parse(json) as T;
  } catch {
    console.error("JSONパースエラー。デフォルト値を使用します。");
    return defaultValue;
  }
}

function safeLocalStorageGet(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    console.error(`LocalStorage読み込みエラー: ${key}`);
    return null;
  }
}

function safeLocalStorageSet(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    console.error(`LocalStorage書き込みエラー: ${key}`);
  }
}

function safeLocalStorageRemove(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    console.error(`LocalStorage削除エラー: ${key}`);
  }
}

// === Storage API 実装 ===
export function createStorageAPI(): StorageAPI {
  return {
    // 進捗データの取得
    getProgress(): ProgressData {
      const data = safeLocalStorageGet(KEYS.PROGRESS);
      const parsed = safeJsonParse<ProgressData>(data, DEFAULT_PROGRESS);
      
      // バージョンチェックとマイグレーション
      if (parsed.version !== "2.0") {
        console.warn("旧バージョンのデータを検出。マイグレーションが必要です。");
        // マイグレーションを実行して返す
        const migrated = this.migrateFromV1();
        return migrated ? migrated : DEFAULT_PROGRESS;
      }
      
      parsed.lastAccessedAt = new Date().toISOString();
      return parsed;
    },

    // 進捗データの保存
    saveProgress(data: ProgressData): void {
      const dataToSave = {
        ...data,
        lastAccessedAt: new Date().toISOString(),
      };
      safeLocalStorageSet(KEYS.PROGRESS, JSON.stringify(dataToSave));
    },

    // 誤答履歴の取得
    getHistory(): MistakeHistory {
      const data = safeLocalStorageGet(KEYS.HISTORY);
      const parsed = safeJsonParse<MistakeHistory>(data, DEFAULT_HISTORY);
      
      // バージョンチェック
      if (parsed.version !== "2.0") {
        // 履歴はマイグレーション不要（新しいフィールドはデフォルト値で動作）
        return { ...DEFAULT_HISTORY, mistakes: parsed.mistakes || [] };
      }
      
      return parsed;
    },

    // 誤答履歴の保存
    saveHistory(data: MistakeHistory): void {
      safeLocalStorageSet(KEYS.HISTORY, JSON.stringify(data));
    },

    // 設定の取得
    getSettings(): Settings {
      const data = safeLocalStorageGet(KEYS.SETTINGS);
      const parsed = safeJsonParse<Settings>(data, DEFAULT_SETTINGS);
      
      // バージョンチェック（theme削除対応）
      if ((parsed as any).theme !== undefined) {
        // 旧バージョン: themeを削除して返す
        const { theme, ...rest } = parsed as any;
        return { ...DEFAULT_SETTINGS, ...rest };
      }
      
      return parsed;
    },

    // 設定の保存
    saveSettings(data: Settings): void {
      safeLocalStorageSet(KEYS.SETTINGS, JSON.stringify(data));
    },

    // データのエクスポート
    exportData(): ExportData {
      return {
        version: "2.0",
        exportedAt: new Date().toISOString(),
        appName: "ai-data-exam",
        data: {
          progress: this.getProgress(),
          history: this.getHistory(),
          settings: this.getSettings(),
        },
      };
    },

    // データのインポート
    importData(data: unknown): void {
      // バリデーション
      if (!data || typeof data !== "object") {
        throw new Error("無効なデータ形式です。");
      }

      const exportData = data as Partial<ExportData>;

      // バージョンチェック
      if (exportData.version !== "2.0") {
        throw new Error(`未対応のデータバージョンです: ${exportData.version}。エクスポートし直してください。`);
      }

      // データ構造の検証
      if (!exportData.data || typeof exportData.data !== "object") {
        throw new Error("データ構造が不正です。");
      }

      const { progress, history, settings } = exportData.data;

      // 各データの存在チェック
      if (!progress || !history || !settings) {
        throw new Error("必要なデータが不足しています。");
      }

      // バリデーション成功後、一括で保存（トランザクション的動作）
      try {
        this.saveProgress(progress as ProgressData);
        this.saveHistory(history as MistakeHistory);
        this.saveSettings(settings as Settings);
      } catch (error) {
        throw new Error(`データのインポートに失敗しました: ${error}`);
      }
    },

    // 全データの削除
    clearAll(): void {
      safeLocalStorageRemove(KEYS.PROGRESS);
      safeLocalStorageRemove(KEYS.HISTORY);
      safeLocalStorageRemove(KEYS.SETTINGS);
    },

    // Phase 2: データマイグレーション（v1 → v2）
    migrateFromV1(): ProgressData | null {
      try {
        const oldData = safeLocalStorageGet(KEYS.PROGRESS);
        if (!oldData) return null;

        const parsed = JSON.parse(oldData);
        if (parsed.version === "2.0") return parsed;

        console.log("データマイグレーションを実行: v1 → v2");

        // v1のデータをv2に変換
        const migrated: ProgressData = {
          version: "2.0",
          completedSections: (parsed.completedSections || []).map((cs: any) => ({
            sectionId: cs.sectionId,
            textRead: true, // 既存データは読了と仮定
            textReadAt: cs.completedAt,
            quizCompleted: true, // 既存データはクイズ完了と仮定
            quizCompletedAt: cs.completedAt,
            quizResults: cs.quizResults || [],
            quizReviewed: false, // 復習は未完了
          })),
          lastAccessedAt: new Date().toISOString(),
        };

        this.saveProgress(migrated);
        console.log("マイグレーション完了");
        return migrated;
      } catch (error) {
        console.error("マイグレーション失敗:", error);
        return null;
      }
    },
  };
}

// デフォルトエクスポート
export default createStorageAPI;
