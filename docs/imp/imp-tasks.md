# Implementation Tasks

このファイルは、AI/実装者が着手する作業だけを置く。

**最終更新**: 2026-05-06

---

## 準備フェーズ（現在）

### プロンプト要件全体の整理

本PJでは、下記の3つのプロンプトを順次実施し、試験対策学習サイトを構築する。

- プロンプト1：【論理設計・環境構築・テスト戦略】（Kimi K2.6 TEE）
- プロンプト2：【情報マイニング・シラバス＆問題生成】（Qwen3.5 397B）
- プロンプト3：【TDD駆動によるフルスタック実装】（Qwen2.5 Coder 32B）

各プロンプトが必要とするドキュメント・データ構造・実装スコープは互いに依存しており、以下の通り連携する。

---

### 確定技術スタック

| 層 | 採用技術 |
|---|---|
| フレームワーク | Vite + TypeScript + React |
| スタイリング | Tailwind CSS |
| テスト | Vitest + Testing Library |
| アイコン | Lucide React |
| データ永続化 | LocalStorage |
| UI設計指針 | Google Material Design 3（水色ベース `#03A9F4`） |

---

### プロンプト1対応：準備タスク

- [ ] `docs/01_requirements.md` の筐体作成（画面遷移図 + 機能一覧のたたき台）
- [ ] `docs/02_data_schema.md` の筐体作成（LocalStorage Key-Value構造 + クイズJSONスキーマ + エクスポート型定義）
- [ ] `docs/03_test_strategy.md` の筐体作成（単体・結合・E2Eのテスト項目定義）
- [ ] `src/lib/storage.ts` の配置先と型定義の雛形を準備（プロンプト1では「インターフェースのみ」）
- [ ] Vite + React + TypeScript + Tailwind プロジェクトの初期化（`npm create vite@latest`）
- [ ] Vitest, Testing Library, Lucide React のインストール

### プロンプト2対応：準備タスク

- [ ] `data/syllabus.json` の出力先を作成（章 > 節 構成の雛形）
- [ ] `data/quizzes.json` の出力先を作成（各節5問以上、計250問以上のスキーマ雛形）
- [ ] プロンプト1で定義した `docs/02_data_schema.md` を前提に、JSONスキーマの型整合性を確保する構造を準備

### プロンプト3対応：準備タスク

- [ ] `src/lib/storage.ts` の実装準備（プロンプト1で型のみ作成 → プロンプト3で実体実装）
- [ ] UIコンポーネントの設計指針を `docs/spec/` に落とす（Material Design 3 + 水色ベース）
- [ ] 復習ロジック（誤答抽出 + ランダム出題）の設計を `docs/spec/` に落とす
- [ ] 学習進捗率算出ロジックの設計を `docs/spec/` に落とす

---

## 実装待ちタスク

### フェーズ1：設計書生成（プロンプト1）

- [ ] `docs/01_requirements.md` に画面遷移図と機能一覧を記述
- [ ] `docs/02_data_schema.md` に LocalStorage / JSON / エクスポートの型定義を記述
- [ ] `docs/03_test_strategy.md` にテスト項目を記述
- [ ] `npm test` で初期テスト（Hello World）が100%パスする状態に整える

### フェーズ2：データ生成（プロンプト2）

- [ ] `data/syllabus.json` を生成（10章 × 5節以上）
- [ ] `data/quizzes.json` を生成（250問以上、解説付き4択）
- [ ] 生成したJSONが `docs/02_data_schema.md` の型定義と完全に一致するようバリデーション
- [ ] 重複情報の統合と最新情報への更新

### フェーズ3：フルスタック実装（プロンプト3）

- [ ] `src/lib/storage.ts` の実体実装（LocalStorage永続化 + インポート/エクスポート）
- [ ] テスト（storage周り）を全件パスさせる
- [ ] Material Design 3 準拠のUIコンポーネント実装（水色ベース）
- [ ] 復習ロジック（誤答問題のみランダム抽出エンジン）を実装
- [ ] 節の読了フラグと章ごとの学習進捗率（%）表示を実装
- [ ] `npm test` で全テストパス、`npm run build` でビルド成功

---

## 完了記録

なし（本番実装未着手）
