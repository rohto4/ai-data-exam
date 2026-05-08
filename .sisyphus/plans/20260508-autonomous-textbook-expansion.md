# 博士レベルの教本増築と現状同期プラン

## TL;DR
> **Summary**: 現状のドキュメント矛盾を先に解消し、その後に学習本文を「長く・深く・密度高く」増築して、試験合格だけでなく専門家レベルに近づく教材へ寄せる。
> **Deliverables**:
> - 現状の正本化（PROJECT / imp / diary の状態整合）
> - 全章の教本本文を博士レベルの密度へ増築
> - UI文言・復習導線・用語表記の整合
> - `npm test` / `npm run build` による最終検証
> **Effort**: Large
> **Parallel**: NO
> **Critical Path**: 現状同期 → 第1-3章増築 → 第4-6章増築 → 第7-10章増築 → UI/導線整合 → 検証

## Context
### Original Request
- セクションAは並列実行不可。
- 席を離れている前提で、自律駆動かつチームエージェントで進める。
- 失敗時はTeamswork Diaryで反省し、次に活かす。
- 本来の目的は、このウェブサイトを通して専門家レベルになるための教本を作ること。
- 以後は「任意増築は歓迎」、内容は長く詳細なほど良い。

### Interview Summary
- `PROJECT.md` と `imp-comp.md` のフェーズ記載が食い違っている。
- `imp-tasks.md` には残タスクが並んでいるが、`imp-comp.md` は Phase 2 完了を主張している。
- ユーザーはコンテンツ量の増加を懸念しないため、説明・背景・用語・例・注意点を徹底増築する方針でよい。

### Metis Review (gaps addressed)
- 先に文書状態を同期しないと、実装と記録のズレで無駄が出る。
- 「専門家レベル」は無限に膨張しうるため、本文増築の品質基準を明文化する必要がある。
- まず現状検証、その後に最小限の残課題実装、という順序を採用する。

## Work Objectives
### Core Objective
学習者が試験合格に必要な理解を超えて、各章の背景・理屈・関連概念・落とし穴・実務接続まで追える教本へ引き上げる。

### Deliverables
- 状態同期済みの作業基準
- 全章の詳細本文
- キーワード密度の高い補足説明
- 章・節ごとの参考文献/補足参照の整理
- 表示文言と復習導線の整合
- 検証ログと完了記録

### Definition of Done (verifiable conditions with commands)
- `npm test` が成功する。
- `npm run build` が成功する。
- 主要学習データの各節が、従来より明確に詳細化されていることを確認できる。
- `PROJECT.md` / `imp-*` / `diary` の「現在地」が矛盾なく読める。
- 教本本文が、各節で 2000〜3500字相当の情報量を目安に、定義・背景・例・注意点・関連語を含む。

### Must Have
- 内容は長く、詳細で、補足が多いこと。
- 章ごとの専門用語を増やし、各用語に短い定義を付けること。
- 誤解しやすい点は「なぜそうなるか」まで説明すること。
- 復習導線と進捗表現が本文増築と矛盾しないこと。

### Must NOT Have (guardrails, AI slop patterns, scope boundaries)
- 省略して読みやすさを優先しすぎない。
- 「概要だけ」で終わらせない。
- 章ごとのトーンや粒度がばらつきすぎない。
- 未検証の最新仕様や外部規約を断定しない。

## Verification Strategy
> ZERO HUMAN INTERVENTION - all verification is agent-executed.
- Test decision: 既存の Vitest + build 検証を継続（`npm test`, `npm run build`）。
- QA policy: 各作業に agent-executed の確認手順を必ず付ける。
- Evidence: `.sisyphus/evidence/task-{N}-{slug}.{ext}`

## Execution Strategy
### Parallel Execution Waves
> Section A is non-parallelizable, so **all waves are sequential**.

Wave 1: 状態同期と基準整備
Wave 2: 教本本文の増築（第1〜3章）
Wave 3: 教本本文の増築（第4〜6章）
Wave 4: 教本本文の増築（第7〜10章）
Wave 5: UI/導線・用語整合と最終検証

### Dependency Matrix (full, all tasks)
- 1 → 2/3/4 → 5

