# Phase3 教本増設・用語解説・模試分離 計画

## TL;DR
> **概要**: 既存の教本データを正本化しつつ、各節の本文を専門学習に足る密度まで増補し、専門用語のクリック解説と専用の50問ランダム模試を追加する。
> **成果物**: 教本文本の増補、用語ポップオーバー、模試ページ、失敗問題の蓄積と復習導線、関連テスト更新。
> **工数**: Large
> **Parallel**: NO（本文増補とデータ正本化を優先し、後続UIを順次接続）
> **Critical Path**: 正本統合 → 教本増補 → 用語辞書/UI → 模試 → 復習統合 → テスト

## Context
### Original Request
教本を学習可能な状態に戻し、シラバス本文を補完し、専門用語の短文解説をクリックで見せ、50問ランダムの模試を独立ページ化して、失敗問題を蓄積・復習できるようにすること。
### Interview Summary
既存リポジトリでは `data/content/ch*/sec*.md` が実教材の本体で、`data/syllabus.json` がアプリ入力、`syllabus_v2_structure.json` は `TBD` の候補版だった。既存の `Quiz` / `Review` / `ChapterDetail` には復習の土台があるため、模試と用語ポップオーバーをその上に積む方針にした。
### Metis Review (gaps addressed)
Metis は呼び出し先モデル不整合で取得できなかったため、代わりに Oracle の指摘を反映した。主な補強点は、正本の統一、用語辞書の出典、50問模試の乱数規則、模試と通常復習の切り分け、ストレージ移行の明示である。

## Work Objectives
### Core Objective
試験合格用の短文集ではなく、専門家レベル到達を支える教本・用語辞書・模試・復習導線を一体で整える。
### Deliverables
1. `data/content/*` を正本とした教本本文の増補
2. `data/glossary.json` と本文中の用語マーカー
3. `/mock-exam` の50問ランダム模試
4. 模試由来の失敗問題を既存復習へ統合する履歴
5. 回帰テストとビルド確認
### Definition of Done (verifiable conditions with commands)
* `npm test` が通る
* `npm run build` が通る
* 主要画面（Dashboard/ChapterDetail/SectionDetail/MockExam/Review）を回せる
* 1節あたりの本文量と用語ポップオーバーが機械的に確認できる
### Must Have
* 日本語の本文・解説・ドキュメント
* 公式参照の明示
* クリック式の短文ポップオーバー
* 50問ランダム模試の再挑戦
* 失敗問題の蓄積と個別復習
### Must NOT Have (guardrails, AI slop patterns, scope boundaries)
* 根拠のない事実や数値の捏造
* hover 専用の用語解説
* 模試の途中で問題集合が変わる挙動
* 既存復習履歴の破壊
* 英語のままの成果物本文

## Verification Strategy
> ZERO HUMAN INTERVENTION - all verification is agent-executed.
- Test decision: TDD中心 + コンテンツ検証テスト + 回帰テスト
- QA policy: Every task has agent-executed scenarios
- Evidence: .sisyphus/evidence/task-{N}-{slug}.{ext}

## Execution Strategy
### Parallel Execution Waves
> 本計画は実運用では順次実行を前提にし、依存関係の薄い補助作業のみ並列化候補として扱う。

Wave 1: [source-of-truth normalization and content audit]
Wave 2: [chapter content expansion]
Wave 3: [glossary / popover foundation]
Wave 4: [mock-exam page and review integration]
Wave 5: [tests, regression, docs]

### Dependency Matrix (full, all tasks)
### Agent Dispatch Summary (wave → task count → categories)

## TODOs
> Implementation + Test = ONE task. Never separate.
> EVERY task MUST have: Agent Profile + Parallelization + QA Scenarios.

