# AI・データ設計 試験対策学習サイト

> **目的**: 2027年新設「プロフェッショナルデジタルスキル(データ・AI)試験」対策の学習サイト  
> **構成**: 章(Chapter) > 節(Section) > クイズ の階層構造。LocalStorage で進捗・誤答履歴を管理  
> **UI**: Google Material Design 3（水色ベース `#03A9F4`）

---

## クイックスタート

```bash
# 1. 依存関係インストール
npm install

# 2. 開発サーバー起動（ http://localhost:5173 ）
npm run dev

# 3. テスト実行
npm test

# 4. ビルド（dist/ に出力）
npm run build
```

---

## 技術スタック

| 層 | 採用技術 | バージョン | 用途 |
|---|---|---|---|
| フレームワーク | React | ^19.2.0 | UIフレームワーク（関数コンポーネント + Hooks） |
| ビルドツール | Vite | ^6.3.0 | 高速開発サーバー・HMR・ビルド |
| 言語 | TypeScript | ~5.8.0 | 型安全な開発 |
| スタイリング | Tailwind CSS | ^4.2.0 | ユーティリティファーストCSS |
| テスト (Unit) | Vitest | ^3.2.0 | 高速Unitテスト |
| テスト (DOM) | Testing Library + jsdom | ^16.3.0 / ^26.1.0 | Reactコンポーネントテスト |
| テスト (E2E) | Playwright | — | E2Eテスト（将来対応） |
| アイコン | Lucide React | ^0.510.0 | アイコンライブラリ |
| データ永続化 | LocalStorage | Web標準 | 学習進捗・誤答履歴・設定の保存 |
| UI設計指針 | Google Material Design 3 | — | コンポーネント・配色・レイアウト |

---

## プロジェクト構成

```
ai-data-exam/
├── data/                      # 学習データJSON（プロンプト2で生成）
│   ├── syllabus.json          # シラバス（10章・60節・568行）
│   └── quizzes.json           # クイズ（300問・解説付き4択）
│
├── docs/                      # 設計書・仕様・運用手順
│   ├── 01_requirements.md     # 画面遷移図・機能一覧（217行）
│   ├── 02_data_schema.md      # LocalStorage / JSONスキーマ / 型定義（286行）
│   ├── 03_test_strategy.md    # テスト戦略（183行）
│   ├── INDEX.md               # ドキュメント全体のナビゲーション ← あなたはここ
│   ├── DATA_FORMAT.md         # syllabus.json / quizzes.json の構造解説
│   ├── API_GUIDE.md           # Storage API の使用例・チートシート
│   ├── spec/                  # 確定仕様（UI設計ガイド等）
│   ├── guide/                 # 運用手順・ガイド
│   ├── candi-ref/             # 候補案・調査メモ
│   ├── imp/                   # 実装メモ・課題追跡
│   │   ├── imp-tasks.md       # 実装作業リスト
│   │   └── imp-comp.md        # 完了記録
│   ├── imp/user-tasks.md      # ユーザー作業
│   ├── imp/user-judge.md      # ユーザー判断待ち
│   └── diary/                 # セッション記録
│
├── src/                       # ソースコード
│   ├── lib/
│   │   └── storage.ts         # LocalStorage操作の型定義・インターフェース
│   ├── test/
│   │   ├── storage.types.test.ts      # ストレージ型テスト（2項目）
│   │   └── schema.validation.test.ts  # データスキーマ整合性テスト（16項目）
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── .agents/skills/            # ECC由来のスキル定義（13スキル）
├── commands/                  # ECC/ecc-expand由来コマンド
├── AGENTS.md                  # Agent共通ルール（日本語対応・命名規約等）
├── PROJECT.md                 # プロジェクト概要・目的・運用方針
└── README.md                  # このファイル
```

---

## 設計書の読み順

初めての方は以下の順で読むことをおすすめします：