### Agent Dispatch Summary (wave → task count → categories)
- Wave 1 → 1 task → `unspecified-high`
- Wave 2 → 1 task → `writing`
- Wave 3 → 1 task → `writing`
- Wave 4 → 1 task → `writing`
- Wave 5 → 1 task → `unspecified-high`

## TODOs
> Implementation + Test = ONE task. Never separate.
> EVERY task MUST have: Agent Profile + Parallelization + QA Scenarios.

- [ ] 1. 現状同期と正本化

  **What to do**: `PROJECT.md` / `imp-tasks.md` / `imp-comp.md` / `user-tasks.md` / `user-judge.md` / `20260507-teamswork.md` を突き合わせ、現在のフェーズ・完了済み・未完了・判断待ちを1つの整合した状態に整理する。あわせて、今後の作業方針を「長く詳細な教本増築」へ固定する。

  **Must NOT do**: 新しい未確認の完了宣言を作らない。状態が曖昧なまま次工程へ進まない。

  **Recommended Agent Profile**:
  - Category: `unspecified-high` - Reason: 状態矛盾の解消と次工程の基準作りが必要
  - Skills: [`verification-loop`] - 重要な状態確認と再検証に使う
  - Omitted: [`tdd-workflow`] - まだ実装ではないため不要

  **Parallelization**: Can Parallel: NO | Wave 1 | Blocks: [2, 3, 4, 5] | Blocked By: []

  **References**:
  - `PROJECT.md` - フェーズ定義と現状説明
  - `docs/imp/imp-tasks.md` - 残タスク一覧と順序
  - `docs/imp/imp-comp.md` - 完了記録と実際の進捗
  - `docs/diary/20260507-teamswork.md` - 失敗時の運用ルール
  - `docs/02_data_schema.md` - 本文増築時も崩してはいけないデータ契約

  **Acceptance Criteria**:
  - [ ] 状態矛盾が「どこが食い違っているか」まで説明できる形で把握される。
  - [ ] 今後の方針が「詳細な教本増築を優先」に固定される。

  **QA Scenarios**:
  ```
  Scenario: 状態整合の確認
    Tool: Bash
    Steps: `git status --short` と主要ドキュメントの差分を確認し、現状と記録の不一致を列挙する
    Expected: 完了/未完了/判断待ちが1つの説明にまとまる
    Evidence: .sisyphus/evidence/task-1-state-sync.txt

  Scenario: 矛盾の再発防止
    Tool: Bash
    Steps: `PROJECT.md` と `docs/imp/imp-comp.md` の現在フェーズ記述を比較する
    Expected: 誤った完了宣言が残っていないことを確認できる
    Evidence: .sisyphus/evidence/task-1-state-sync-error.txt
  ```

  **Commit**: NO | Message: `docs(sync): align project state` | Files: [`PROJECT.md`, `docs/imp/*`, `docs/diary/*`]

- [ ] 2. 第1〜3章の博士レベル増築

  **What to do**: 学習本文を、定義→背景→全体像→具体例→反例→落とし穴→関連用語→復習ポイントの順で厚く書き換える。各節で「なぜそうなるか」を必ず含め、専門用語のミニ辞書的な説明を追加する。

  **Must NOT do**: 要約しすぎない。既存文より短くしない。例を1個で終わらせない。

  **Recommended Agent Profile**:
  - Category: `writing` - Reason: 長文の教材化に向く
  - Skills: [`documentation-lookup`, `coding-standards`] - 用語の整理と文章の一貫性に使う
  - Omitted: [`security-review`] - この章群では主題ではない

  **Parallelization**: Can Parallel: NO | Wave 2 | Blocks: [3, 4, 5] | Blocked By: [1]

  **References**:
  - `data/syllabus.json` / `data/syllabus_v2*.json` - 既存構造と節の粒度
  - `docs/DATA_FORMAT.md` - JSON構造の活用方針
  - `docs/02_data_schema.md` - Section content の契約
  - `docs/spec/ui-design-guide.md` - 表示上の読みやすさ基準

  **Acceptance Criteria**:
  - [ ] 第1〜3章の各節が、定義・背景・例・注意点・関連語を含む密度になっている。
  - [ ] 章ごとの用語と概念が、学習者が自習できる粒度まで補強される。

  **QA Scenarios**:
  ```
  Scenario: 本文密度の確認
    Tool: Bash
    Steps: 各節の文字数と見出し構成を集計し、短すぎる節を洗い出す
    Expected: 目標密度に達しているかが機械的に判定できる
    Evidence: .sisyphus/evidence/task-2-ch01-03-density.txt

  Scenario: 章内の用語厚み確認
    Tool: Bash
    Steps: 章ごとのキーワード一覧を抽出して、未説明の専門語が残っていないか確認する
    Expected: 学習用語の説明不足が減っている
    Evidence: .sisyphus/evidence/task-2-ch01-03-terms.txt
  ```

  **Commit**: NO | Message: `content(ch01-03): deepen textbook coverage` | Files: [`data/*`, `docs/*`]

