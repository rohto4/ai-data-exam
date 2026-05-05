# 03 Test Strategy: テスト戦略

> 本PJのテスト方針。
> 「機能を実装する度に実施するテスト項目」を定義する。

---

## テスト構成

| 層 | ツール | 目的 |
|---|---|---|
| Unit Test | Vitest | ロジック、型、ユーティリティ関数 |
| Integration Test | Vitest + React Testing Library | コンポーネント連携、フック相互作用 |
| E2E Test | Playwright（将来対応） | ユーザーフロー、画面遷移 |

---

## 単体テスト（Unit Tests）

### 対象モジュール

```
src/lib/
  ├── storage.ts          → Storage APIのテスト
  ├── quiz-engine.ts      → クイズ出題ロジックのテスト
  ├── review-engine.ts    → 復習抽出ロジックのテスト
  └── progress.ts         → 進捗率計算のテスト
```

### テスト項目

| ID | 対象 | テスト内容 | 期待結果 |
|---|---|---|---|
| U01 | storage.ts | `getProgress()` 初回呼び出し | `{ version: "1.0", completedSections: [], lastAccessedAt: now }` を返す |
| U02 | storage.ts | `saveProgress()` 書き込みと読み出し | データがLocalStorageに永続化される |
| U03 | storage.ts | `exportData()` の出力形式 | `ExportData` 型に一致するJSON |
| U04 | storage.ts | `importData()` のバリデーション | 不正なJSONは `Error` をthrow |
| U05 | storage.ts | `clearAll()` 実行後 | 全キーが削除される |
| U06 | quiz-engine.ts | `getQuestionsBySection(sectionId)` | 指定節の問題を順序付けで返す |
| U07 | quiz-engine.ts | `shuffleChoices(quiz)` | 選択肢がシャッフルされるがcorrectIndexが追従する |
| U08 | quiz-engine.ts | `calculateScore(results)` | 正答率を正確に計算 |
| U09 | review-engine.ts | `getMistakes({ all })` | 未解決の誤答を全件返す |
| U10 | review-engine.ts | `getMistakes({ chapterId })` | 指定章の誤答のみ返す |
| U11 | review-engine.ts | `getRandomMistakes(10)` | 最大10問をランダム抽出 |
| U12 | review-engine.ts | `resolveMistake(questionId)` | 解決フラグが立つ |
| U13 | progress.ts | `calculateChapterProgress(chapterId)` | 読了率を%で返す |
| U14 | progress.ts | `calculateOverallProgress()` | 全体の読了率を%で返す |

### テストコード例（storage.ts）

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { storage } from '../lib/storage';

describe('storage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('初回呼び出し時にデフォルト値を返す', () => {
    const progress = storage.getProgress();
    expect(progress.version).toBe('1.0');
    expect(progress.completedSections).toEqual([]);
    expect(progress.lastAccessedAt).toBeDefined();
  });

  it('保存したデータを読み出せる', () => {
    const data = {
      version: '1.0',
      completedSections: [{ sectionId: 'ch01-sec01', completedAt: new Date().toISOString(), quizResults: [] }],
      lastAccessedAt: new Date().toISOString(),
    };
    storage.saveProgress(data);
    expect(storage.getProgress()).toEqual(data);
  });
});
```

---

## 結合テスト（Integration Tests）

### 対象

| 対象 | 内容 |
|---|---|
| コンポーネントレンダリング | React Testing LibraryでDOM出力を検証 |
| ユーザインタラクション | クリック、入力、フォーム送信 |
| フック連携 | useLocalStorage + useQuiz の相互作用 |

### テスト項目

| ID | シナリオ | テスト内容 |
|---|---|---|
| I01 | ダッシュボード表示 | 学習データありで正しく進捗が表示される |
| I02 | クイズフロー | 問題表示 → 回答選択 → 正誤判定 → 次の問題 |
| I03 | 復習フロー | 誤答あり状態で復習モード起動 → クイズ表示 |
| I04 | データエクスポート | 設定画面エクスポートボタン → JSONダウンロードリンク生成 |
| I05 | 設定変更 | テーマ切り替えプルダウン → LocalStorage反映 → 画面再描画 |

### テストコード例

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { QuizPage } from '../pages/QuizPage';

describe('QuizPage', () => {
  it('問題と選択肢が表示される', () => {
    render(<QuizPage sectionId="ch01-sec01" />);
    expect(screen.getByText(/問1/)).toBeInTheDocument();
    expect(screen.getAllByRole('button').length).toBeGreaterThanOrEqual(4);
  });

  it('回答後に解説が表示される', async () => {
    render(<QuizPage sectionId="ch01-sec01" />);
    const choice = screen.getAllByRole('button')[0];
    fireEvent.click(choice);
    expect(await screen.findByText(/解説/)).toBeInTheDocument();
  });
});
```

---

## E2Eテスト（Playwright）

### 対象フロー

| ID | フロー名 | ステップ数 |
|---|---|---|
| E01 | 初回アクセス → 章選択 → 節学習 → 読了マーク | 5 |
| E02 | クイズ挑戦フルフロー | 7 |
| E03 | 誤答 → 復習モード → 正解 → 誤答履歴クリア | 6 |
| E04 | エクスポート → 全リセット → インポート | 4 |
| E05 | ダークモード切り替え | 2 |

### E2Eテスト項目（E02: クイズフルフロー）

```typescript
// playwright test example
test('クイズフルフロー', async ({ page }) => {
  await page.goto('/chapter/ch01');
  await page.click('text=第1節');
  await page.click('text=クイズを受ける');
  
  // N問繰り返し
  for (let i = 0; i < 5; i++) {
    await page.click('[data-testid="choice-0"]');
    await page.click('text=次へ');
  }
  
  await expect(page.locator('text=結果')).toBeVisible();
  await expect(page.locator('text=正答率')).toBeVisible();
});
```

---

## テストカバレッジ目標

| 層 | 目標 | 測定方法 |
|---|---|---|
| Unit Tests | 80%以上 | Vitest --coverage |
| Integration Tests | 主要コンポーネント網羅 | 人手確認 |
| E2E Tests | 必須フロー5件 | Playwright実行結果 |

---

## CIテスト実行

```bash
# 全テスト実行
npm test

# カバレッジ付き実行
npm run test:coverage

# ウォッチモード（開発時）
npm run test:watch

# E2E実行
npm run test:e2e
```
