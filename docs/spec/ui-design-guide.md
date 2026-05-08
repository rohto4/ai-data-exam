# UI Design Guide

> このファイルは、プロンプト3【TDD駆動によるフルスタック実装】のUI実装フェーズで参照される設計指針。

## デザインシステム

- **ベース**: Google Material Design 3
- **プライマリカラー**: `#03A9F4`（水色）
- **セカンダリカラー**: `#0288D1`（濃い水色）
- **アクセントカラー**: `#FF5722`（オレンジ — 誤答・警告用）
- **背景**: `#FAFAFA`（ライトモード）、`#121212`（ダークモード）
- **サーフェス**: `#FFFFFF`（ライト）、`#1E1E1E`（ダーク）
- **テキスト（オンサーフェス）**: `#212121`（ライト）、`#E0E0E0`（ダーク）

## カラーパレット

| 用途 | ライトモード | ダークモード | Tailwindクラス例 |
|---|---|---|---|
| プライマリ | `#03A9F4` | `#4FC3F7` | `bg-sky-500`, `text-sky-500` |
| プライマリ（ホバー） | `#0288D1` | `#81D4FA` | `hover:bg-sky-600` |
| セカンダリ | `#0288D1` | `#29B6F6` | `bg-sky-600` |
| 背景 | `#FAFAFA` | `#121212` | `bg-neutral-50`, `dark:bg-neutral-900` |
| サーフェス | `#FFFFFF` | `#1E1E1E` | `bg-white`, `dark:bg-neutral-800` |
| 成功（正解） | `#4CAF50` | `#66BB6A` | `text-green-500`, `bg-green-500` |
| エラー（誤答） | `#F44336` | `#EF5350` | `text-red-500`, `bg-red-500` |
| 警告（注意） | `#FF9800` | `#FFB74D` | `text-amber-500` |
| 無効/非アクティブ | `#9E9E9E` | `#757575` | `text-neutral-400` |
| 区切り線 | `#E0E0E0` | `#424242` | `border-neutral-200`, `dark:border-neutral-700` |

## タイポグラフィ

| 要素 | サイズ | ウェイト | 用途 |
|---|---|---|---|
| 見出字（H1） | 24px | 700 (Bold) | ページタイトル |
| 見出字（H2） | 20px | 600 (SemiBold) | セクション見出字 |
| 見出字（H3） | 16px | 600 (SemiBold) | カード見出字 |
| 本文 | 14px | 400 (Regular) | 説明文、コンテンツ |
| 補足 | 12px | 400 (Regular) | 注釈、メタ情報 |
| ラベル | 12px | 500 (Medium) | ボタン、タグ、ナビゲーション |
| 数字（進捗率等） | 32px | 700 (Bold) | ダッシュボードの主要数値 |

## レイアウト構造

### 全体レイアウト

```
┌───────────────────────────────────────────┐
│  AppBar（高さ56px）                         │
│  ロゴ  |  章一覧  復習  設定  |  進捗率      │
├───────────────────────────────────────────┤
│                                           │
│  メインコンテンツ領域                        │
│  （padding: 16px / 24px）                   │
│                                           │
│                                           │
│                                           │
├───────────────────────────────────────────┤
│  BottomNavigation（モバイルのみ）            │
│  章一覧  |  復習  |  設定                    │
└───────────────────────────────────────────┘
```

### ダッシュボード（トップ画面 `/`）

```
┌───────────────────────────────────────────┐
│  全体的な学習進捗                           │
│  ┌──────────────┐  ┌──────────────────┐    │
│  │   円グラフ    │  │  最近学習した節   │    │
│  │   進捗率      │  │  （MiniCard）    │    │
│  └──────────────┘  └──────────────────┘    │
│                                            │
│  章一覧（縦並びの ExpansionPanel）          │
│  ┌─────────────────────────────────────┐   │
│  │ ▼ 第1章 データ・AIの基礎と戦略        │   │
│  │   ├─ 1-1 ● 完了                      │   │
│  │   ├─ 1-2 ○ 未完了                    │   │
│  │   └─ ...                             │   │
│  └─────────────────────────────────────┘   │
│                                            │
│  [復習モードへ]  [ 設定 ]                   │
└───────────────────────────────────────────┘
```

### クイズ画面（ `/quiz/:sectionId` ）

```
┌───────────────────────────────────────────┐
│  1-1 デジタルトランスフォーメーション...    │
│  問題 3 / 5                                │
├───────────────────────────────────────────┤
│                                            │
│  DXの本質は何か。                           │
│                                            │
│  ┌─────────────────────────────────────┐   │
│  │  A. 最新のIT技術を導入すること       │   │
│  ├─────────────────────────────────────┤   │
│  │  B. ビジネスモデルや組織そのものを    │   │
│  │     変革すること（正解）              │   │
│  ├─────────────────────────────────────┤   │
│  │  C. ペーパーレス化を推進すること       │   │
│  ├─────────────────────────────────────┤   │
│  │  D. 社内サーバーをクラウドに移行する   │   │
│  └─────────────────────────────────────┘   │
│                                            │
│  [ 解説を見る ▼ ]                          │
│  DXの本質はビジネスモデル・組織・文化      │
│  そのものの変革にあり...                    │
│                                            │
│  [← 前へ]  [次へ →]                       │
└───────────────────────────────────────────┘
```

### 復習モード画面（ `/review` ）