- [ ] 3. 第4〜6章の博士レベル増築

  **What to do**: 統計・機械学習・深層学習の説明を、式や概念の直列説明だけで終えず、直感・前提・失敗例・評価観点・現場での使い分けまで書き足す。難語は定義→具体→誤解しやすい点の順で説明する。

  **Must NOT do**: 数式や定義を省略して曖昧にしない。

  **Recommended Agent Profile**:
  - Category: `writing` - Reason: 理論説明の長文化に向く
  - Skills: [`documentation-lookup`, `coding-standards`] - 用語の揺れ防止
  - Omitted: [`e2e-testing`] - まだUI検証フェーズではない

  **Parallelization**: Can Parallel: NO | Wave 3 | Blocks: [4, 5] | Blocked By: [1, 2]

  **References**:
  - `data/quizzes.json` - 問題と解説の主題
  - `docs/02_data_schema.md` - chapter/section/content の型
  - `docs/spec/review-logic.md` - 復習で拾うべき誤解点

  **Acceptance Criteria**:
  - [ ] 第4〜6章の説明が、直感・理論・評価・落とし穴の4層で読める。
  - [ ] 学習者が「知っている」ではなく「説明できる」状態を目指せる。

  **QA Scenarios**:
  ```
  Scenario: 理論説明の厚み確認
    Tool: Bash
    Steps: 各節で数式説明・直感説明・失敗例の有無を確認する
    Expected: 1要素欠落でない厚い説明になっている
    Evidence: .sisyphus/evidence/task-3-ch04-06-depth.txt

  Scenario: 誤解点のカバー確認
    Tool: Bash
    Steps: 用語ごとに「誤解しやすい点」を抽出する
    Expected: 重要用語に説明の穴がない
    Evidence: .sisyphus/evidence/task-3-ch04-06-pitfalls.txt
  ```

  **Commit**: NO | Message: `content(ch04-06): expand conceptual depth` | Files: [`data/*`, `docs/*`]

- [ ] 4. 第7〜10章の博士レベル増築

  **What to do**: 生成AI、エージェント、倫理、実践プロジェクトを、実装概念・運用・リスク・評価・社会的背景まで広げる。実践プロジェクト章は、学習の総合問題として読めるようにケース分解を厚くする。

  **Must NOT do**: 実践・倫理・規制の説明を薄くまとめない。

  **Recommended Agent Profile**:
  - Category: `writing` - Reason: ケースと背景を厚く書ける
  - Skills: [`documentation-lookup`, `security-review`] - 倫理・運用リスク整理に使う
  - Omitted: [`tdd-workflow`] - 本タスクは教材化が中心

  **Parallelization**: Can Parallel: NO | Wave 4 | Blocks: [5] | Blocked By: [1, 2, 3]

  **References**:
  - `data/quizzes.json` - 生成AI/エージェント/倫理/実践の問題軸
  - `docs/spec/review-logic.md` - 誤答復習の観点
  - `docs/spec/ui-design-guide.md` - 学習導線の視認性

  **Acceptance Criteria**:
  - [ ] 第7〜10章の各節に、実務上の注意・倫理上の注意・関連キーワードが揃う。
  - [ ] 実践プロジェクト章が、総復習教材として成立する。

  **QA Scenarios**:
  ```
  Scenario: 応用領域の説明厚み確認
    Tool: Bash
    Steps: 生成AI/エージェント/倫理/実践の各節について、背景・リスク・運用観点を抽出する
    Expected: 実務寄りの補足が十分に入っている
    Evidence: .sisyphus/evidence/task-4-ch07-10-depth.txt

  Scenario: ケース分解の確認
    Tool: Bash
    Steps: 実践プロジェクト章に具体ケースが複数あるか確認する
    Expected: 1ケースだけで終わっていない
    Evidence: .sisyphus/evidence/task-4-ch10-cases.txt
  ```

  **Commit**: NO | Message: `content(ch07-10): add advanced coverage` | Files: [`data/*`, `docs/*`]

