# API_GUIDE.md — Storage API 使用例・開発チートシート

> `src/lib/storage.ts` で定義された `StorageAPI` インターフェースの使用例、各関数の挙動、実装時の注意点をまとめる。  
> プロンプト3で **実装が完了する予定** のモジュール。現在は型定義・インターフェースのみ存在。

---

## 概要

`StorageAPI` は、LocalStorage を通じて以下の3種類のデータを永続化するための統一インターフェースです：

| データ種別 | LocalStorage Key | 型 |
|---|---|---|
| 学習進捗 | `ai-exam-progress` | `ProgressData` |
| 誤答履歴 | `ai-exam-history` | `MistakeHistory` |
| ユーザー設定 | `ai-exam-settings` | `Settings` |

すべての `StorageAPI` メソッドは同期的に動作し、エラー時は `console.error` を出力した上でデフォルト値を返すか、例外をスローします。

---

## インターフェース定義

### 基本型

```typescript
export type QuestionId = string;   // 例: "q-ch01-sec01-001"
export type SectionId  = string;   // 例: "ch01-sec01"
export type ChapterId  = string;   // 例: "ch01"
```

### ProgressData — 学習進捗

```typescript
export interface ProgressData {
  version: string;              // "1.0"
  completedSections: CompletedSection[];
  lastAccessedAt: string;       // ISO8601
}

export interface CompletedSection {
  sectionId: SectionId;         // 例: "ch01-sec01"
  completedAt: string;          // ISO8601
  quizResults: QuizResult[];
}

export interface QuizResult {
  questionId: QuestionId;       // 例: "q-ch01-sec01-001"
  isCorrect: boolean;
  answeredAt: string;           // ISO8601
  attempts: number;             // 正解までの試行回数（1回目で正解なら1）
}
```

### MistakeHistory — 誤答履歴

```typescript
export interface MistakeHistory {
  version: string;              // "1.0"
  mistakes: MistakeItem[];
}

export interface MistakeItem {
  questionId: QuestionId;
  sectionId: SectionId;
  chapterId: ChapterId;
  wrongAnswerIndex: number;     // 選択した誤答のインデックス（0〜3）
  firstMistakeAt: string;       // ISO8601、初回誤答時刻
  totalAttempts: number;        // この問題に対する総試行回数
  resolved: boolean;            // 復習モードで正解したか
  resolvedAt?: string;          // ISO8601、解決時刻（未解決なら undefined）
}
```

### Settings — ユーザー設定

```typescript
export interface Settings {
  version: string;              // "1.0"
  theme: "light" | "dark" | "system";
  quizDefaultCount: number;     // デフォルト出題数（1〜20）
  randomizeChoices: boolean;    // 選択肢をランダム表示するか
}
```

### ExportData — エクスポート時のラッパー

```typescript
export interface ExportData {
  version: string;              // "1.0"
  exportedAt: string;           // ISO8601
  appName: string;              // "ai-data-exam"
  data: {
    progress: ProgressData;
    history: MistakeHistory;
    settings: Settings;
  };
}
```

---

## StorageAPI メソッド詳細

### `getProgress(): ProgressData`

LocalStorage から `ai-exam-progress` を読み込み、`ProgressData` を返す。  
データが存在しない場合は初期値（`version: "1.0"`, `completedSections: []`, `lastAccessedAt: 現在日時`）を返す。

```typescript
const api = createStorageAPI();
const progress = api.getProgress();
console.log(progress.completedSections.length); // 完了した節の数
```

### `saveProgress(data: ProgressData): void`

`ProgressData` を LocalStorage に書き込む。  
自動的に `lastAccessedAt` を更新する（呼び出し側での設定不要）。

```typescript
const progress = api.getProgress();
progress.completedSections.push({
  sectionId: "ch01-sec01",
  completedAt: new Date().toISOString(),
  quizResults: [...]
});
api.saveProgress(progress);
```

### `getHistory(): MistakeHistory`

LocalStorage から `ai-exam-history` を読み込む。  
データが存在しない場合は `mistakes: []` の初期値を返す。

```typescript
const history = api.getHistory();
const unresolved = history.mistakes.filter((m) => !m.resolved);
console.log(`未解決の誤答: ${unresolved.length}件`);
```

### `saveHistory(data: MistakeHistory): void`

`MistakeHistory` を LocalStorage に書き込む。

```typescript
history.mistakes.push({
  questionId: "q-ch01-sec01-002",
  sectionId: "ch01-sec01",
  chapterId: "ch01",
  wrongAnswerIndex: 2,
  firstMistakeAt: new Date().toISOString(),
  totalAttempts: 1,
  resolved: false
});
api.saveHistory(history);
```

### `getSettings(): Settings`

ユーザー設定を読み込む。  
データが存在しない場合はデフォルト値（`theme: "system"`, `quizDefaultCount: 10`, `randomizeChoices: true`）を返す。

```typescript
const settings = api.getSettings();
if (settings.theme === "dark") {
  document.documentElement.classList.add("dark");
}
```

