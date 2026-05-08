## マルチモーダルAIの概念

マルチモーダルAIとは、複数のモダリティ（テキスト、画像、音声、動画等）を統合的に処理するAIシステムである。[[マルチモーダルAI]]

### CLIP（Contrastive Language-Image Pre-training）

**概念（OpenAI、2021年）**：
- テキストと画像の対照学習
- 同じ意味のテキストと画像はベクトル空間で近くなるように学習

**応用**：
- ゼロショット画像分類
- 画像検索（テキストクエリで画像検索）
- 画像キャプション生成の事前学習

### 視覚言語モデル（VLM）

**GPT-4V（GPT-4 Vision）**：
- テキストと画像の両方を入力可能
- 画像理解、OCR、チャート解釈

**Gemini**：
- Googleのマルチモーダルモデル
- テキスト、画像、音声、動画、コードを統合

**LLaVA（Large Language and Vision Assistant）**：
- オープンソースの視覚言語モデル
- CLIP＋LLMの構造

### テキストから画像生成

**Stable Diffusion**：
- 潜在空間での拡散モデル
- オープンソースで広く利用
- カスタマイズ性が高い（Fine-tuning、ControlNet）

**DALL-E 3**：
- OpenAIの画像生成モデル
- プロンプトへの忠実性が高い

**Midjourney**：
- 高品質なアート生成
- Discord上で利用

**Imagen**：
- Googleの画像生成モデル
- リアルな画像生成に強い

### 画像生成の制御技術

**ControlNet**：
- ポーズ、深度、エッジ等の条件で生成を制御
- 構造的な一貫性を保持

**Inpainting/Outpainting**：
- 画像の一部を修正（Inpainting）
- 画像を拡張（Outpainting）

**LoRA（画像生成）**：
- 特定のスタイルやキャラクターを学習
- 軽量なアダプタとして使用

### 音声・音楽生成

**音声合成（TTS）**：
- **StyleTTS 2**：スタイル制御可能
- **Bark**：感情表現豊か
- **ElevenLabs**：高品質、多言語対応

**音楽生成**：
- **Suno AI**：歌詞から楽曲生成
- **Udio**：高品質な音楽生成
- **MusicGen**：Metaの音楽生成モデル

### 動画生成

**Sora（OpenAI）**：
- テキストから高品質な動画生成
- 物理法則をある程度理解

**Runway Gen-2**：
- テキストや画像から動画生成
- ビデオ編集ツールとしても使用

▼覚えておくポイント
- CLIPでテキストと画像の対照学習、共通ベクトル空間
- GPT-4V等のVLMで画像理解とテキスト生成の統合
- Stable Diffusionがオープンソースで広く利用
- ControlNetで構造的な制御、LoRAでスタイル学習