- [ ] 5. UI/用語整合と最終検証

  **What to do**: ダッシュボード、節詳細、クイズ、復習、設定の文言・見出し・補助説明が、増築後の教材密度と矛盾しないように整える。最後に `npm test` と `npm run build` を通し、結果を Diary と完了記録へ反映する。

  **Must NOT do**: UI表記を短くしすぎて教材密度と齟齬を作らない。

  **Recommended Agent Profile**:
  - Category: `unspecified-high` - Reason: 広い範囲の整合と最終確認が必要
  - Skills: [`verification-loop`, `e2e-testing`] - 検証観点の整理に使う
  - Omitted: [`backend-patterns`] - この最終整合では優先度が低い

  **Parallelization**: Can Parallel: NO | Wave 5 | Blocks: [] | Blocked By: [1, 2, 3, 4]

  **References**:
  - `src/pages/*.tsx` - UI文言と導線
  - `src/lib/progress.ts` - 進捗表現の基準
  - `src/lib/storage.ts` - データ保存契約
  - `docs/spec/ui-design-guide.md` - 見た目と文言の方針
  - `docs/imp/imp-comp.md` - 完了記録の更新先

  **Acceptance Criteria**:
  - [ ] UI文言と教材の密度が一致している。
  - [ ] `npm test` が成功する。
  - [ ] `npm run build` が成功する。
  - [ ] Diary に今回の進め方と結果が記録される。

  **QA Scenarios**:
  ```
  Scenario: UI文言と教材密度の整合
    Tool: Bash
    Steps: 画面文言と本文の粒度を比較し、短すぎる説明が残っていないか確認する
    Expected: 学習者向けの補助説明が増築後の本文に追随している
    Evidence: .sisyphus/evidence/task-5-ui-alignment.txt

  Scenario: 最終検証
    Tool: Bash
    Steps: `npm test` と `npm run build` を実行する
    Expected: どちらも成功し、完了ログに残せる
    Evidence: .sisyphus/evidence/task-5-verification.txt
  ```

  **Commit**: NO | Message: `chore(release): align content and verify` | Files: [`src/*`, `docs/*`]

## Final Verification Wave (MANDATORY — after ALL implementation tasks)
> 4 review agents run in PARALLEL. ALL must APPROVE. Present consolidated results to user and get explicit "okay" before completing.
> **Do NOT auto-proceed after verification. Wait for user's explicit approval before marking work complete.**
> **Never mark F1-F4 as checked before getting user's okay.** Rejection or user feedback -> fix -> re-run -> present again -> wait for okay.
- [ ] F1. Plan Compliance Audit — oracle
- [ ] F2. Code Quality Review — unspecified-high
- [ ] F3. Real Manual QA — unspecified-high (+ playwright if UI)
- [ ] F4. Scope Fidelity Check — deep

## Commit Strategy
- 状態同期タスク完了時に小さくまとめる。
- 本文増築は章単位でログを残す。
- 最終検証後に完了記録を反映する。

## Success Criteria
- 学習者が各節を読んだとき、定義・背景・例・誤解点・関連語まで一通り追える。
- コンテンツは「多すぎる」ではなく「学びが厚い」と感じられる密度になる。
- 文書状態と実装状態の認識がぶれない。
- 最終的に `npm test` / `npm run build` が通る。