### `saveSettings(data: Settings): void`

`Settings` を LocalStorage に書き込む。

```typescript
api.saveSettings({
  version: "1.0",
  theme: "dark",
  quizDefaultCount: 15,
  randomizeChoices: false
});
```

### `exportData(): ExportData`

現在のすべてのデータ（進捗・履歴・設定）を1つの `ExportData` オブジェクトにまとめて返す。  
エクスポート・ダウンロード機能で使用。

```typescript
const exportData = api.exportData();
const blob = new Blob([JSON.stringify(exportData, null, 2)], {
  type: "application/json"
});
const url = URL.createObjectURL(blob);
// <a download="ai-exam-backup.json" href={url}> として使用
```

### `importData(data: unknown): void`

外部JSONからデータを読み込み、LocalStorage に復元する。  
バリデーション失敗時は例外をスローし、既存データを上書きしない（transaction的動作）。

```typescript
const fileContent = await file.text();
const parsed = JSON.parse(fileContent);
api.importData(parsed);
// 成功すれば LocalStorage に反映、失敗すれば既存データは保持される
```

### `clearAll(): void`

すべての LocalStorage キーを削除し、初期状態に戻す。  
設定画面の「データを初期化」機能で使用。

```typescript
if (confirm("すべての学習データを削除します。よろしいですか？")) {
  api.clearAll();
}
```

---

## 実装パターン

### 1. フックでのラップ（推奨）

```typescript
// hooks/useStorage.ts
import { useCallback, useState } from "react";
import { createStorageAPI, ProgressData } from "../lib/storage";

const api = createStorageAPI();

export function useProgress() {
  const [progress, setProgress] = useState<ProgressData>(api.getProgress());

  const save = useCallback((data: ProgressData) => {
    api.saveProgress(data);
    setProgress(data);
  }, []);

  return { progress, save };
}
```

### 2. クイズ回答時の一括更新

```typescript
function onAnswer(
  questionId: string,
  selectedIndex: number,
  correctIndex: number
) {
  const isCorrect = selectedIndex === correctIndex;
  const now = new Date().toISOString();

  // 1. 進捗更新
  const progress = api.getProgress();
  const currentSection = /* 現在の節 */;
  const sectionProgress = progress.completedSections.find(
    (s) => s.sectionId === currentSection.id
  ) ?? { sectionId: currentSection.id, completedAt: now, quizResults: [] };

  sectionProgress.quizResults.push({
    questionId,
    isCorrect,
    answeredAt: now,
    attempts: 1 // 簡易実装。リトライ時はインクリメント
  });

  if (!progress.completedSections.find((s) => s.sectionId === currentSection.id)) {
    progress.completedSections.push(sectionProgress);
  }
  api.saveProgress(progress);

  // 2. 誤答時は履歴に追加
  if (!isCorrect) {
    const history = api.getHistory();
    const existing = history.mistakes.find((m) => m.questionId === questionId);
    if (existing) {
      existing.totalAttempts += 1;
    } else {
      history.mistakes.push({
        questionId,
        sectionId: currentSection.id,
        chapterId: currentSection.chapterId,
        wrongAnswerIndex: selectedIndex,
        firstMistakeAt: now,
        totalAttempts: 1,
        resolved: false
      });
    }
    api.saveHistory(history);
  }
}
```

### 3. JSON Export / Import

```typescript
// Export
function downloadBackup() {
  const data = api.exportData();
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `ai-exam-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

// Import
async function uploadBackup(file: File) {
  const text = await file.text();
  const data = JSON.parse(text);
  api.importData(data);
}
```

---

## エラーハンドリング

| シナリオ | 期待される動作 |
|---|---|
| LocalStorage が無効（プライベートモード等） | デフォルト値を返し、`console.error` で通知 |
| データの JSON パース失敗 | デフォルト値を返し、破損データを上書き |
| `importData` でバリデーション失敗 | 例外をスロー。既存データは変更しない |
| `quizDefaultCount` が範囲外（<1 or >20） | クランプして 1〜20 の範囲に矯正 |

---

## メモリ使用量目安

| データ | 推定サイズ |
|---|---|
| 進捗データ（60節全完了） | ~20 KB |
| 誤答履歴（300問全誤答） | ~50 KB |
| 設定 | ~0.5 KB |
| 合計（最大） | ~70 KB |

LocalStorage の容量上限（通常 5〜10 MB）を全く圧迫しない設計。

---

## 互換性・移行

データバージョン `1.0` からの将来の変更に備え、`importData` では `version` フィールドを確認し、未知のバージョンは拒否する実装とする。

```typescript
if (data.version !== "1.0") {
  throw new Error(`Unsupported data version: ${data.version}`);
}
```

---

## 関連ファイル

- **`src/lib/storage.ts`** — 型定義・インターフェース（実装待ち）
- **`docs/02_data_schema.md`** — JSONスキーマの Single Source of Truth
- **`docs/01_requirements.md`** — 機能要件（エクスポート・インポート機能の詳細）
