# INDEX.md — ドキュメント全体のナビゲーション・読み順ガイド

> このプロジェクトの設計書・仕様書・ガイドの全体像と、あなたが今どこにいるかを示す役割を持つ。  
> ファイルは多いが、役割ごとに読み分けることで見通しが良くなる。

---

## ドキュメントの3層構造

```
┌─────────────────────────────────────────────────────────────────┐
│  層1: プロジェクト全体（最上位ルール・運用方針）                    │
│  ├── AGENTS.md          — Agent共通ルール                        │
│  ├── PROJECT.md         — プロジェクト目的・構成・運用方針         │
│  └── README.md          — リポジトリの顔（クイックスタート）      │
├─────────────────────────────────────────────────────────────────┤
│  層2: 設計書（プロンプト1で生成。実装の前提となる仕様）            │
│  ├── docs/01_requirements.md   — 画面遷移図・機能一覧             │
│  ├── docs/02_data_schema.md    — データ構造・型定義（SSOT）       │
│  └── docs/03_test_strategy.md  — テスト戦略・CI設定               │
├─────────────────────────────────────────────────────────────────┤
│  層3: 補完資料・運用ガイド（プロンプト2で生成・拡充）              │
│  ├── docs/DATA_FORMAT.md       — JSONデータ構造の詳細解説        │
│  ├── docs/API_GUIDE.md         — Storage API 使用例・チートシート │
│  ├── docs/spec/               — 確定仕様（UI設計・復習ロジック）  │
│  ├── docs/guide/              — 運用手順・ガイド                 │
│  ├── docs/imp/                — 実装作業・課題追跡               │
│  └── docs/diary/              — セッション記録                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## あなたの目的別 読み順

### 「初めてこのプロジェクトに触れる」→ 層1 → 層2（順番に）

1. **[README.md](../README.md)** — プロジェクトが何か、どう動かすか
2. **[AGENTS.md](../AGENTS.md)** — コーディング規約・命名規則・優先順位
3. **[PROJECT.md](../PROJECT.md)** — プロジェクトの目的、現在地、次のステップ
4. **[docs/01_requirements.md](01_requirements.md)** — 画面構成と機能一覧
5. **[docs/02_data_schema.md](02_data_schema.md)** — データ設計の唯一の真実（SSOT）
6. **[docs/03_test_strategy.md](03_test_strategy.md)** — テスト方針と品質基準

### 「データの構造を知りたい」→ 層2 + DATA_FORMAT.md

- **[docs/02_data_schema.md](02_data_schema.md)** — TypeScript型定義、JSONスキーマ
- **[docs/DATA_FORMAT.md](DATA_FORMAT.md)** — `data/*.json` の詳細構造・活用パターン
- **`data/syllabus.json`** — 実データ（10章・60節）
- **`data/quizzes.json`** — 実データ（300問）

### 「実装を始める（プロンプト3）」→ 層2 + API_GUIDE.md + spec/

1. **[docs/02_data_schema.md](02_data_schema.md)** — 型定義の確認
2. **[docs/API_GUIDE.md](API_GUIDE.md)** — Storage API の使用パターン
3. **[docs/spec/ui-design-guide.md](spec/ui-design-guide.md)** — UIコンポーネント指針
4. **[docs/spec/review-logic.md](spec/review-logic.md)** — 復習ロジック仕様
5. **[docs/imp/imp-tasks.md](imp/imp-tasks.md)** — 現在の実装タスク

### 「運用・トラブルシュート」→ guide/ + imp/

- **[docs/guide/](guide/)** — ビルド手順、デプロイ手順、バックアップ手順
- **[docs/imp/imp-tasks.md](imp/imp-tasks.md)** — 現在の実装作業リスト
- **[docs/imp/imp-comp.md](imp/imp-comp.md)** — 完了記録・過去の判断ログ
- **[docs/imp/user-tasks.md](imp/user-tasks.md)** — ユーザーが実行すべき作業
- **[docs/imp/user-judge.md](imp/user-judge.md)** — ユーザー判断待ち事項

---

## ファイル一覧と役割

### 層1: プロジェクト全体

| ファイル | 役割 | 行数 |
|---|---|---|
| [README.md](../README.md) | プロジェクトの顔。クイックスタート、技術スタック、ディレクトリ構成 | ~165 |
| [AGENTS.md](../AGENTS.md) | Agent向け最上位ルール。命名規約、コミット規約、優先順位モデル | ~80 |
| [PROJECT.md](../PROJECT.md) | プロジェクト概要、目的、フェーズ管理、情報の置き場所ルール | ~85 |

### 層2: 設計書（プロンプト1成果物）

| ファイル | 役割 | 行数 |
|---|---|---|
| [docs/01_requirements.md](01_requirements.md) | 画面遷移図（7画面）、機能一覧18項目、ユーザストーリー | 217 |
| [docs/02_data_schema.md](02_data_schema.md) | LocalStorage Key-Value構造、JSONスキーマ、エクスポート型、TypeScript型 | 286 |
| [docs/03_test_strategy.md](03_test_strategy.md) | Unit/Integration/E2Eテスト項目、カバレッジ目標、CIコマンド | 183 |

### 層3: 補完資料（プロンプト2成果物 + 拡充）

| ファイル | 役割 | 行数 | 状態 |
|---|---|---|---|
| [docs/DATA_FORMAT.md](DATA_FORMAT.md) | `syllabus.json` / `quizzes.json` の構造、活用パターン、メンテナンス手順 | ~200 | 完成 |
| [docs/API_GUIDE.md](API_GUIDE.md) | `StorageAPI` のメソッド詳細、使用例、エラーハンドリング | ~250 | 完成 |
| [docs/INDEX.md](INDEX.md) | このファイル。ドキュメント全体のナビゲーション | ~150 | 完成 |
| [docs/spec/ui-design-guide.md](spec/ui-design-guide.md) | Material Design 3準拠のUI設計指針 | 16 | プロンプト3で詳細化予定 |
| [docs/spec/review-logic.md](spec/review-logic.md) | 復習抽出エンジン・進捗率算出の仕様 | 17 | プロンプト3で詳細化予定 |
| [docs/imp/imp-tasks.md](imp/imp-tasks.md) | 実装待ちタスク・現在のフェーズ | ~70 | 随時更新 |
| [docs/imp/imp-comp.md](imp/imp-comp.md) | 完了記録・過去の実装ログ | ~50 | 随時更新 |
| [docs/imp/user-tasks.md](imp/user-tasks.md) | ユーザー作業リスト | — | 必要時作成 |
| [docs/imp/user-judge.md](imp/user-judge.md) | ユーザー判断待ち事項 | — | 必要時作成 |

---

## データとソースコード

| ファイル/ディレクトリ | 役割 | 備考 |
|---|---|---|
| `data/syllabus.json` | 仮想シラバス（10章・60節） | プロンプト2で生成。UIで章・節一覧を表示する際に使用 |
| `data/quizzes.json` | 300問のクイズデータ | プロンプト2で生成。`syllabus.json` と整合性検証済み |
| `src/lib/storage.ts` | LocalStorage操作の型定義 | プロンプト1で生成。**実装はプロンプト3で行う** |
| `src/test/schema.validation.test.ts` | データ整合性テスト | 16項目。プロンプト2で作成。全テストパス |
| `src/test/storage.types.test.ts` | ストレージ型テスト | 2項目。プロンプト1で作成。全テストパス |

---

## フェーズ別 参照すべきファイル

| フェーズ | 参照ファイル | 目的 |
|---|---|---|
| **フェーズ1完了時** | `docs/01_*.md`, `docs/02_*.md`, `docs/03_*.md` | 設計書レビュー |
| **フェーズ2完了時** | `docs/DATA_FORMAT.md`, `data/*.json`, `src/test/*.test.ts` | データ品質確認 |
| **フェーズ3実装時** | `docs/API_GUIDE.md`, `docs/spec/*.md`, `docs/imp/imp-tasks.md` | 実装ガイド |
| **運用・メンテ時** | `docs/guide/*.md`, `docs/imp/imp-comp.md` | 運用継続 |

---

## ドキュメント更新の流れ

```
設計変更 → docs/02_data_schema.md を更新（SSOT）
    ↓
影響を受けるファイルを連鎖更新:
  - docs/DATA_FORMAT.md（JSON構造に影響あれば）
  - docs/API_GUIDE.md（APIに影響あれば）
  - src/lib/storage.ts（型定義の更新）
  - src/test/*.test.ts（テストの更新）
    ↓
npm test で全テストパスを確認
    ↓
docs/imp/imp-comp.md に変更を記録
```

---

## よくある質問

### Q: `docs/02_data_schema.md` と `docs/DATA_FORMAT.md` の違いは？

**A:** `02_data_schema.md` は「データ設計の唯一の真実（SSOT）」。型定義、JSONスキーマ、LocalStorage構造を定義する。`DATA_FORMAT.md` は「生成済みデータの解説書」。`data/*.json` の実際の構造、活用パターン、メンテナンス手順を解説する。前者が「設計図」、後者が「取扱説明書」。

### Q: `docs/spec/` と `docs/guide/` の違いは？

**A:** `spec/` は「確定した仕様」。UI設計ガイド、復習ロジックなど、実装者が従うべき決まりごと。`guide/` は「運用手順」。ビルド方法、デプロイ手順、バックアップ方法など、運用者が実行する手順書。

### Q: どのファイルが最も優先度が高い？

**A:** 以下の順で優先する：
1. `AGENTS.md` — 最上位ルール。命名規約など全コードに適用
2. `docs/02_data_schema.md` — データ設計のSSOT。型変更は全箇所に影響
3. `docs/01_requirements.md` — 機能要件。実装の方向性を決める
4. その他は目的に応じて参照

---

## 関連ファイル

- **[README.md](../README.md)** — プロジェクト全体の概要
- **[PROJECT.md](../PROJECT.md)** — フェーズ管理・次のタスク
