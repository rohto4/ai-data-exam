#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import json
import os
import sys

chapters = []

for i in range(1, 11):
    num = f"{i:02d}"
    
    # ファイルを探す
    filepath = None
    for suffix in ['_full', '_simple']:
        fp = f"data/syllabus_ch{num}{suffix}.json"
        if os.path.exists(fp):
            filepath = fp
            break
    
    if not filepath:
        print(f"SKIP Ch{num}")
        continue
    
    try:
        # バイナリ読み込み
        with open(filepath, 'rb') as f:
            data = f.read()
        
        # タブ(0x09)とCR(0x0D)と制御文字を除去
        cleaned = bytearray()
        for b in data:
            if b == 0x09:  # タブ
                continue
            if b == 0x0D:  # CR
                continue
            if b >= 0x00 and b <= 0x08:
                continue
            if b == 0x0B or b == 0x0C:
                continue
            if b >= 0x0E and b <= 0x1F:
                continue
            cleaned.append(b)
        
        # JSONパース
        text = cleaned.decode('utf-8', errors='ignore')
        chapter = json.loads(text)
        
        # content内のタブも削除
        if 'sections' in chapter:
            for sec in chapter['sections']:
                if 'content' in sec and isinstance(sec['content'], str):
                    sec['content'] = sec['content'].replace('\t', '').replace('\r', '')
        
        chapters.append(chapter)
        print(f"OK Ch{num}")
        
    except Exception as e:
        print(f"ERR Ch{num}: {e}")

print(f"\nLoaded: {len(chapters)}/10")

if len(chapters) >= 4:
    total_sections = sum(len(ch.get('sections', [])) for ch in chapters)
    total_quizzes = sum(
        sec.get('quizCount', 0)
        for ch in chapters
        for sec in ch.get('sections', [])
    )
    
    result = {
        "version": "2.0",
        "title": "2027年 プロフェッショナルデジタルスキル（データ・AI）試験対策",
        "description": "データ活用とAI活用の専門知識を網羅した学習シラバス。IPA DSS v2.1、JDLA G検定、および2025-2026年の最新生成AIトレンドを統合。Phase 2で大幅にコンテンツを拡充。",
        "totalSections": total_sections,
        "totalQuizzes": total_quizzes,
        "chapters": chapters
    }
    
    with open('data/syllabus_v2.json', 'w', encoding='utf-8') as f:
        json.dump(result, f, ensure_ascii=False, indent=2)
    
    print("\n[SUCCESS] Created syllabus_v2.json")
    print(f"Sections: {total_sections}")
    print(f"Quizzes: {total_quizzes}")
    
    for ch in chapters:
        title = ch.get('title', 'Unknown')
        count = len(ch.get('sections', []))
        print(f"  {title}: {count} sections")
else:
    print("[FAILED] Not enough chapters")
    sys.exit(1)
