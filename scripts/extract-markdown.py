#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import json
import os
import re


def clean_content(text):
    """コンテンツをクリーニング"""
    if not isinstance(text, str):
        return ''
    # タブをスペースに
    text = text.replace('\t', '  ')
    # CRを除去
    text = text.replace('\r', '')
    return text


def clean_json_bytes(raw_bytes):
    """
    バイト列から制御文字を除去して安全にデコード
    JSON仕様で許容される文字のみを保持
    """
    cleaned = bytearray()
    for b in raw_bytes:
        if b == 0x09:  # TAB -> スペース2つに変換
            cleaned.extend(b'  ')
        elif b == 0x0A or b == 0x0D:  # LF, CR は許容
            cleaned.append(b)
        elif b < 0x20:  # その他の制御文字(0x00-0x08, 0x0B-0x0C, 0x0E-0x1F)は除去
            continue
        else:
            cleaned.append(b)
    return cleaned


def load_json_safe(filepath):
    """
    JSONファイルを安全に読み込む
    方法1: strict=Falseで通常読み込み
    方法2: バイナリモードで前処理してから読み込み
    """
    # 方法1: 通常読み込みを試す（strict=Falseで制御文字を許容）
    try:
        with open(filepath, 'r', encoding='utf-8-sig') as f:
            return json.load(f, strict=False)
    except (json.JSONDecodeError, UnicodeDecodeError):
        print(f"  -> 通常読み込み失敗、バイナリモードで再試行...")
    
    # 方法2: バイナリモードで読み込み、制御文字を除去
    with open(filepath, 'rb') as f:
        raw_bytes = f.read()
    
    # BOM除去 (UTF-8 BOM = EF BB BF)
    if raw_bytes.startswith(b'\xef\xbb\xbf'):
        raw_bytes = raw_bytes[3:]
    
    cleaned = clean_json_bytes(raw_bytes)
    text = cleaned.decode('utf-8', errors='ignore')
    
    return json.loads(text, strict=False)


def main():
    # 全章を処理
    for i in range(1, 11):
        num = f"{i:02d}"
        
        # ソースファイルを探す（_full優先）
        src_file = None
        for suffix in ['_full', '_simple']:
            fp = f"data/syllabus_ch{num}{suffix}.json"
            if os.path.exists(fp):
                src_file = fp
                break
        
        if not src_file:
            print(f"SKIP ch{num}: ファイルが見つかりません")
            continue
        
        try:
            # 安全なJSON読み込み
            data = load_json_safe(src_file)
            
            # 各セクションのcontentを.mdファイルとして保存
            if 'sections' in data:
                for sec in data['sections']:
                    sec_id = sec.get('id', '')
                    content = sec.get('content', '')
                    
                    if sec_id and content:
                        # contentをクリーニング
                        clean_md = clean_content(content)
                        
                        # ファイルパス
                        sec_num = sec_id.replace('ch' + num + '-', '')
                        md_path = f"data/content/ch{num}/{sec_num}.md"
                        
                        # ディレクトリ作成
                        os.makedirs(os.path.dirname(md_path), exist_ok=True)
                        
                        # Markdownファイル保存
                        with open(md_path, 'w', encoding='utf-8') as f:
                            f.write(clean_md)
                        
                        # contentを削除してcontentPathを追加
                        del sec['content']
                        sec['contentPath'] = f"content/ch{num}/{sec_num}.md"
                
                # 章のメタデータをJSONとして保存
                meta_path = f"data/content/ch{num}/meta.json"
                os.makedirs(os.path.dirname(meta_path), exist_ok=True)
                
                with open(meta_path, 'w', encoding='utf-8') as f:
                    json.dump({
                        'chapterId': data.get('chapterId'),
                        'title': data.get('title'),
                        'sections': data['sections']
                    }, f, ensure_ascii=False, indent=2)
                
                print(f"OK ch{num}: {len(data['sections'])} sections")
            else:
                print(f"WARN ch{num}: sectionsがありません")
                
        except Exception as e:
            print(f"ERR ch{num}: {type(e).__name__}: {e}")
    
    print("\nMarkdown extraction complete!")


if __name__ == "__main__":
    main()
