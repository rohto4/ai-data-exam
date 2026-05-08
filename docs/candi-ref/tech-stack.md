# 技術スタックとトラブルシューティング

## 特殊文字・制御文字の対処法

### 問題の背景
JSONファイルからコンテンツを抽出する際、特殊文字（制御文字）が含まれていると以下のエラーが発生する可能性がある：

- `json.decoder.JSONDecodeError: Invalid control character at: line X column Y`
- `UnicodeDecodeError: 'utf-8' codec can't decode byte 0xXX`

### 対処法一覧（優先順位順）

#### 1. strict=False パラメータ（最も簡単）
JSONデコーダーに制御文字を許容させる：

```python
import json

# 制御文字を許容して読み込み
with open('file.json', 'r', encoding='utf-8') as f:
    data = json.load(f, strict=False)
```

**注意**: セキュリティ上の理由から、信頼できないソースからのJSONには注意が必要

#### 2. バイナリモードでの前処理（推奨）
バイト単位で制御文字を除去してからデコード：

```python
import json

def clean_json_bytes(raw_bytes):
    """バイト列から制御文字を除去"""
    cleaned = bytearray()
    for b in raw_bytes:
        # 許容する文字：
        # 0x09 (TAB), 0x0A (LF), 0x0D (CR) は許容
        # 0x20-0x7E ( printable ASCII), 0x80-0xFF (UTF-8マルチバイト)
        if b in (0x09, 0x0A, 0x0D):
            cleaned.append(b)
        elif b < 0x20:
            # 制御文字 (0x00-0x08, 0x0B-0x0C, 0x0E-0x1F) はスキップ
            continue
        else:
            cleaned.append(b)
    return cleaned

# 使用例
with open('file.json', 'rb') as f:
    raw = f.read()
    cleaned = clean_json_bytes(raw)
    data = json.loads(cleaned.decode('utf-8', errors='ignore'))
```

#### 3. エラーハンドリング
デコードエラーを無視または置換：

```python
# エラーを無視
data = json.loads(text, strict=False)

# またはバイナリ読み込み時にエラーを無視
with open('file.json', 'rb') as f:
    raw = f.read()
    text = raw.decode('utf-8', errors='ignore')  # 無視
    # または
    text = raw.decode('utf-8', errors='replace')  # � に置換
    data = json.loads(text, strict=False)
```

#### 4. BOM対応
Windowsで作成されたファイルなど、BOM付きUTF-8の場合：

```python
# BOM付きUTF-8対応
with open('file.json', 'r', encoding='utf-8-sig') as f:
    data = json.load(f, strict=False)
```

#### 5. 完全版：包括的クリーニング関数

```python
import json
import re

def load_json_with_cleaning(filepath):
    """
    JSONファイルを安全に読み込む
    制御文字、BOM、不正なUTF-8シーケンスを処理
    """
    try:
        # まず通常の方法を試す
        with open(filepath, 'r', encoding='utf-8-sig') as f:
            return json.load(f, strict=False)
    except (json.JSONDecodeError, UnicodeDecodeError):
        pass
    
    # バイナリモードで読み込み
    with open(filepath, 'rb') as f:
        raw_bytes = f.read()
    
    # BOMを除去 (UTF-8 BOM = EF BB BF)
    if raw_bytes.startswith(b'\xef\xbb\xbf'):
        raw_bytes = raw_bytes[3:]
    
    # 制御文字を除去（許容するもの以外）
    cleaned = bytearray()
    for b in raw_bytes:
        if b == 0x09:  # TAB -> スペース2つ
            cleaned.extend(b'  ')
        elif b == 0x0A or b == 0x0D:  # LF, CR は許容
            cleaned.append(b)
        elif b < 0x20:  # その他の制御文字は除去
            continue
        else:
            cleaned.append(b)
    
    # UTF-8としてデコード（エラーは無視）
    try:
        text = cleaned.decode('utf-8', errors='ignore')
    except Exception:
        text = cleaned.decode('utf-8', errors='replace')
    
    # JSONとしてパース
    return json.loads(text, strict=False)
```

### 制御文字の一覧（除去対象）

| コード | 文字 | 名称 | 処理 |
|--------|------|------|------|
| 0x00 | NUL | Null | 除去 |
| 0x01-0x08 | - | 制御文字 | 除去 |
| 0x09 | TAB | 水平タブ | スペースに変換 |
| 0x0A | LF | 改行 | 許容 |
| 0x0B-0x0C | VT, FF | 垂直タブ、改ページ | 除去 |
| 0x0D | CR | 復帰 | 許容 |
| 0x0E-0x1F | - | 制御文字 | 除去 |

### 実装時のチェックリスト

- [ ] JSONファイルのエンコーディングを確認（UTF-8推奨）
- [ ] BOMの有無を確認
- [ ] `strict=False` を指定して制御文字を許容
- [ ] バイナリモードでの前処理を実装（推奨）
- [ ] エラーハンドリングを実装
- [ ] クリーニング後のデータを検証

## OpenCode Provider / Agent 設定メモ

### 既知プロバイダがUIで出ない場合

- 症状: OpenCode の設定画面で OpenAI / Google などが既知プロバイダとして出ず、カスタム登録しかできない。
- 主因候補:
  - `enabled_providers` に対象プロバイダが含まれていない。
  - `plugin` に `oh-my-openagent@latest` が設定されていない。
  - `.opencode/oh-my-openagent.jsonc` が JSONC として壊れている（カンマ/括弧欠落）ため、エージェント定義が読み込めない。

