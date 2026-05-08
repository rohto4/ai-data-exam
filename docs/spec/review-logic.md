# Review Logic Design

> このファイルは、プロンプト3【TDD駆動によるフルスタック実装】の復習ロジック実装フェーズで参照される設計指針。

---

## 復習抽出エンジン

### 対象問題の選定ロジック

復習モードでは、以下の条件を満たす問題を**ランダムに抽出**して出題する：

1. **未解決の誤答**（`MistakeItem.resolved === false`）を優先
2. 未解決がない場合は、**解決済みだが最近復習していない**問題（`resolvedAt` が古い順）
3. それでもない場合は、**全問題からランダム**（フォールバック）

```typescript
function selectReviewQuizzes(
  history: MistakeHistory,
  allQuizzes: Quiz[],
  count: number = 10
): Quiz[] {
  const now = Date.now();
  const candidates = history.mistakes
    .filter((m) => !m.resolved)
    .sort((a, b) => new Date(b.firstMistakeAt).getTime() - new Date(a.firstMistakeAt).getTime());

  if (candidates.length >= count) {
    return candidates.slice(0, count).map((m) => findQuizById(m.questionId));
  }

  // 未解決が少ない場合、解決済みも含める
  const resolved = history.mistakes
    .filter((m) => m.resolved)
    .sort((a, b) => new Date(a.resolvedAt!).getTime() - new Date(b.resolvedAt!).getTime());

  const mixed = [...candidates, ...resolved].slice(0, count);
  return mixed.map((m) => findQuizById(m.questionId));
}
```

### シャッフルアルゴリズム

出題順序は Fisher-Yates シャッフルでランダム化する：

```typescript
function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
```

---

## 学習進捗率算出

### 全体進捗率

```typescript
function calculateOverallProgress(
  progress: ProgressData,
  totalSections: number
): number {
  const completed = progress.completedSections.length;
  return Math.round((completed / totalSections) * 100);
}
```

### 章ごとの進捗率

```typescript
function calculateChapterProgress(
  chapterId: ChapterId,
  progress: ProgressData,
  syllabus: Syllabus
): number {
  const chapter = syllabus.chapters.find((c) => c.id === chapterId);
  if (!chapter) return 0;

  const completedIds = new Set(progress.completedSections.map((s) => s.sectionId));
  const completed = chapter.sections.filter((s) => completedIds.has(s.id)).length;

  return Math.round((completed / chapter.sections.length) * 100);
}
```

### 節の完了条件

節は以下の条件を満たすと「完了」とみなす：

1. 節に紐づくすべてのクイズに回答済み（`quizResults.length === section.quizCount`）
2. 正解率が **60%以上**（`>= 60%`）

```typescript
function isSectionCompleted(
  section: Section,
  sectionProgress: CompletedSection | undefined
): boolean {
  if (!sectionProgress) return false;
  if (sectionProgress.quizResults.length < section.quizCount) return false;

  const correctCount = sectionProgress.quizResults.filter((r) => r.isCorrect).length;
  const accuracy = (correctCount / sectionProgress.quizResults.length) * 100;
  return accuracy >= 60;
}
```

---

## 誤答の記録・更新フロー

```
クイズ回答
    ↓
isCorrect ?
    ├── YES → 1. 進捗データに QuizResult を追加
    │         2. この問題が誤答履歴にあれば resolved=true に更新
    │         3. 正解フィードバック（Snackbar）
    │
    └── NO  → 1. 進捗データに QuizResult を追加（isCorrect=false）
              2. 誤答履歴に MistakeItem を追加/更新
              3. 誤答フィードバック（Snackbar + 解説表示）
```

### 誤答履歴の更新ルール

| 状況 | 動作 |
|---|---|
| 初めて誤答 | `MistakeItem` を新規作成。`resolved: false` |
| 既に誤答済み、再び誤答 | `totalAttempts += 1`。`resolved` は変更なし |
| 誤答後に正解（復習モード含む） | `resolved = true`。`resolvedAt = now` |
| 正解後に再び誤答 | `resolved = false`。`totalAttempts += 1` |

---

## 復習モードの画面制御

### 状態遷移

```
[復習開始]
    ↓
[問題カード表示] → [回答選択] → [正解/誤答判定]
    ↓                                    ↓
[次の問題] ← [解説表示] ←───────────┘
    ↓
[全問題完了] → [結果サマリー] → [ダッシュボードへ]
```

### 結果サマリー表示項目

- 復習した問題数
- 正解数 / 誤答数
- 正解率（%）
- 新しく解決できた問題数（`resolved` が `false→true` になった数）
- 未解決の残件数

---

## 出題数の決定ロジック

```typescript
function determineQuizCount(
  settings: Settings,
  availableQuizzes: number,
  mode: "learn" | "review"
): number {
  const base = settings.quizDefaultCount; // 1〜20

  if (mode === "review") {
    // 復習モード: 誤答数に応じて上限を調整
    return Math.min(base, availableQuizzes, 20);
  }

  // 学習モード: 節に紐づく全問題
  return availableQuizzes;
}
```

---

## テスト観点

以下のテストを `src/test/review.logic.test.ts`（プロンプト3で作成）に含める：

1. **未解決誤答の優先抽出**: `resolved=false` の問題が優先的に選ばれる
2. **ランダム性**: 複数回呼び出した結果が異なる（確率的テスト）
3. **進捗率計算**: 60%以上で完了、未満で未完了
4. **誤答記録**: 初回誤答時に `MistakeItem` が作成される
5. **復習による解決**: 復習モードで正解すると `resolved=true` になる
6. **空履歴時のフォールバック**: 誤答履歴が空でもクラッシュしない

---

## 関連ファイル

- **[docs/01_requirements.md](../01_requirements.md)** — 機能要件（復習モードの画面遷移）
- **[docs/02_data_schema.md](../02_data_schema.md)** — `MistakeHistory`, `MistakeItem`, `QuizResult` の型定義
- **[docs/API_GUIDE.md](../API_GUIDE.md)** — `getHistory`, `saveHistory` の使用例
- **[docs/spec/ui-design-guide.md](ui-design-guide.md)** — 復習モードのUIレイアウト