1. **[AGENTS.md](AGENTS.md)** — 最上位ルール・コミットメッセージ規約・優先順位
2. **[PROJECT.md](PROJECT.md)** — プロジェクト目的・構成・運用方針・現在のフェーズ
3. **[docs/01_requirements.md](docs/01_requirements.md)** — 画面遷移図と機能一覧（Must/Should/Could）
4. **[docs/02_data_schema.md](docs/02_data_schema.md)** — データ構造・スキーマ・型定義（Single Source of Truth）
5. **[docs/03_test_strategy.md](docs/03_test_strategy.md)** — テスト戦略・カバレッジ目標・CI設定
6. **[docs/DATA_FORMAT.md](docs/DATA_FORMAT.md)** — 学習データJSONの構造と活用方法
7. **[docs/API_GUIDE.md](docs/API_GUIDE.md)** — Storage API の使用例・開発チートシート

---

## データ概要

| ファイル | 内容 | サイズ |
|---|---|---|
| `data/syllabus.json` | 10章・60節の仮想シラバス | 568行 |
| `data/quizzes.json` | 300問（各節5問・解説付き4択） | ~3,000行 |

**シラバス構成**: データ戦略 → データガバナンス → データエンジニアリング → 統計分析 → 機械学習 → 深層学習 → 生成AI/LLM → AIエージェント/MLOps → AI倫理/規制 → 実践プロジェクト

**難易度分布**: easy 95問 / normal 154問 / hard 51問

データの詳細構造は **[docs/DATA_FORMAT.md](docs/DATA_FORMAT.md)** を参照。

---

## npm Scripts

| コマンド | 説明 |
|---|---|
| `npm run dev` | Vite 開発サーバー起動（http://localhost:5173） |
| `npm run build` | TypeScript コンパイル + 本番ビルド |
| `npm run preview` | ビルド済みアプリのプレビュー |
| `npm test` | 全テスト実行（Vitest） |
| `npm run test:coverage` | カバレッジ付きテスト実行 |
| `npm run test:watch` | ウォッチモード（ファイル変更で自動実行） |
| `npm run test:e2e` | Playwright E2Eテスト（将来対応） |

---

## 現在のフェーズ

| フェーズ | 状態 | 成果物 | 備考 |
|---|---|---|---|
| **フェーズ1**: 論理設計・環境構築・テスト戦略 | ✅ 完了 | `docs/*.md`（3ファイル）、`src/lib/storage.ts` | プロンプト1完了 |
| **フェーズ2**: 情報マイニング・シラバス＆問題生成 | ✅ 完了 | `data/syllabus.json`（10章・60節）、`data/quizzes.json`（300問） | プロンプト2完了・全18テストパス |
| **フェーズ3**: TDD駆動によるフルスタック実装 | 🔄 未着手 | — | 次の実装フェーズ |

> **次の作業**: [docs/imp/imp-tasks.md](docs/imp/imp-tasks.md) を参照

---

## ドキュメント索引

- **`AGENTS.md`** — Agent共通ルール（命名規約・コミット規約・必須チェック・優先順位）
- **`PROJECT.md`** — プロジェクト目的・構成・運用方針・優先度モデル
- **`docs/01_requirements.md`** — 画面遷移図（7画面）、機能一覧18項目、ユーザストーリー
- **`docs/02_data_schema.md`** — LocalStorage Key-Value構造、JSONスキーマ、エクスポート型定義、TypeScript型定義
- **`docs/03_test_strategy.md`** — Unit/Integration/E2Eテスト項目、カバレッジ目標、CIコマンド
- **`docs/INDEX.md`** — ドキュメント全体のナビゲーション・読み順ガイド
- **`docs/DATA_FORMAT.md`** — `syllabus.json` / `quizzes.json` の詳細構造・活用方法
- **`docs/API_GUIDE.md`** — `storage.ts` の使用例・開発チートシート
- **`docs/imp/imp-tasks.md`** — 実装作業リスト（フェーズ3のタスク）
- **`docs/imp/imp-comp.md`** — 完了記録（フェーズ1・2の完了ログ）
- **`docs/spec/ui-design-guide.md`** — UI設計仕様（Material Design 3・水色ベース）
- **`docs/spec/review-logic.md`** — 復習ロジックの確定仕様

---

## ライセンス

MIT