### 今回の対処（2026-05-07）

- `opencode.jsonc`
  - `plugin: ["oh-my-openagent@latest"]` を追加
  - `enabled_providers: ["openai", "chutes"]` を使用
  - `model: "openai/gpt-5.3-codex"` に設定
- `.opencode/oh-my-openagent.jsonc`
  - `prometheus` エージェントブロックの欠落カンマ/閉じ括弧を修正
  - `sisyphus` / `hephaestus` / `prometheus` / `atlas` を `openai/gpt-5.3-codex` 指定

### 参照

- GPT-5.3-Codex model page:
  - https://developers.openai.com/api/docs/models/gpt-5.3-codex

## 巨大コンテンツ増設時のチーム連携制約

### 目的

メインエージェント（Sisyphus / Hephaestus）が全体方針と統合を担当し、サブエージェント（探査・調査・レビュー・長文生成）が分担して、教本拡充を最後まで自律完遂できる状態を作る。

### 役割分担

- **メイン**: `openai/gpt-5.3-codex`
  - 章配分、優先順位、最終マージ、品質判定を担当。
- **サブ**: `openai/gpt-5.4`
  - 調査、下書き、章ごとの肉付け、レビュー、差分整理を担当。
  - `maxTokens: 200000` を付与し、長い作業単位を扱えるようにする。

### 2026-05-07 更新: 指揮系4 Agent のコンテキスト

- `sisyphus` / `hephaestus` / `prometheus` / `atlas` は `maxTokens: 400000` に引き上げる。
- これにより、計画・統合・長文生成・実装の指揮役は、より大きい文脈を保持しながら回せる。
- それ以外のサブエージェントは小さめの単位で扱い、役割分担を崩さない。

### Codexで誰を起動するか

- **実装の起点**: `hephaestus`
  - コーディング・編集・実装の主担当。
  - 「Codexで誰をキックするか」の第一候補はこれ。
- **統括**: `sisyphus`
  - 全体の方針と最終整合を見たいときに使う。
- **計画**: `prometheus`
  - タスク分割、手順化、失敗しにくい実行計画を作るときに使う。
- **長文・まとめ**: `atlas`
  - 教本増設の長文生成や整理に使う。

### 使い分けの原則

- 1つの大きい作業は、**Hephaestus で実装 → Prometheus で分割 → Atlas で長文補強 → Sisyphus で統合** の順に回す。
- Sisyphus は「最初に全部やる人」ではなく、**最後に整える人**として使う。
- 迷ったら、**まず Hephaestus を起動**する。

### 運用ルール

1. **1サブエージェント = 1責務**
   - 1回の依頼で扱うのは「1章」または「連続した少数ファイル群」まで。
2. **出力形式を固定**
   - 変更ファイル
   - 実施内容
   - 未解決点
   - 次の一手
3. **サブ同士で直接書き換えない**
   - 競合回避のため、編集はメインが最終統合する。
4. **進捗は小刻みに確定**
   - 章単位、または 3〜5 ファイル単位で完了判定。
5. **教本増設の品質基準**
   - 事実の捏造をしない。
   - 根拠の薄い出典は置かない。
   - 読み手が学習しやすい粒度にする。

### コンテキスト運用

- サブエージェントは `maxTokens: 200000` を目安にする。
- ただし実際の出力上限はモデル側制約に従うため、長文は「章ごと」「節ごと」に分割して扱う。
- 1つの依頼で巨大な全量生成を狙わず、**分割 → 生成 → 検証 → 統合** の順で回す。

### 5.4 mini 運用メモ

- 低コスト運用では、サブエージェント群を `openai/gpt-5.4-mini` に統一してよい。
- ただし、**教本の本文生成は必ず小分け**にする。
- mini で詰まった場合は、同じ責務をより小さい単位に切り直して再投入する。

### 必須チェックポイント

- 章ごとに `imp-tasks.md` の進捗更新を行う
- 生成後に `npm test`
- 重要な統合後に `npm run build`
- エージェント設定変更後は OpenCode 再起動で反映確認

### コミット / プッシュのタイミング

- **1フェーズ完了ごと**にコミットする。細かすぎる途中経過は残しすぎない。
- **大きな分割点**（例: シラバス再設計完了、教本増設完了、UI改善完了、ビルド成功）ではその都度コミット候補にする。
- **検証が通った直後**にコミットする。テストやビルドが落ちた状態でのコミットは避ける。
- **プッシュは、ローカルで再現性が確認できた後**に行う。未検証のまま遠隔へ送らない。
- 失敗やハングが発生した場合は、**修正の前後で差分が追えるように小さめにまとめてコミット**する。

### 失敗時の自動復帰方針

- タスクが失敗・停止・ハングしたら、まず**失敗した直前の状態を diary に残す**。
- その後、**原因を1つに絞って再実行**する。shotgun 修正はしない。
- サブエージェントが止まった場合は、**同じ責務を新しい実行単位に分割して再起動**する。
- 途中生成物が壊れている場合は、**修正より先に構造の復旧**を優先する。
- 長時間の自律実行では、**「最後に成功した地点」を必ず明記**してから再開する。