```
┌───────────────────────────────────────────┐
│  復習モード                                │
│  未解決の誤答: 12件                        │
├───────────────────────────────────────────┤
│                                            │
│  ┌─────────────────────────────────────┐   │
│  │ DXの本質は何か。                      │   │
│  │ 誤答した選択肢: C                     │   │
│  │ ─────────────────                   │   │
│  │  A. ...                              │   │
│  │  B. ...（正解）                      │   │
│  │  C. ...（あなたの回答）              │   │
│  │  D. ...                              │   │
│  │ ─────────────────                   │   │
│  │ [解説] [...]                         │   │
│  │ [ 理解した ✓ ]                       │   │
│  └─────────────────────────────────────┘   │
│                                            │
│  [次の問題 →]                              │
└───────────────────────────────────────────┘
```

## コンポーネント一覧

### 既存の標準コンポーネント（Material Design 3）

| コンポーネント | 用途 | Tailwind実装例 |
|---|---|---|
| AppBar | ナビゲーション・タイトル | `className="h-14 bg-sky-500 text-white px-4 flex items-center"` |
| Card | コンテンツのグルーピング | `className="rounded-xl bg-white shadow-sm p-4"` |
| Button（Filled） | プライマリアクション | `className="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600"` |
| Button（Outlined） | セカンダリアクション | `className="px-4 py-2 border border-sky-500 text-sky-500 rounded-lg"` |
| Button（Text） | 低優先度アクション | `className="px-4 py-2 text-sky-500 hover:bg-sky-50 rounded-lg"` |
| Progress Indicator | 進捗表示 | 円形SVG + `stroke-dasharray` で実装 |
| List/ExpansionPanel | 章・節一覧 | `<details>` / `<summary>` または自作アコーディオン |
| RadioButton | 選択肢（クイズ） | `className="w-full p-4 border rounded-lg hover:bg-neutral-50"` |
| Chip/Tag | 難易度表示 | `className="px-2 py-0.5 text-xs rounded-full bg-sky-100 text-sky-700"` |
| Snackbar | フィードバック（正解/誤答） | `className="fixed bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-lg shadow-lg"` |

### カスタムコンポーネント（プロンプト3で作成）

| コンポーネント | 役割 |
|---|---|
| `ChapterAccordion` | 章を展開/折りたたんで節一覧を表示 |
| `SectionMiniCard` | 節の完了状態・アクセス日を示すミニカード |
| `QuizCard` | 問題文・選択肢・解説を表示するカード |
| `ProgressRing` | 円形の進捗率グラフ |
| `MistakeReviewCard` | 復習モード用の誤答表示カード |

## レスポンシブ戦略

| 画面幅 | レイアウト | フォントサイズ調整 |
|---|---|---|
| `< 640px`（モバイル） | 単一カラム。BottomNavigation。Cardは全幅。 | 本文14px維持。見出し-2px |
| `640px〜1024px`（タブレット） | 2カラム（ダッシュボードのみ）。SideNav表示。 | 基準サイズ |
| `> 1024px`（デスクトップ） | 中央寄せの最大コンテナ（max-w-5xl）。SideNav表示。 | 基準サイズ |

## アニメーション・トランジション

| 場面 | 効果 | 時間 |
|---|---|---|
| 画面遷移 | フェードイン | 200ms ease-out |
| 章の展開 | 高さアニメーション | 300ms ease-in-out |
| クイズ回答時 | 選択肢に色付け + スライド | 150ms ease-out |
| 進捗率更新 | 円グラフのstroke-dashoffset変化 | 500ms ease-out |
| Snackbar表示 | 上昇 + フェードイン | 200ms ease-out |

## アイコン（Lucide React）

| 用途 | アイコン名 | インポート |
|---|---|---|
| ホーム/ダッシュボード | `Home` | `import { Home } from "lucide-react"` |
| 章一覧 | `BookOpen` | `import { BookOpen } from "lucide-react"` |
| 復習 | `RotateCcw` | `import { RotateCcw } from "lucide-react"` |
| 設定 | `Settings` | `import { Settings } from "lucide-react"` |
| 完了 | `CheckCircle2` | `import { CheckCircle2 } from "lucide-react"` |
| 未完了 | `Circle` | `import { Circle } from "lucide-react"` |
| 正解 | `Check` | `import { Check } from "lucide-react"` |
| 誤答 | `X` | `import { X } from "lucide-react"` |
| エクスポート | `Download` | `import { Download } from "lucide-react"` |
| インポート | `Upload` | `import { Upload } from "lucide-react"` |
| 削除 | `Trash2` | `import { Trash2 } from "lucide-react"` |
| 情報 | `Info` | `import { Info } from "lucide-react"` |
| 難易度 easy | `Smile` | `import { Smile } from "lucide-react"` |
| 難易度 normal | `Meh` | `import { Meh } from "lucide-react"` |
| 難易度 hard | `Frown` | `import { Frown } from "lucide-react"` |

## 注意事項

- すべての色は Tailwind CSS の設定（`tailwind.config.js` または CSS変数）で定義し、直接のHEX値ベタ書きは避ける
- ダークモード対応は `dark:` セレクタで統一的に実装
- アクセシビリティ: コントラスト比 4.5:1 以上を維持（WCAG AA準拠）
- タッチターゲット: 最小 44×44px（モバイル）

---

## 関連ファイル

- **[docs/01_requirements.md](01_requirements.md)** — 画面遷移図とレイアウト要件
- **[docs/02_data_schema.md](02_data_schema.md)** — 型定義
- **[docs/API_GUIDE.md](API_GUIDE.md)** — データ操作API
