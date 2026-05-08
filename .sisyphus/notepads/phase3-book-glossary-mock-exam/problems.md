# Problems

## 2026-05-07
- 失敗セッションが複数あり、調査セッションの継続が安定していない。
- 章/節の実データとテスト条件の差分把握がまだ途中。
- `data/syllabus.json` の `totalQuizzes`（548）と `data/quizzes.json` の実問題数（300）が一致せず、さらに `quizzes.json` に存在する `sectionId` の一部が syllabus 未掲載のため、厳密な cross-validation を今は有効化できない。
