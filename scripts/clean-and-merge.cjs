const fs = require('fs');
const path = require('path');

function cleanString(str) {
  if (typeof str !== 'string') return str;
  return str
    .replace(/\t/g, '  ')                    // タブを2スペースに
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '') // 制御文字を削除
    .replace(/\r\n/g, '\n')                  // CRLFをLFに
    .replace(/\r/g, '\n');                   // CRをLFに
}

const chapters = [];

for (let i = 1; i <= 10; i++) {
  const num = String(i).padStart(2, '0');
  
  // full.json または simple.json を探す
  let filePath = path.join(__dirname, '..', 'data', `syllabus_ch${num}_full.json`);
  if (!fs.existsSync(filePath)) {
    filePath = path.join(__dirname, '..', 'data', `syllabus_ch${num}_simple.json`);
  }
  
  if (!fs.existsSync(filePath)) {
    console.log(`✗ 第${num}章が見つかりません`);
    continue;
  }
  
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    content = cleanString(content);
    
    const chapter = JSON.parse(content);
    
    // 各セクションのcontentもクリーンアップ
    if (chapter.sections) {
      chapter.sections = chapter.sections.map(sec => ({
        ...sec,
        content: cleanString(sec.content || '')
      }));
    }
    
    chapters.push(chapter);
    console.log(`✓ 第${num}章統合完了`);
    
  } catch (e) {
    console.log(`✗ 第${num}章エラー: ${e.message.substring(0, 60)}`);
  }
}

console.log(`\n成功: ${chapters.length}/10 章`);

if (chapters.length >= 4) {
  const totalSections = chapters.reduce((sum, ch) => sum + (ch.sections ? ch.sections.length : 0), 0);
  const totalQuizzes = chapters.reduce((sum, ch) => {
    if (!ch.sections) return sum;
    return sum + ch.sections.reduce((s, sec) => s + (sec.quizCount || 0), 0);
  }, 0);
  
  const syllabus = {
    version: '2.0',
    title: '2027年 プロフェッショナルデジタルスキル（データ・AI）試験対策',
    description: 'データ活用とAI活用の専門知識を網羅した学習シラバス。IPA DSS v2.1、JDLA G検定、および2025-2026年の最新生成AIトレンドを統合。Phase 2で大幅にコンテンツを拡充。',
    totalSections: totalSections,
    totalQuizzes: totalQuizzes,
    chapters: chapters
  };
  
  const outputPath = path.join(__dirname, '..', 'data', 'syllabus_v2.json');
  fs.writeFileSync(outputPath, JSON.stringify(syllabus, null, 2), 'utf8');
  
  console.log('\n✅ syllabus_v2.json 作成完了！');
  console.log(`合計節数: ${totalSections}`);
  console.log(`合計クイズ数: ${totalQuizzes}`);
  
  chapters.forEach(ch => {
    console.log(`${ch.title}: ${ch.sections ? ch.sections.length : 0}節`);
  });
} else {
  console.log('\n⚠️ 十分な章数が統合できませんでした');
  process.exit(1);
}
