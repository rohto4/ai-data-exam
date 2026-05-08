# ai-data-exam Agent Instructions

## 最優先ルール

1. 日本語で対応する。
2. すべてのファイルは UTF-8 として読み書きする。
3. 文字化けしたテンプレートをそのまま展開しない。意図と構成を保って、日本語の文書として作り直す。
4. secret、トークン、Cookie、未公開の認証情報をリポジトリに書かない。
5. 試験勉強サイトとして、著作権、個人情報、解答の正確性、誤学習リスクを常に考慮する。
6. `docs/candi-ref/tech-stack.md` の Teams-work / コミット / 復帰ルールは、本PJの実務上の優先指針として扱う。

## PJの扱い

このPJは、試験勉強サイトを設計・実装・運用するためのリポジトリです。

主に次を管理します。

- 学習体験、出題体験、復習導線の設計
- 画面仕様、データ構造、API方針
- 実装候補、調査メモ、運用ガイド
- ユーザー確認事項、実装タスク、完了記録
- セッションごとの作業記録

## 読み込み順

1. `AGENTS.md`
2. `PROJECT.md` ← 現在のフェーズと次タスクへのポインタがある
3. `docs/imp/user-tasks.md` ← ユーザーが次に確認・操作すること
4. 必要に応じて `docs/imp/user-judge.md`（ユーザー判断待ち）
5. 必要に応じて `docs/imp/imp-tasks.md`（実装待ちタスク）
6. 必要に応じて `docs/imp/imp-comp.md`（完了記録）
7. 必要に応じて `docs/guide/opencode/oc-active-init.md`
8. 必要に応じて `.agents/skills/*/SKILL.md`
9. 必要に応じて `commands/*.md`

## Teams-work の扱い

本PJでは、`docs/candi-ref/tech-stack.md` に記載された Teams-work 系のルールを重視する。

- コミットは、各フェーズや大きな分割点、検証通過直後など適切なタイミングで行う。
- 失敗・ハング・復帰の経緯は、必要に応じて `docs/diary/YYYYMMDD-teamswork.md` に記録する。
- 途中復帰が必要な場合は、最後に成功した地点を明記し、責務を小さく切り直して再開する。
- サブエージェント連携や長文作業では、`tech-stack.md` の連携制約を優先して参照する。

## OpenCode設定の持ち込み

次以降のPJで、`docs/guide/opencode/` 配下に次のファイル・フォルダが置かれている場合は、初期処理として `docs/guide/opencode/oc-active-init.md` を読む。

- `docs/guide/opencode/oc-active-init.md`
- `docs/guide/opencode/project-root/`
- `docs/guide/opencode/project-dot-opencode/`
- `docs/guide/opencode/global-config/`

`oc-active-init.md` は、OpenCode / oh-my-openagent / Chutes 用設定を正しい場所へ配置するためのAI向け手順書として扱う。
グローバルセットアップ（全マシン一度）とPJごとのセットアップの2段階に分かれている。
既に完了しているかどうかを自動検出してからスキップまたは実行する。
この処理では secret やAPIキーを書き込まず、既存設定がある場合はバックアップしてから配置する。

## 情報の置き場所

- `docs/guide/`: 採用済みの運用手順・復旧手順・作業ガイド。ローカル実行、ビルド、デプロイ、ログ確認、ツール設定配置など。
- `docs/spec/`: 実装や運用の前提として確定した仕様。画面、問題形式、採点、進捗、認証、権限、安全要件など。
- `docs/candi-ref/`: 候補案、比較中の案、未採用案、調査メモ。採用が決まった内容は `docs/spec/` または `docs/guide/` に移す。
- `docs/imp/`: 実装メモ、作業計画、完了記録、ユーザー作業
- `docs/diary/`: セッション単位の作業記録
- `docs/setting/`: 初期化用テンプレート、設定資料

各フォルダの運用:

- `docs/guide/`, `docs/spec/`, `docs/candi-ref/`, `docs/imp/` の直下は、それぞれ最大10ファイル程度を目安にする。
- ただし、異なる責務を無理に統合して巨大化する場合は、10ファイル制約よりも「1ファイル1責務」を優先する。
- 細かいファイルを増やす前に、既存テーマのファイルへ統合できるかを確認する。
- 確定仕様は `docs/spec/`、採用済み手順は `docs/guide/`、未確定候補は `docs/candi-ref/`、実装作業は `docs/imp/` に置く。
- セッション記録や引き継ぎは `docs/diary/` に置く。

## `docs/imp/` の命名と運用

今後のPJでも、実装主体とユーザー主体をファイル名で分ける。

- `imp-*`: AI/実装者が見る・更新するファイル。実装状況、実装待ち、実装方針、完了記録、技術判断を置く。
- `user-*`: ユーザーが見る・更新判断するファイル。ユーザー作業、実機確認、運用操作、判断待ちを置く。
- ユーザーが見るべきものは `user-*` だけで把握できる状態にする。
- 実装者が見るべきものは `imp-*` だけで把握できる状態にする。
- セッション記録や引き継ぎは `docs/diary/` に置き、`docs/imp/` 直下に一時的な handoff / tasks-now のような曖昧なファイルを増やさない。

実装者の基本読み順:

1. `docs/imp/imp-tasks.md`（実装待ち）
2. 必要に応じて `docs/imp/imp-plan.md`（大枠計画）
3. 必要に応じて `docs/spec/*`（確定仕様）
4. 完了確認として `docs/imp/imp-comp.md`

実装時の更新先:

- 実装待ちの状態変更: `docs/imp/imp-tasks.md`
- 完了記録: `docs/imp/imp-comp.md`
- 実装方針やロードマップ変更: `docs/imp/imp-plan.md`
- 確定仕様: `docs/spec/*`
- ユーザー判断が必要になったもの: `docs/imp/user-judge.md`
- ユーザーに実機確認してほしいもの: `docs/imp/user-tasks.md`
- セッション記録・引き継ぎ: `docs/diary/*`

判断待ちの扱い:

- 実装中にユーザー判断が必要と分かったものは、`imp-tasks.md` に曖昧に残さず `user-judge.md` に移す。
- ユーザー判断が済んで実装可能になったら、必要な作業だけ `imp-tasks.md` に戻す。
- ユーザーの操作・確認だけで済むものは `user-tasks.md` に置き、`imp-tasks.md` には置かない。

## 回答方針

- 通常回答は短く、結論と次の行動を優先する。
- 詳細説明、比較、展開を求められた場合だけ十分に掘り下げる。
- 試験勉強サイト運用に関わる判断では、著作権、個人情報、誤答、誤学習、年齢配慮、課金や成績に関わる誤解のリスクを明示する。
- 不確かな最新情報、外部サービス仕様、法務・規約事項は確認してから扱う。

## ECCの扱い

- ECC由来のskillは `.agents/skills/` にコピー済みのものを優先して使う。
- ECC全体、hooks、`.codex/config.toml` は標準では導入しない。
- `commands/` はECCまたはecc-expand由来の試用command置き場として扱う。
