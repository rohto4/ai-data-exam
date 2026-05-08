#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import json
import os

def remove_tabs_and_control_chars(filepath):
    """ファイルからタブと制御文字を削除"""
    with open(filepath, 'rb') as f:
        content = f.read()
    
    # バイト列として処理
    result = bytearray()
    for b in content:
        if b == 0x09:  # タブはスキップ（完全削除）
            continue
        elif b == 0x0D:  # CRはスキップ
            continue
        elif b >= 0x00 and b <= 0x08:  # 制御文字
            continue
        elif b == 0x0B or b == 0x0C:  # 垂直タブ、フォームフィード
            continue
        elif b >= 0x0E and b <= 0x1F:  # 制御文字
            continue
        else:
            result.append(b)
    
    return result.decode('utf-8', errors='ignore')

def main():
    chapters = []
    
    for i in range(1, 11):
        num = f"{i:02d}"
        
        # ファイルを探す
        files = [
            f"data/syllabus_ch{num}_full.json",
            f"data/syllabus_ch{num}_simple.json"
        ]
        
        filepath = None
        for f in files:
            if os.path.exists(f):
                filepath = f
                break
        
        if not filepath:
            print(f"[SKIP] Ch{num}: File not found")
            continue
        
        try:
            # クリーニング
            cleaned = remove_tabs_and_control_chars(filepath)
            
            # JSONパース
            data = json.loads(cleaned)
            
            # contentもクリーニング
            if 'sections' in data:
                for sec in data['sections']:
                    if 'content' in sec and isinstance(sec['content'], str):
                        # content内のタブも削除
                        sec['content'] = sec['content'].replace('\t', '').replace('\r', '')
            
            chapters.append(data)
            print(f"[OK] Ch{num}: Loaded successfully")
            
        except Exception as e:
            print(f"[ERR] Ch{num}: {str(e)[:50]}")
    
    print(f"\nLoaded {len(chapters)}/10 chapters")
    
    if len(chapters) >= 4:
        # 統計
        total_sections = sum(len(ch.get('sections', [])) for ch in chapters)
        total_quizzes = sum(
            sec.get('quizCount', 0)
            for ch in chapters
            for sec in ch.get('sections', [])
        )
        
        # syllabus_v2.json作成
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
        
        print(f"\n[SUCCESS] Created syllabus_v2.json")
        print(f"  Sections: {total_sections}")
        print(f"  Quizzes: {total_quizzes}")
        
        for ch in chapters:
            print(f"  - {ch.get('title', 'Unknown')}: {len(ch.get('sections', []))} sections")
    else:
        print("\n[FAILED] Not enough chapters loaded")

if __name__ == "__main__":
    main()
