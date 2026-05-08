#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import json
import os
import re


def clean_string(s):
    """文字列から制御文字を除去"""
    if not isinstance(s, str):
        return s
    
    # タブをスペース2つに
    s = s.replace('\t', '  ')
    
    # 改行を統一（CRLF -> LF）
    s = s.replace('\r\n', '\n').replace('\r', '')
    
    # 制御文字を除去（LF=0x0A は保持）
    result = []
    for char in s:
        code = ord(char)
        if code == 0x0A:  # LFは保持
            result.append(char)
        elif code < 0x20:  # その他の制御文字は除去
            continue
        elif code == 0x7F:  # DELは除去
            continue
        else:
            result.append(char)
    
    return ''.join(result)


def clean_json_bytes(raw_bytes):
    """バイト列から制御文字を除去"""
    cleaned = bytearray()
    for b in raw_bytes:
        if b == 0x09:  # TAB -> スペース2つ
            cleaned.extend(b'  ')
        elif b == 0x0A:  # LFは保持
            cleaned.append(b)
        elif b == 0x0D:  # CRは除去
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
    # 方法1: 通常読み込みを試す
    try:
        with open(filepath, 'r', encoding='utf-8-sig') as f:
            return json.load(f, strict=False)
    except (json.JSONDecodeError, UnicodeDecodeError):
        pass
    
    # 方法2: バイナリモードで読み込み
    with open(filepath, 'rb') as f:
        raw_bytes = f.read()
    
    # BOM除去
    if raw_bytes.startswith(b'\xef\xbb\xbf'):
        raw_bytes = raw_bytes[3:]
    
    cleaned = clean_json_bytes(raw_bytes)
    text = cleaned.decode('utf-8', errors='ignore')
    return json.loads(text, strict=False)


def process_chapter(data):
    """章データをクリーニング"""
    if 'sections' in data:
        for section in data['sections']:
            if 'content' in section:
                section['content'] = clean_string(section['content'])
    return data


def main():
    chapters = []
    
    for i in range(1, 11):
        num = f"{i:02d}"
        
        # full.json または simple.json を探す
        file_path = None
        for suffix in ['_full', '_simple']:
            fp = f"data/syllabus_ch{num}{suffix}.json"
            if os.path.exists(fp):
                file_path = fp
                break
        
        if not file_path:
            print(f"[SKIP] 第{num}章が見つかりません")
            continue
        
        try:
            # 安全なJSON読み込み
            chapter = load_json_safe(file_path)
            
            # クリーニング
            chapter = process_chapter(chapter)
            
            chapters.append(chapter)
            print(f"[OK] 第{num}章統合完了")
            
        except Exception as e:
            print(f"[ERR] 第{num}章エラー: {type(e).__name__}: {str(e)[:60]}")
    
    print(f"\n成功: {len(chapters)}/10 章")
    
    if len(chapters) >= 4:
        total_sections = sum(len(ch.get('sections', [])) for ch in chapters)
        total_quizzes = sum(
            sec.get('quizCount', 0) 
            for ch in chapters 
            for sec in ch.get('sections', [])
        )
        
        syllabus = {
            "version": "2.0",
            "title": "2027年 プロフェッショナルデジタルスキル（データ・AI）試験対策",
            "description": "データ活用とAI活用の専門知識を網羅した学習シラバス。IPA DSS v2.1、JDLA G検定、および2025-2026年の最新生成AIトレンドを統合。Phase 2で大幅にコンテンツを拡充。",
            "totalSections": total_sections,
            "totalQuizzes": total_quizzes,
            "chapters": chapters
        }
        
        with open('data/syllabus_v2.json', 'w', encoding='utf-8') as f:
            json.dump(syllabus, f, ensure_ascii=False, indent=2)
        
        print("\n[SUCCESS] syllabus_v2.json 作成完了！")
        print(f"合計節数: {total_sections}")
        print(f"合計クイズ数: {total_quizzes}")
        
        for ch in chapters:
            print(f"  {ch.get('title', '不明')}: {len(ch.get('sections', []))}節")
    else:
        print("\n[WARNING] 十分な章数が統合できませんでした")
        exit(1)


if __name__ == "__main__":
    main()
