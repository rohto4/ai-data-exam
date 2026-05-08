# DATA_FORMAT.md — 学習データJSONの構造と活用方法

> プロンプト2で生成された `data/syllabus.json` と `data/quizzes.json` の構造、活用方法、およびプロンプト3実装時の読み込みパターンを解説する。

---

## 概要

| ファイル | 内容 | 行数 | オブジェクト数 |
|---|---|---|---|
| `data/syllabus.json` | 仮想シラバス（章・節の階層構造） | ~568行 | 10章・60節 |
| `data/quizzes.json` | 学習クイズ（解説付き4択問題） | ~6,000行 | 300問 |

両ファイルは `import` または `fetch` で読み込み、UI層や復習エンジンで利用する。**`docs/02_data_schema.md`** および **`src/lib/storage.ts`** で定義された型と完全に整合している。

---

## `data/syllabus.json` — シラバス構造

### トップレベル構造

```json
{
  "version": "1.0",
  "title": "2027年 プロフェッショナルデジタルスキル（データ・AI）試験対策",
  "description": "データ活用とAI活用の専門知識を網羅した学習シラバス...",
  "chapters": [...]
}
```

| フィールド | 型 | 例 | 説明 |
|---|---|---|---|
| `version` | `string` | `"1.0"` | データバージョン。将来の拡張・移行時に使用。 |
| `title` | `string` | — | シラバス全体のタイトル。 |
| `description` | `string` | — | シラバスの説明文。 |
| `chapters` | `Chapter[]` | — | 章の配列。10要素。 |

### Chapter オブジェクト

```json
{
  "id": "ch01",
  "title": "第1章 データ・AIの基礎と戦略",
  "description": "デジタルトランスフォーメーション...",
  "order": 1,
  "sections": [...]
}
```

| フィールド | 型 | 例 | 説明 |
|---|---|---|---|
| `id` | `string` | `"ch01"` | 章ID。`ch` + ゼロ埋め2桁の連番。 |
| `title` | `string` | — | 章タイトル。 |
| `description` | `string` | — | 章の概要説明。 |
| `order` | `number` | `1` | 表示順。1から連番。 |
| `sections` | `Section[]` | — | 節の配列。各章6要素（計60節）。 |

### Section オブジェクト

```json
{
  "id": "ch01-sec01",
  "chapterId": "ch01",
  "title": "1-1 デジタルトランスフォーメーションとデータドリブン経営",
  "content": "デジタルトランスフォーメーション（DX）の本質は...",
  "order": 1,
  "quizCount": 5
}
```

| フィールド | 型 | 例 | 説明 |
|---|---|---|---|
| `id` | `string` | `"ch01-sec01"` | 節ID。`{chapterId}-sec` + ゼロ埋め2桁。 |
| `chapterId` | `string` | `"ch01"` | 所属する章のID。親子参照。 |
| `title` | `string` | — | 節タイトル。 |
| `content` | `string` | — | 学習コンテンツ本文。マークダウン不可（プレーンテキスト）。 |
| `order` | `number` | `1` | 章内の表示順。1から連番。 |
| `quizCount` | `number` | `5` | この節に紐づくクイズ数（`quizzes.json` で検証）。 |

### シラバス構成マップ

| # | 章ID | タイトル | 節数 |
|---|---|---|---|
| 1 | `ch01` | 第1章 データ・AIの基礎と戦略 | 6 |
| 2 | `ch02` | 第2章 データガバナンスと品質管理 | 6 |
| 3 | `ch03` | 第3章 データエンジニアリング基礎 | 6 |
| 4 | `ch04` | 第4章 統計分析とデータ探索 | 6 |
| 5 | `ch05` | 第5章 機械学習の基礎 | 6 |
| 6 | `ch06` | 第6章 深層学習とニューラルネットワーク | 6 |
| 7 | `ch07` | 第7章 生成AIと大規模言語モデル | 6 |
| 8 | `ch08` | 第8章 AIエージェントとMLOps | 6 |
| 9 | `ch09` | 第9章 AI倫理、法規制、社会実装 | 6 |
| 10 | `ch10` | 第10章 実践データ・AIプロジェクト | 6 |

---

## `data/quizzes.json` — クイズ構造

### トップレベル構造

```json
{
  "version": "1.0",
  "generatedAt": "2026-05-05T20:41:37.450Z",
  "quizzes": [...]
}
```

| フィールド | 型 | 説明 |
|---|---|---|
| `version` | `string` | データバージョン。 `"1.0"`。 |
| `generatedAt` | `string` | ISO8601形式の生成日時。 |
| `quizzes` | `Quiz[]` | クイズオブジェクトの配列。300要素。 |

### Quiz オブジェクト

