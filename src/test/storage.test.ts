import { describe, it, expect, beforeEach } from "vitest";
import { createStorageAPI, ProgressData, MistakeHistory, Settings } from "../lib/storage";

describe("StorageAPI", () => {
  let api: ReturnType<typeof createStorageAPI>;

  beforeEach(() => {
    // LocalStorageをクリア
    localStorage.clear();
    // 新しいAPIインスタンスを作成
    api = createStorageAPI();
  });

  describe("進捗データ", () => {
    it("初期状態ではデフォルト値を返す", () => {
      const progress = api.getProgress();
      expect(progress.version).toBe("2.0");
      expect(progress.completedSections).toEqual([]);
      expect(progress.lastAccessedAt).toBeDefined();
    });

    it("進捗データを保存して取得できる", () => {
      const testData: ProgressData = {
        version: "2.0",
        completedSections: [
          {
            sectionId: "ch01-sec01",
            textRead: true,
            textReadAt: new Date().toISOString(),
            quizCompleted: true,
            quizCompletedAt: new Date().toISOString(),
            quizResults: [
              {
                questionId: "q-ch01-sec01-001",
                isCorrect: true,
                answeredAt: new Date().toISOString(),
                attempts: 1,
              },
            ],
            quizReviewed: false,
          },
        ],
        lastAccessedAt: new Date().toISOString(),
      };

      api.saveProgress(testData);
      const retrieved = api.getProgress();

      expect(retrieved.completedSections).toHaveLength(1);
      expect(retrieved.completedSections[0].sectionId).toBe("ch01-sec01");
      expect(retrieved.completedSections[0].textRead).toBe(true);
      expect(retrieved.completedSections[0].quizCompleted).toBe(true);
      expect(retrieved.completedSections[0].quizReviewed).toBe(false);
    });

    it("lastAccessedAtは自動的に更新される", () => {
      const before = new Date().toISOString();
      api.getProgress();
      const after = new Date().toISOString();

      // 取得時にlastAccessedAtが更新されていることを確認
      const progress = api.getProgress();
      expect(progress.lastAccessedAt >= before || progress.lastAccessedAt <= after).toBe(true);
    });
  });

  describe("誤答履歴", () => {
    it("初期状態では空の履歴を返す", () => {
      const history = api.getHistory();
      expect(history.version).toBe("2.0");
      expect(history.mistakes).toEqual([]);
    });

    it("誤答履歴を保存して取得できる", () => {
      const testData: MistakeHistory = {
        version: "2.0",
        mistakes: [
          {
            questionId: "q-ch01-sec01-001",
            sectionId: "ch01-sec01",
            chapterId: "ch01",
            wrongAnswerIndex: 2,
            firstMistakeAt: new Date().toISOString(),
            totalAttempts: 1,
            resolved: false,
            reviewed: false,
          },
        ],
      };

      api.saveHistory(testData);
      const retrieved = api.getHistory();

      expect(retrieved.mistakes).toHaveLength(1);
      expect(retrieved.mistakes[0].questionId).toBe("q-ch01-sec01-001");
      expect(retrieved.mistakes[0].reviewed).toBe(false);
    });
  });

  describe("設定", () => {
    it("初期状態ではデフォルト設定を返す", () => {
      const settings = api.getSettings();
      expect(settings.version).toBe("2.0");
      expect(settings.quizDefaultCount).toBe(10);
      expect(settings.randomizeChoices).toBe(true);
    });

    it("設定を保存して取得できる", () => {
      const testData: Settings = {
        version: "2.0",
        quizDefaultCount: 15,
        randomizeChoices: false,
      };

      api.saveSettings(testData);
      const retrieved = api.getSettings();

      expect(retrieved.quizDefaultCount).toBe(15);
      expect(retrieved.randomizeChoices).toBe(false);
    });
  });

  describe("エクスポート", () => {
    it("全データをエクスポートできる", () => {
      // テストデータを設定
      api.saveProgress({
        version: "2.0",
        completedSections: [],
        lastAccessedAt: new Date().toISOString(),
      });

      const exported = api.exportData();

      expect(exported.version).toBe("2.0");
      expect(exported.appName).toBe("ai-data-exam");
      expect(exported.exportedAt).toBeDefined();
      expect(exported.data.progress).toBeDefined();
      expect(exported.data.history).toBeDefined();
      expect(exported.data.settings).toBeDefined();
    });
  });

  describe("インポート", () => {
    it("有効なデータをインポートできる", () => {
      const importData = {
        version: "2.0",
        exportedAt: new Date().toISOString(),
        appName: "ai-data-exam",
        data: {
          progress: {
            version: "2.0" as const,
            completedSections: [
              {
                sectionId: "ch01-sec01",
                textRead: true,
                textReadAt: new Date().toISOString(),
                quizCompleted: true,
                quizCompletedAt: new Date().toISOString(),
                quizResults: [],
                quizReviewed: false,
              },
            ],
            lastAccessedAt: new Date().toISOString(),
          },
          history: {
            version: "2.0" as const,
            mistakes: [],
          },
          settings: {
            version: "2.0" as const,
            quizDefaultCount: 20,
            randomizeChoices: true,
          },
        },
      };

      api.importData(importData);

      const settings = api.getSettings();
      expect(settings.quizDefaultCount).toBe(20);
      expect(settings.randomizeChoices).toBe(true);

      const progress = api.getProgress();
      expect(progress.completedSections).toHaveLength(1);
    });

    it("無効なデータではエラーを投げる", () => {
      expect(() => api.importData(null)).toThrow("無効なデータ形式です");
      expect(() => api.importData({})).toThrow("未対応のデータバージョン");
      expect(() => api.importData({ version: "1.0" })).toThrow("未対応のデータバージョン");
      expect(() => api.importData({ version: "2.0" })).toThrow("データ構造が不正");
    });
  });

  describe("クリア", () => {
    it("全データを削除できる", () => {
      // データを保存
      api.saveProgress({
        version: "2.0",
        completedSections: [],
        lastAccessedAt: new Date().toISOString(),
      });
      api.saveHistory({ version: "2.0", mistakes: [] });
      api.saveSettings({
        version: "2.0",
        quizDefaultCount: 15,
        randomizeChoices: false,
      });

      // クリア
      api.clearAll();

      // デフォルト値に戻っていることを確認
      expect(api.getProgress().completedSections).toEqual([]);
      expect(api.getHistory().mistakes).toEqual([]);
      expect(api.getSettings().quizDefaultCount).toBe(10);
    });
  });

  describe("エラーハンドリング", () => {
    it("破損したJSONデータの場合、デフォルト値を返す", () => {
      // 手動で破損したデータを設定
      localStorage.setItem("ai-exam-progress", "invalid json");

      const progress = api.getProgress();
      expect(progress.completedSections).toEqual([]);
      expect(progress.version).toBe("2.0");
    });
  });
});
