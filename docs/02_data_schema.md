# 02 Data Schema: LocalStorage / JSONスキーマ / エクスポート型定義

> 本PJの「唯一の真実（Single Source of Truth）」として機能するデータ設計書。
> プロンプト2（データ生成）とプロンプト3（実装）の両方が参照する。

---

## LocalStorage Key-Value 構造

| Key | 型 | 説明 |
|---|---|---|
| `ai-exam-progress` | `ProgressData` | 学習進捙データ |
| `ai-exam-history` | `MistakeHistory` | 誤答履歴データ |
| `ai-exam-settings` | `Settings` | ユーザー設定 |

### ProgressData

```typescript
interface ProgressData {
  version: string;      // "1.0"
  completedSections: CompletedSection[];
  lastAccessedAt: string; // ISO8601
}

interface CompletedSection {
  sectionId: string;    // "ch01-sec02"
  completedAt: string;  // ISO8601
  quizResults: QuizResult[];
}

interface QuizResult {
  questionId: string;
  isCorrect: boolean;
  answeredAt: string;   // ISO8601
  attempts: number;     // 回答回数（1回目は1、再チャレンジで加算）
}
```

### MistakeHistory

```typescript
interface MistakeHistory {
  version: string;      // "1.0"
  mistakes: MistakeItem[];
}

interface MistakeItem {
  questionId: string;
  sectionId: string;
  chapterId: string;
  wrongAnswerIndex: number; // 0-based
  firstMistakeAt: string;     // ISO8601
  totalAttempts: number;
  resolved: boolean;          // 復習モードで正解したらtrue
  resolvedAt?: string;        // ISO8601
}
```

### Settings

```typescript
interface Settings {
  version: string;      // "1.0"
  theme: "light" | "dark" | "system";
  quizDefaultCount: number; // 1セッションの問題数（デフォルト: 全問）
  randomizeChoices: boolean; // 選択肢をシャッフルするか
}
```

---

## クイズデータ JSONスキーマ

### ファイル: `data/quizzes.json`

```typescript
interface QuizzesData {
  version: string;      // "1.0"
  generatedAt: string;  // ISO8601
  quizzes: Quiz[];
}

interface Quiz {
  id: string;           // "q-ch01-sec01-001"
  sectionId: string;    // "ch01-sec01"
  chapterId: string;    // "ch01"
  question: string;
  choices: [string, string, string, string]; // 必ず4択
  correctIndex: number; // 0-based
  explanation: string;
  difficulty: "easy" | "normal" | "hard";
  tags: string[];       // 分類タグ（検索・フィルタ用）
}
```

### ID命名規則

| 要素 | フォーマット | 例 |
|---|---|---|
| 章ID | `ch{NN}` | `ch01`, `ch10` |
| 節ID | `ch{NN}-sec{NN}` | `ch01-sec01` |
| 問題ID | `q-{sectionId}-{NNN}` | `q-ch01-sec01-001` |

---

## シラバスデータ JSONスキーマ

### ファイル: `data/syllabus.json`

```typescript
interface SyllabusData {
  version: string;
  title: string;
  description: string;
  chapters: Chapter[];
}

interface Chapter {
  id: string;           // "ch01"
  title: string;
  description: string;
  order: number;        // 1-based
  sections: Section[];
#KQ|  references: Reference[]; // 章ごとの公式参照
#KQ|}
#YB|
#HR|interface Reference {
#VH|  title: string;
#PX|  url: string;
#JW|  section?: string;
#VR|}
}

interface Section {
  id: string;           // "ch01-sec01"
  chapterId: string;
  title: string;
  content: string;      // Markdown形式の学習内容
  order: number;        // 1-based
  quizCount: number;    // 紐づく問題数
}
```

---

## エクスポートファイルの型定義

### ファイル形式

- 拡張子: `.json`
- ファイル名: `ai-exam-backup-{YYYYMMDD-HHmmss}.json`

### スキーマ

```typescript
interface ExportData {
  version: string;         // "1.0"
  exportedAt: string;      // ISO8601
  appName: string;         // "ai-data-exam"
  data: {
    progress: ProgressData;
    history: MistakeHistory;
    settings: Settings;
  };
}
```

### インポート時のバリデーション

```typescript
// Zodスキーマによるバリデーション（推奨）
// - versionが一致すること
// - 必須フィールドが全て存在すること
// - 配列要素の型が正しいこと
// - ISO8601日付文字列の形式チェック
```

---

## TypeScript 型定義まとめ

```typescript
// src/lib/storage.ts で定義

// === 基本型 ===
export type QuestionId = string;
export type SectionId = string;
export type ChapterId = string;

// === LocalStorage ===
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

// === データJSON ===
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

// === エクスポート ===
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
```

> このファイルは、プロンプト 1【論理設計・環境構築・テスト戦略】で生成される。
> 生成モデル：Kimi K2.6 TEE (Frontier)
> 後続のプロンプト 2・3 が参照する「唯一の真実（Single Source of Truth）」として機能する。