- [x] 1. 教本データの正本統合と台帳整備

  **What to do**: `data/content/ch*/meta.json` と `data/content/ch*/sec*.md` を正本として扱う方針を確定し、`data/syllabus.json` をその出力物として再生成できる状態にする。`data/syllabus_v2_structure.json` は参照用候補に隔離し、アプリは使わない。各章に `docs/candi-ref/reference-urls.md` 由来の公式参照を付与し、後続の本文増補が「どの根拠で書かれたか」を追跡できる台帳を作る。

  **Must NOT do**: 未確認の事実を本文に混ぜない。`syllabus_v2_structure.json` をアプリ本体の入力として復活させない。英数字のままの雑な草案を成果物に残さない。

  **Recommended Agent Profile**:
  - Category: `deep` - Reason: データ正本と参照台帳の整理は全体依存が多い
  - Skills: [`coding-standards`, `documentation-lookup`] - Why needed: 既存スキーマと公式情報の整合
  - Omitted: [`frontend-design`] - Why not needed: 画面変更は後続で十分

  **Parallelization**: Can Parallel: NO | Wave 1 | Blocks: 2-4 | Blocked By: なし

  **References**:
  - Pattern: `data/content/ch01/meta.json` - 節本文の実体と `contentPath` の持ち方
  - Pattern: `data/content/ch10/meta.json` - 最終章のメタ定義の揃え方
  - Pattern: `data/syllabus.json` - 現在アプリが読む統合データ
  - Pattern: `data/syllabus_v2_structure.json` - `TBD` の候補版
  - Pattern: `docs/02_data_schema.md` - データのSSOTと JSON スキーマ
  - Pattern: `docs/candi-ref/reference-urls.md` - 公式情報の参照元台帳
  - Pattern: `src/test/schema.validation.test.ts` - スキーマ検証の既存パターン

  **Acceptance Criteria** (agent-executable only):
  - [ ] `data/syllabus.json` の各節に本文が入っており、空本文/placeholder が残らない
  - [ ] 章ごとの参照リンクが `references` として追跡可能になる
  - [ ] `npm test` でスキーマ検証が通る

  **QA Scenarios**:
  ```
  Scenario: 正本データの再生成
    Tool: Bash
    Steps: data/content 配下の markdown を元に syllabus を生成する処理を実行し、生成後の data/syllabus.json を検証する
    Expected: 章数10・節数60・本文あり・参照ありが機械的に確認できる
    Evidence: .sisyphus/evidence/task-1-source-truth.md

  Scenario: 候補版の隔離
    Tool: Bash
    Steps: syllabus_v2_structure.json を参照してもアプリの表示やテストに影響しないことを確認する
    Expected: 画面/テストは syllabus.json 側のみを利用し、TBD が露出しない
    Evidence: .sisyphus/evidence/task-1-deprecated-structure.md
  ```

  **Commit**: YES | Message: `data: normalize syllabus source of truth` | Files: [data/syllabus.json, data/content/**, src/test/schema.validation.test.ts, docs/candi-ref/reference-urls.md]

- [x] 2. 第1〜3章の教本文本を専門学習レベルへ増補

  **What to do**: 第1〜3章の各節を、定義→背景→比較→実務/試験論点→要点の順で再構成し、各節 2,000〜3,000 字以上を目安に増補する。`[[用語ID]]` 形式のポップオーバー用マーカーを埋め込み、各節に少なくとも1つ以上の公式参照を紐づける。

  **Must NOT do**: 不明な数値や固有事例を捏造しない。要約だけで終わらせない。章をまたぐ重複説明を無駄に増やさない。

  **Recommended Agent Profile**:
  - Category: `writing` - Reason: 長文の教材化が主目的
  - Skills: [`documentation-lookup`, `coding-standards`] - Why needed: 公式根拠と日本語品質の担保
  - Omitted: [`e2e-testing`] - Why not needed: この段階は本文品質に集中

  **Parallelization**: Can Parallel: NO | Wave 2 | Blocks: 3-4 | Blocked By: 1

  **References**:
  - Pattern: `data/content/ch01/sec01.md` - DX とデータドリブン経営の粒度
  - Pattern: `data/content/ch02/sec04.md` - 法令・規制の書き方
  - Pattern: `data/content/ch03/sec06.md` - 技術戦略の整理
  - Pattern: `docs/candi-ref/reference-urls.md` - IPA/JDLA/公式資料の参照先
  - Pattern: `src/pages/SectionDetail.tsx` - 現在の本文表示ポイント

  **Acceptance Criteria** (agent-executable only):
  - [ ] 第1〜3章の全節に本文があり、1節あたり2,000字以上を満たす
  - [ ] 各節に試験重要語の補足があり、用語マーカーが埋め込まれている
  - [ ] 章末に要点整理があり、参照元が確認できる

  **QA Scenarios**:
  ```
  Scenario: 節本文の可読性確認
    Tool: interactive_bash
    Steps: 第1章〜第3章の各節を表示し、本文が 2000 字前後の説明文として読めるか確認する
    Expected: タイトルだけでなく、定義・比較・要点が画面に表示される
    Evidence: .sisyphus/evidence/task-2-ch01-03-readability.md

  Scenario: 用語マーカーの混入確認
    Tool: Bash
    Steps: 第1〜3章の markdown を検索し、[[...]] 形式のマーカーと参照記述を確認する
    Expected: 主要専門語にクリック対象のマーカーが入っている
    Evidence: .sisyphus/evidence/task-2-ch01-03-markers.md
  ```

  **Commit**: YES | Message: `content: expand chapters 1 through 3` | Files: [data/content/ch01/**, data/content/ch02/**, data/content/ch03/**]

- [ ] 3. 第4〜7章の教本文本を専門学習レベルへ増補

  **What to do**: 統計・機械学習・深層学習・生成AI/LLMの4章を、試験対策として必要な数式・概念比較・典型誤答・実務接続を含む解説へ拡張する。試験で引っかかりやすい専門用語には短い定義を差し込み、ポップオーバーへつなぐ。

  **Must NOT do**: 理論を雑に圧縮しすぎない。LLM/生成AIの新語を説明なしで並べない。誤答誘発の曖昧表現を残さない。

  **Recommended Agent Profile**:
  - Category: `writing` - Reason: 試験向けの日本語説明が中心
  - Skills: [`documentation-lookup`, `tdd-workflow`] - Why needed: 根拠確認と後続テストを見越した分割
  - Omitted: [`frontend-patterns`] - Why not needed: このタスクは本文生成中心

  **Parallelization**: Can Parallel: NO | Wave 2 | Blocks: 4-5 | Blocked By: 1, 2

  **References**:
  - Pattern: `data/content/ch04/sec02.md` - 仮説検定・分布の粒度
  - Pattern: `data/content/ch05/sec03.md` - 代表的機械学習概念の書き方
  - Pattern: `data/content/ch06/sec04.md` - 深層学習の構成要素
  - Pattern: `data/content/ch07/sec08.md` - 生成AI/LLMの最新論点
  - Pattern: `docs/candi-ref/reference-urls.md` - 公式参照先

  **Acceptance Criteria** (agent-executable only):
  - [ ] 第4〜7章の全節に本文があり、1節あたり2,000字以上を満たす
  - [ ] 各節に少なくとも1つの試験重要語マーカーがある
  - [ ] 生成AI/LLM章に最新論点の注意書きがある

  **QA Scenarios**:
  ```
  Scenario: 理論節の過不足確認
    Tool: Bash
    Steps: 第4〜7章の markdown を確認し、定義・比較・注意点・要点の4層があるかを見る
    Expected: 単なる用語羅列ではなく学習できる本文になっている
    Evidence: .sisyphus/evidence/task-3-ch04-07-structure.md

  Scenario: 用語解説の一貫性確認
    Tool: interactive_bash
    Steps: 主要用語をクリックしてポップオーバー表示を想定し、短文で要点が出る前提を確認する
    Expected: 300字以内で要点が説明される
    Evidence: .sisyphus/evidence/task-3-ch04-07-terms.md
  ```

  **Commit**: YES | Message: `content: expand chapters 4 through 7` | Files: [data/content/ch04/**, data/content/ch05/**, data/content/ch06/**, data/content/ch07/**]

- [ ] 4. 第8〜10章の教本文本を専門学習レベルへ増補

  **What to do**: AIエージェント/MLOps、倫理・規制、実践プロジェクトの3章を、運用・ガバナンス・実装・評価まで含む実践教材へ再構成する。実践章ではケーススタディ、失敗例、意思決定の観点を増やして、単なる定義集にしない。

  **Must NOT do**: 倫理・規制を軽視しない。実践プロジェクト章を抽象論だけで埋めない。製品名や法律名を誤記しない。

  **Recommended Agent Profile**:
  - Category: `writing` - Reason: 実務寄りの説明文が必要
  - Skills: [`documentation-lookup`, `security-review`] - Why needed: 法規制・ガバナンスの正確性
  - Omitted: [`frontend-design`] - Why not needed: 本文品質が最優先

  **Parallelization**: Can Parallel: NO | Wave 2 | Blocks: 5 | Blocked By: 1, 3

  **References**:
  - Pattern: `data/content/ch08/sec01.md` - AIエージェント/MLOps の実務記述
  - Pattern: `data/content/ch09/sec02.md` - 倫理・規制の論点整理
  - Pattern: `data/content/ch10/sec01.md` - 実践プロジェクト章の構成
  - Pattern: `docs/candi-ref/reference-urls.md` - 公式参照先

  **Acceptance Criteria** (agent-executable only):
  - [ ] 第8〜10章の全節に本文があり、1節あたり2,000字以上を満たす
  - [ ] 実務・倫理・規制の各章に試験対策上の注意点が入っている
  - [ ] 章末に参照リンクがある

  **QA Scenarios**:
  ```
  Scenario: 実践章の学習性確認
    Tool: interactive_bash
    Steps: 第10章の節を表示し、ケース・観点・注意点が揃っているか確認する
    Expected: 実践で使える判断材料が本文に含まれている
    Evidence: .sisyphus/evidence/task-4-ch08-10-practice.md

  Scenario: 倫理・規制の誤記チェック
    Tool: Bash
    Steps: 第9章の本文から法令名・規制名・略語を抽出して目視確認する
    Expected: 誤記や曖昧な断定がない
    Evidence: .sisyphus/evidence/task-4-ch08-10-compliance.md
  ```

  **Commit**: YES | Message: `content: expand chapters 8 through 10` | Files: [data/content/ch08/**, data/content/ch09/**, data/content/ch10/**]

- [ ] 5. 用語辞書とクリック式ポップオーバー基盤を追加

  **What to do**: `data/glossary.json` を新設し、各節の `[[termId]]` マーカーをクリックすると最大300字程度の解説を小窓表示できるようにする。SectionDetail だけでなく、ChapterDetail の節要約でも同じ用語体系を使えるようにする。popover はクリック開閉・外側クリックで閉じる・ESC で閉じる・キーボード操作対応を必須とする。

  **Must NOT do**: hover 専用にしない。長文解説をそのまま表示しない。用語IDと表示名を混同しない。

  **Recommended Agent Profile**:
  - Category: `visual-engineering` - Reason: クリック小窓の体験設計が重要
  - Skills: [`frontend-patterns`, `frontend-design`] - Why needed: React UI と視認性の両立
  - Omitted: [`backend-patterns`] - Why not needed: 主要実装はフロント中心

  **Parallelization**: Can Parallel: NO | Wave 3 | Blocks: 6 | Blocked By: 1-4

  **References**:
  - Pattern: `src/pages/SectionDetail.tsx` - 現在の本文表示箇所
  - Pattern: `src/pages/ChapterDetail.tsx` - 節一覧からの流用候補
  - Pattern: `src/components/AppBar.tsx` - UIトーンの揃え方
  - Pattern: `docs/spec/ui-design-guide.md` - Material Design 3 の基準
  - Pattern: `docs/candi-ref/reference-urls.md` - 用語の出典管理

  **Acceptance Criteria** (agent-executable only):
  - [ ] `[[termId]]` のクリックで短い定義が小窓表示される
  - [ ] 小窓は 300 字以内で、50〜300 字程度でも成立する
  - [ ] ESC と外側クリックで閉じる
  - [ ] キーボード操作で開閉できる

  **QA Scenarios**:
  ```
  Scenario: 用語ポップオーバーの表示
    Tool: Playwright
    Steps: SectionDetail で専門用語をクリックし、popover の本文と閉じる操作を確認する
    Expected: 短い解説が表示され、クリック外しで閉じる
    Evidence: .sisyphus/evidence/task-5-glossary-popover.png

  Scenario: アクセシビリティ確認
    Tool: Playwright
    Steps: キーボードだけで用語へフォーカスし、Enter/Space で開閉する
    Expected: マウスなしでも同じ情報に到達できる
    Evidence: .sisyphus/evidence/task-5-glossary-a11y.png
  ```

  **Commit**: YES | Message: `ui: add glossary popover foundation` | Files: [data/glossary.json, src/pages/SectionDetail.tsx, src/pages/ChapterDetail.tsx, src/components/*]

- [ ] 6. 専用の50問ランダム模試ページを追加

  **What to do**: `/mock-exam` を新設し、`data/quizzes.json` から重複なしのランダム50問を毎回抽出する模試を実装する。開始時に50問セットを固定し、途中更新や再読込でも同じ試行を復元できるようにする。終了後はスコア、正答率、誤答一覧を表示し、「新しい50問で再挑戦」を必ず出す。

  **Must NOT do**: 時間制限や合格判定を勝手に追加しない。出題中に問題順を不意に変えない。問題を50未満で終わらせない。

  **Recommended Agent Profile**:
  - Category: `unspecified-high` - Reason: ルーティング、状態管理、データ抽出をまたぐ
  - Skills: [`frontend-patterns`, `tdd-workflow`] - Why needed: 状態遷移とテスト先行
  - Omitted: [`security-review`] - Why not needed: 機微情報は扱わない

  **Parallelization**: Can Parallel: NO | Wave 4 | Blocks: 7-8 | Blocked By: 1, 5

  **References**:
  - Pattern: `src/pages/Quiz.tsx` - 既存の問題出題フロー
  - Pattern: `src/pages/Review.tsx` - 復習画面との整合
  - Pattern: `src/components/AppBar.tsx` - ナビゲーション追加箇所
  - Pattern: `src/lib/storage.ts` - 模試試行の永続化方針
  - Pattern: `docs/spec/review-logic.md` - 出題・復習の考え方

  **Acceptance Criteria** (agent-executable only):
  - [ ] `/mock-exam` で 50 問セットが開始できる
  - [ ] 同一試行中は 50 問の集合が変わらない
  - [ ] 2 回連続で開始すると別の乱数セットになる
  - [ ] 完了後に正答率と誤答一覧が表示される

  **QA Scenarios**:
  ```
  Scenario: 50問模試の開始
    Tool: Playwright
    Steps: /mock-exam にアクセスし、開始ボタンで 50 問が表示されるまで進める
    Expected: 進捗が 1/50 から始まり、50問で完了する
    Evidence: .sisyphus/evidence/task-6-mock-exam-start.png

  Scenario: 再挑戦のランダム性
    Tool: Playwright
    Steps: 1回完了後に「新しい50問で再挑戦」を押し、問題セットを比較する
    Expected: 少なくとも一部の問題が変わる
    Evidence: .sisyphus/evidence/task-6-mock-exam-randomness.png
  ```

  **Commit**: YES | Message: `feat: add dedicated mock exam route` | Files: [src/pages/MockExam.tsx, src/App.tsx, src/components/AppBar.tsx, data/quizzes.json]

- [ ] 7. 模試結果・失敗問題の蓄積・復習導線を統合

  **What to do**: 模試の誤答を既存の `MistakeHistory` に蓄積しつつ、模試由来であることを識別できるようにする。`Review` 画面は学習由来/模試由来/全部の切り替えを持ち、模試結果画面から個別復習へ遷移できるようにする。必要なら `MockExamAttempt` の履歴キーを追加して、過去の模試セットと成績を追跡する。

  **Must NOT do**: 模試の失敗が通常復習に混ざるだけで終わらせない。履歴を上書きして消さない。既存の復習優先順位を壊さない。

  **Recommended Agent Profile**:
  - Category: `deep` - Reason: 既存復習ロジックとの整合が必要
  - Skills: [`backend-patterns`, `tdd-workflow`] - Why needed: 状態更新と履歴設計
  - Omitted: [`frontend-design`] - Why not needed: 見た目よりデータ整合

  **Parallelization**: Can Parallel: NO | Wave 4 | Blocks: 6-8 | Blocked By: 1, 5, 6

  **References**:
  - Pattern: `src/pages/Review.tsx` - 現行の復習優先順位
  - Pattern: `src/lib/storage.ts` - 履歴・進捗の保存先
  - Pattern: `docs/spec/review-logic.md` - 再抽出と完了条件
  - Pattern: `src/pages/Quiz.tsx` - 誤答記録の現行フロー

  **Acceptance Criteria** (agent-executable only):
  - [ ] 模試の誤答が既存履歴に蓄積される
  - [ ] Review 画面で模試由来の誤答を確認・復習できる
  - [ ] 模試の試行履歴が再表示できる

  **QA Scenarios**:
  ```
  Scenario: 模試誤答の蓄積
    Tool: Playwright
    Steps: 模試で誤答を作り、Review 画面で同じ問題が復習対象に出ることを確認する
    Expected: 失敗問題が蓄積され、個別復習に進める
    Evidence: .sisyphus/evidence/task-7-mock-exam-history.png

  Scenario: 模試/通常学習の切り替え
    Tool: Playwright
    Steps: Review 画面で由来フィルタを切り替える
    Expected: 模試由来だけ/全部の見え方を切り替えられる
    Evidence: .sisyphus/evidence/task-7-review-filter.png
  ```

  **Commit**: YES | Message: `feat: unify mock exam misses with review flow` | Files: [src/pages/Review.tsx, src/lib/storage.ts, src/pages/MockExam.tsx, src/test/**]

- [ ] 8. テスト・回帰・ビルド・文書の最終整備

  **What to do**: コンテンツ長、用語マーカー、模試の50問固定、履歴蓄積、ナビゲーション追加をテストで固める。必要に応じて Playwright の E2E を追加し、最後にビルドを通す。`docs/imp/*` と `PROJECT.md` のフェーズ表記が古いままなら、実態に合わせて整理する。

  **Must NOT do**: テストを手動確認だけで済ませない。失敗率の高いE2Eを放置しない。文書と実装のズレを残さない。

  **Recommended Agent Profile**:
  - Category: `unspecified-high` - Reason: 横断回帰とビルド確認
  - Skills: [`e2e-testing`, `verification-loop`, `tdd-workflow`] - Why needed: 総合検証
  - Omitted: [`frontend-design`] - Why not needed: 最終段階は品質保証中心

  **Parallelization**: Can Parallel: NO | Wave 5 | Blocks: 1-7 | Blocked By: 1-7

  **References**:
  - Pattern: `src/test/schema.validation.test.ts` - 既存のデータ検証
  - Pattern: `src/test/storage.test.ts` - ストレージの既存テスト
  - Pattern: `docs/imp/user-tasks.md` - 動作確認観点
  - Pattern: `README.md` - 起動・ビルド手順

  **Acceptance Criteria** (agent-executable only):
  - [ ] `npm test` が通る
  - [ ] `npm run build` が通る
  - [ ] 主要E2Eシナリオが緑になる

  **QA Scenarios**:
  ```
  Scenario: コンテンツと模試の回帰
    Tool: Bash
    Steps: npm test を実行し、教本文字数・用語マーカー・模試データの検証が全て通ることを確認する
    Expected: 失敗なしで完了する
    Evidence: .sisyphus/evidence/task-8-unit-regression.log

  Scenario: UI総合確認
    Tool: Playwright
    Steps: Dashboard → ChapterDetail → SectionDetail → MockExam → Review を一周する
    Expected: 各画面遷移が成立し、ポップオーバーと模試再挑戦が動く
    Evidence: .sisyphus/evidence/task-8-e2e-flow.png
  ```

  **Commit**: YES | Message: `test: lock down Phase3 content and mock exam` | Files: [src/test/**, docs/imp/**, README.md]

## Final Verification Wave (MANDATORY — after ALL implementation tasks)
> 4 review agents run in PARALLEL. ALL must APPROVE. Present consolidated results to user and get explicit "okay" before completing.
> **Do NOT auto-proceed after verification. Wait for user's explicit approval before marking work complete.**
> **Never mark F1-F4 as checked before getting user's okay.** Rejection or user feedback -> fix -> re-run -> present again -> wait for okay.
- [ ] F1. Plan Compliance Audit — oracle
- [ ] F2. Code Quality Review — unspecified-high
- [ ] F3. Real Manual QA — unspecified-high (+ playwright if UI)
- [ ] F4. Scope Fidelity Check — deep

## Commit Strategy
* 正本統合完了時に1回
* 教本3章単位の増補完了ごとに1回
* ポップオーバーと模試統合完了時に1回
* 最終テスト通過後に1回
* 失敗時は小さく切って再開し、最後に成功した地点を明記する
## Success Criteria
* 教本が学習に足る密度で読める
* 専門用語の短文解説が即時に開く
* 模試を何度でも50問単位で回せる
* 間違えた問題が蓄積され、個別復習できる
* テストとビルドが継続して通る
