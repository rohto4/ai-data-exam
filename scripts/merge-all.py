#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import json
import os
import sys


def clean_content(text):
    """テキストからタブと制御文字を削除"""
    if not isinstance(text, str):
        return text
    # タブをスペース2つに変換
    text = text.replace('\t', '  ')
    # CRを削除
    text = text.replace('\r', '')
    return text


def clean_json_bytes(raw_bytes):
    """
    バイト列から危険な制御文字を除去
    JSON仕様で許容される文字のみを保持
    """
    cleaned = bytearray()
    for b in raw_bytes:
        if b == 0x09:  # TAB -> スペース2つ
            cleaned.extend(b'  ')
        elif b == 0x0A:  # LF は許容
            cleaned.append(b)
        elif b == 0x0D:  # CR は除去（LFに統一）
            continue
        elif b < 0x20:  # その他の制御文字は除去
            continue
        else:
            cleaned.append(b)
    return bytes(cleaned)


def load_json_safe(filepath):
    """
    JSONファイルを安全に読み込む
    方法1: strict=Falseで通常読み込み
    方法2: バイナリモードで前処理
    """
    # 方法1: 通常読み込みを試す（strict=Falseで制御文字を許容）
    try:
        with open(filepath, 'r', encoding='utf-8-sig') as f:
            return json.load(f, strict=False)
    except (json.JSONDecodeError, UnicodeDecodeError):
        print(f"  -> 通常読み込み失敗、バイナリモードで再試行...")
    
    # 方法2: バイナリモードで読み込み
    with open(filepath, 'rb') as f:
        raw_bytes = f.read()
    
    # BOM除去
    if raw_bytes.startswith(b'\xef\xbb\xbf'):
        raw_bytes = raw_bytes[3:]
    
    cleaned = clean_json_bytes(raw_bytes)
    
    # UTF-8でデコード（エラーは無視）
    try:
        text = cleaned.decode('utf-8', errors='ignore')
    except Exception:
        text = cleaned.decode('utf-8', errors='replace')
    
    return json.loads(text, strict=False)


def main():
    chapters = []
    
    for i in range(1, 11):
        num = f"{i:02d}"
        
        # ファイルパスを決定（_full優先）
        filepath = None
        for suffix in ['_full', '_simple']:
            fp = f"data/syllabus_ch{num}{suffix}.json"
            if os.path.exists(fp):
                filepath = fp
                break
        
        if not filepath:
            print(f"SKIP Ch{num}: ファイルが見つかりません")
            continue
        
        try:
            # 安全なJSON読み込み
            data = load_json_safe(filepath)
            
            # contentもクリーニング
            if 'sections' in data:
                for sec in data['sections']:
                    if 'content' in sec:
                        sec['content'] = clean_content(sec['content'])
            
            chapters.append(data)
            print(f"OK Ch{num}")
            
        except Exception as e:
            print(f"ERR Ch{num}: {type(e).__name__}: {e}")
    
    print(f"\nLoaded: {len(chapters)}/10")
    
    if len(chapters) >= 4:
        total_sec = sum(len(ch.get('sections', [])) for ch in chapters)
        total_quiz = sum(sec.get('quizCount', 0) 
                        for ch in chapters 
                        for sec in ch.get('sections', []))
        
        result = {
            "version": "2.0",
            "title": "2027年 プロフェッショナルデジタルスキル（データ・AI）試験対策",
            "description": "データ活用とAI活用の専門知識を網羅した学習シラバス",
            "totalSections": total_sec,
            "totalQuizzes": total_quiz,
            "chapters": chapters
        }
        
        with open('data/syllabus_v2.json', 'w', encoding='utf-8') as f:
            json.dump(result, f, ensure_ascii=False, indent=2)
        
        print(f"\n[SUCCESS] Created syllabus_v2.json")
        print(f"Sections: {total_sec}")
        print(f"Quizzes: {total_quiz}")
        
        for ch in chapters:
            title = ch.get('title', 'Unknown')
            count = len(ch.get('sections', []))
            print(f'  {title}: {count} sections')
        
        return 0
    else:
        print("[FAILED] 4章以上の読み込みが必要です")
        return 1


if __name__ == "__main__":
    sys.exit(main())
