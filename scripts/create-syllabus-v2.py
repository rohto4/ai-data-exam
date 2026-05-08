#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import json
import os

def main():
    chapters = []
    
    # content/ch01/meta.json と content/ch05/meta.json を読み込み
    for i in [1, 5]:
        num = f"{i:02d}"
        meta_path = f"data/content/ch{num}/meta.json"
        
        if os.path.exists(meta_path):
            with open(meta_path, 'r', encoding='utf-8') as f:
                chapter = json.load(f)
            chapters.append(chapter)
            print(f"OK ch{num}")
    
    if chapters:
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
        
        print(f"\n[SUCCESS] Created syllabus_v2.json")
        print(f"Sections: {total_sections}")
        print(f"Quizzes: {total_quizzes}")
        
        for ch in chapters:
            print(f"  {ch.get('title', 'Unknown')}: {len(ch.get('sections', []))} sections")

if __name__ == "__main__":
    main()
