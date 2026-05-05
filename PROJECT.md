# ai-data-exam Project Context

## 目的

試験勉強サイトを設計・実装・運用する。

ここでいう試験勉強サイトは、単なる静的ページではなく、学習計画、問題演習、理解確認、復習導線、将来的な運用判断まで含めて扱う。

## 作業入口

- ユーザー確認・操作 → [`docs/imp/user-tasks.md`](docs/imp/user-tasks.md)
- ユーザー判断待ち → [`docs/imp/user-judge.md`](docs/imp/user-judge.md)
- 実装待ち → [`docs/imp/imp-tasks.md`](docs/imp/imp-tasks.md)

`imp-*` / `user-*` の運用ルールは [`AGENTS.md`](AGENTS.md) を正とする。

## 主な機能・成果物

- 学習体験と画面導線の整理
- 問題形式、採点、復習、進捗管理の設計
- フロントエンド、バックエンド、データ構造の整備
- 実装に渡せる仕様・運用ルール・調査記録の整備
- 候補案、比較、未決事項の記録

## 優先度モデル

1. `AGENTS.md`: agent共通の最上位ルール
2. `PROJECT.md`: PJ固有の目的、構成、運用方針
3. `docs/guide/`: 採用済みの運用手順・復旧手順・作業ガイド
4. `docs/spec/`: 実装や運用の前提として確定した仕様
5. `docs/candi-ref/`: 候補案、比較中の案、未採用案、調査メモ
6. `docs/imp/`: 作業計画、実装メモ、完了記録
7. `docs/diary/`: セッション記録
8. `docs/setting/`: 初期化とテンプレート
9. `.agents/skills/`: 必要時に読むECC由来skill
10. `commands/`: 必要時に読むECC/ecc-expand由来command

## ECCコピー元

- ECC: `G:\devwork\clone-dir\everything-claude-code`
- ecc-expand: `G:\devwork\clone-dir\ecc-expand`

## 取り込み対象skill

- `api-design`
- `backend-patterns`
- `coding-standards`
- `documentation-lookup`
- `e2e-testing`
- `frontend-design`
- `frontend-patterns`
- `nextjs-turbopack`
- `product-capability`
- `security-review`
- `tdd-workflow`
- `verification-loop`

## 取り込み対象command

- `expand-answer.md`
- `prp-plan.md`
- `prp-implement.md`
- `prp-prd.md`

## 運用ルール

- 採用済みの運用手順は `docs/guide/` に移す。
- 確定仕様、要件、設計前提は `docs/spec/` に移す。
- 未確定の案、比較、調査、未採用案は `docs/candi-ref/` に置く。
- 一時メモは `docs/memo.md` に置いてよいが、確定したら適切な場所へ移す。
- 学習コンテンツの正確性に関する決定は、可能な限り理由と根拠も残す。
- 外部サービスの最新仕様や規約に依存する内容は、必要時に公式情報を確認する。
- 日報でファイルを説明する時は、`[ファイルの意味（日本語優先）](相対パス)` の形にし、リンクラベルにファイル名をそのまま使わない。
