# Learnings

## 2026-05-08
- ch04 は 7 節とも短めで、本文を「定義→背景→比較→実務・試験論点→要点」の順で厚くするのが安全。
- ch05 は sec01-05 を先に増補し、sec06-07 は高リスクなので後回しにする。
- ch06/ch07 は本文は長いが `[[termId]]` が 0 件で、用語基盤は未整備。
- Playwright で `sections/ch04-sec01` と `sections/ch05-sec04` を確認し、本文表示と console error 0 件を確認した。
- `npm test` は 29 件通過、`npm run build` も成功した。

## 2026-05-08 Task 3-2 追加完了（ch05/sec06・sec07）
- data/content/ch05/sec06.md を増補（91行→178行）- モデル評価指標の定義・背景・実務論点を詳細化
- data/content/ch05/sec07.md を増補（90行→198行）- MLパイプラインの各構成要素を詳細化
- 両節とも「定義と背景」「実務・試験論点」「よくある誤解」セクションを追加
- 
pm test が全29テストパスで検証完了
- ch05全7節の増補が完了（sec01〜sec07）

## 2026-05-08 Task 3-3 ??
- ???? `data/syllabus.json` ??????markdown ??????? UI ??????????? JSON ??????
- ch05/sec06 ? ch05/sec07 ? JSON ??????? Playwright ???????
- Browser QA ??????????????console error ? 0 ?????

## 2026-05-08 Task ch06-sec01 完了
- data/content/ch06/sec01.md を増補（66行→131行）
- syllabus.json の ch06-sec01 セクションを同期
- 
pm test が全29テストパスで検証完了
- syllabus.json の構造を修正（chapterId→id, orderフィールド追加）

## 2026-05-08 Task ch06-sec02 完了
- data/content/ch06/sec02.md を増補（71行→138行）
- syllabus.json の ch06-sec02 セクションを同期（1158→2955文字）
- 
pm test が全29テストパスで検証完了
- CNNの基本構造、畳み込み層、プーリング層、アーキテクチャ、転移学習を詳細化

## 2026-05-08 Task ch06-sec03 完了
- data/content/ch06/sec03.md を増補（70行→132行）
- syllabus.json の ch06-sec03 セクションを同期（1194→2778文字）
- 
pm test が全29テストパスで検証完了
- RNN、LSTM、GRU、双方向RNN、Seq2Seqを詳細化

## 2026-05-08 Task ch06-sec05 完了
- data/content/ch06/sec05.md を大幅増補（69行→187行）
- 事前学習・ファインチューニングの概念を詳細化
- BERT（MLM/NSP）とGPTシリーズの進化を包括的に解説
- ドメイン適応手法（追加事前学習、アダプタ層）を追加
- syllabus.json の ch06-sec05 セクションを同期（1111→6189文字）
- 
pm test が全29テストパスで検証完了

## 2026-05-08 Task ch06-sec06 完了
- data/content/ch06/sec06.md を大幅増補（97行→239行）
- PyTorch（動的グラフ）、TensorFlow/Keras（本番展開）、JAX（関数変換）を詳細解説
- GPU/TPUの特徴と混合精度学習を追加
- フレームワーク選択の指針と比較表を提供
- syllabus.json の ch06-sec06 セクションを同期（1389→6863文字）
- 
pm test が全29テストパスで検証完了

## 2026-05-08 Task ch06-sec07 完了
- data/content/ch06/sec07.md を大幅増補（76行→239行）
- GAN（生成器・識別器の競争）、VAE（確率的潜在空間）、拡散モデル（ノイズ除去）を詳細解説
- DCGAN、StyleGAN、CycleGAN、Stable Diffusionなどの発展形を追加
- 生成モデル評価指標（IS、FID）を詳細化
- syllabus.json の ch06-sec07 セクションを同期（1216→6876文字）
- 
pm test が全29テストパスで検証完了

## 2026-05-08 Task ch06-sec08 完了
- data/content/ch06/sec08.md を大幅増補（93行→392行）
- 正則化手法（Dropout、Batch/Layer Normalization、Weight Decay）を詳細解説
- オプティマイザ（SGD、Adam、AdamW）と学習率スケジューリングを詳細化
- 初期化（Xavier、He）、学習テクニック、ハイパーパラメータチューニングを追加
- syllabus.json の ch06-sec08 セクションを同期（1307→9111文字）
- 
pm test が全29テストパスで検証完了

## ch06 全セクション増補完了
- sec01〜sec08 すべてのセクションを専門学習レベルに増補完了
- 合計文字数：約11,000文字 → 約52,000文字（約4.7倍）
- すべてのテストがパスし、syllabus.jsonと同期済み

## 2026-05-08 Task ch07-sec01 完了
- data/content/ch07/sec01.md を大幅増補（56行→222行）
- 生成モデル概論：識別モデルとの比較、確率モデリングの基礎を詳細化
- GAN、VAE、拡散モデル、自己回帰モデルの進化と特徴を包括的に解説
- 生成AIのパラダイムシフトと基盤モデルの概念を追加
- 生成モデルの応用領域（画像、テキスト、音声、動画、科学）を詳細化
- syllabus.json の ch07-sec01 セクションを同期（759→6549文字）
- 
pm test が全29テストパスで検証完了


## 2026-05-08: ch07-sec04.md Enhancement

Enhanced ch07-sec04.md with higher density content and added [[termId]]-style markers for key RAG terms:
- [[RAG]]: Added marker for core concept
- Maintained dense textbook style with enhanced technical depth
- Focused on exam-important terminology
- Preserved factual accuracy while increasing explanatory density

Updated syllabus.json ch07-sec04 entry to maintain consistency with enhanced content.

This is the first section with term markers, beginning to address the zero markers gap in ch06/ch07.
## 2026-05-08 Task ch07-sec05 完了
- sec05 の先頭文を PEFT の説明付きで修正
- markdown と syllabus.json を同期
- ブラウザで ch07-sec05 の表示を確認し、PEFT の文言が見えることを確認
## 2026-05-08 Task ch07-sec06 完了
- sec06 の冒頭に [[AIエージェント]] マーカーを追加
- markdown と syllabus.json を同期
- ブラウザで ch07-sec06 の表示と console を確認
## 2026-05-08 Task ch07-sec08 完了
- sec08 の見出しに [[LLM運用]] マーカーを追加
- markdown と syllabus.json を同期
- 冒頭の 1 行だけを対象にすると、タイムアウトを避けやすい
## 2026-05-08 Task ch07-sec08 完了
- sec08 の見出しに [[LLM運用]] マーカーを追加
- markdown と syllabus.json を同期
- Unicode escape の置換で、重複マーカーを 1 個に戻してから確認した
## 2026-05-08 Task ch06-sec01 完了
- sec01 の定義文に [[パーセプトロン]] マーカーを追加
- markdown と syllabus.json を同期
- 1 行内のマーカー挿入でも、前後の空白を整えると読みやすい
## 2026-05-08 Task ch06-sec02 完了
- sec02 の定義文に [[CNN]] マーカーを追加
- markdown と syllabus.json を同期
- 1行内のマーカー追加は、実文字列と Unicode escape の両方で確認すると安全
## 2026-05-08 Task ch06-sec03 完了
- sec03 の定義文に [[RNN]] マーカーを追加
- markdown と syllabus.json を同期
- Unicode escape を使うと、系列データ節でも安全に 1 行置換できる