```json
{
  "id": "q-ch01-sec01-001",
  "sectionId": "ch01-sec01",
  "chapterId": "ch01",
  "question": "DX（デジタルトランスフォーメーション）の本質は何か。",
  "choices": [
    "最新のIT技術を導入すること",
    "ビジネスモデルや組織そのものを変革すること",
    "ペーパーレス化を推進すること",
    "社内のサーバーをクラウドに移行すること"
  ],
  "correctIndex": 1,
  "explanation": "DXの本質はビジネスモデル・組織・文化そのものの変革にあり...",
  "difficulty": "easy",
  "tags": ["DX", "ビジネスモデル", "基本概念"]
}
```

| フィールド | 型 | 例 | 説明 |
|---|---|---|---|
| `id` | `string` | `"q-ch01-sec01-001"` | 問題ID。`q-{sectionId}-{連番}` の形式。 |
| `sectionId` | `string` | `"ch01-sec01"` | 所属する節のID。`syllabus.json` と相互参照。 |
| `chapterId` | `string` | `"ch01"` | 所属する章のID。 |
| `question` | `string` | — | 問題文。プレーンテキスト。末尾に「。」を付ける。 |
| `choices` | `[string, string, string, string]` | — | 4択の配列。exactly 4要素。 |
| `correctIndex` | `number` | `1` | 正解のインデックス。`0`〜`3`。 |
| `explanation` | `string` | — | 解説文。正解の理由と他選択肢が不正解である理由。 |
| `difficulty` | `"easy" \| "normal" \| "hard"` | `"easy"` | 難易度。 |
| `tags` | `string[]` | `["DX", "ビジネスモデル", "基本概念"]` | タグ。検索・フィルタ用。 |

### 難易度分布

| 難易度 | 件数 | 割合 |
|---|---|---|
| `easy` | 95問 | ~32% |
| `normal` | 154問 | ~51% |
| `hard` | 51問 | ~17% |
| **合計** | **300問** | **100%** |

### ID命名規則

- **章ID**: `ch` + ゼロ埋め2桁連番（例: `ch01`, `ch10`）
- **節ID**: `{chapterId}-sec` + ゼロ埋め2桁連番（例: `ch01-sec01`, `ch10-sec06`）
- **問題ID**: `q-{sectionId}-{連号}`（例: `q-ch01-sec01-001`）

**整合性チェック**: `sectionId` は必ず `syllabus.json` 内の `Section.id` と一致する。`chapterId` は `sectionId.split('-')[0]` と一致する。

---

## 活用パターン

### 1. 特定の節のクイズを取得

```typescript
import quizzesData from '../data/quizzes.json';

const sectionQuizzes = quizzesData.quizzes.filter(
  (q) => q.sectionId === 'ch01-sec01'
);
// → 5問取得
```

### 2. 章ごとの進捗率計算

```typescript
import syllabusData from '../data/syllabus.json';

function calculateChapterProgress(
  chapterId: string,
  completedSectionIds: Set<string>
): number {
  const chapter = syllabusData.chapters.find((c) => c.id === chapterId);
  if (!chapter) return 0;
  
  const completed = chapter.sections.filter((s) =>
    completedSectionIds.has(s.id)
  ).length;
  
  return Math.round((completed / chapter.sections.length) * 100);
}
```

### 3. 復習用の誤答フィルタ

```typescript
import quizzesData from '../data/quizzes.json';

function getReviewQuizzes(mistakeQuestionIds: string[]): Quiz[] {
  return quizzesData.quizzes.filter((q) =>
    mistakeQuestionIds.includes(q.id)
  );
}
```

### 4. データ整合性の検証スクリプト

詳細は `src/test/schema.validation.test.ts` を参照。以下の観点で検証している：

- `sectionId` の一意性
- `chapterId` の一貫性
- `quizCount` の一致（シラバス記載値 vs 実際のクイズ数）
- 問題IDの重複なし
- `correctIndex` の範囲（0〜3）
- `choices` の要素数（exactly 4）

---

## データの拡張・メンテナンス

### 新規クイズ追加時

1. `data/quizzes.json` の `quizzes` 配列に追加
2. `id` は既存の最大連番+1 を使用（例: `q-ch01-sec01-006`）
3. `syllabus.json` の該当 `Section.quizCount` をインクリメント
4. `npm test` を実行し、スキーマ検証テストが通ることを確認

### 新規節追加時

1. `data/syllabus.json` で章の `sections` 配列に追加
2. `chapterId` は親章の `id` と一致させる
3. `quizCount` は `0` または追加するクイズ数に設定
4. 必要に応じて `data/quizzes.json` にクイズを追加
5. `npm test` で整合性確認

### データバージョン管理

| バージョン | 状態 | 変更内容 |
|---|---|---|
| `1.0` | 現在 | プロンプト2完了時点。10章・60節・300問。 |

将来のバージョンアップ時は `version` をインクリメントし、`docs/02_data_schema.md` に移行手順を追記する。

---

## 関連ファイル

- **`docs/02_data_schema.md`** — 型定義の Single Source of Truth
- **`src/lib/storage.ts`** — TypeScript インターフェース定義
- **`src/test/schema.validation.test.ts`** — データ整合性テスト（16項目）
- **`docs/01_requirements.md`** — 画面遷移図・機能要件
