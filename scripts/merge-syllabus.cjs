const fs = require('fs');
const path = require('path');

function sanitizeForJson(str) {
  if (typeof str !== 'string') return str;
  return str
    .replace(/\t/g, '  ')
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '')
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n');
}

const files = [
  'syllabus_ch01_full.json',
  'syllabus_ch02_simple.json',
  'syllabus_ch03_full.json',
  'syllabus_ch04_full.json',
  'syllabus_ch05_full.json',
  'syllabus_ch06_full.json',
  'syllabus_ch07_full.json',
  'syllabus_ch08_full.json',
  'syllabus_ch09_simple.json',
  'syllabus_ch10_full.json'
];

const chapters = [];
let successCount = 0;

files.forEach(filename => {
  try {
    const filePath = path.join(__dirname, '..', 'data', filename);
    if (!fs.existsSync(filePath)) {
      console.log('✗ ' + filename + ': ファイルが存在しません');
      return;
    }
    
    let content = fs.readFileSync(filePath, 'utf8');
    
    // JSONをパース
    let chapter;
    try {
      chapter = JSON.parse(content);
    } catch (e) {
      // パースエラーがあれば特殊文字を除去
      content = sanitizeForJson(content);
      chapter = JSON.parse(content);
    }
    
    // 各セクションのcontentをクリーンアップ
    if (chapter.sections) {
      chapter.sections = chapter.sections.map(sec => ({
        ...sec,
        content: sanitizeForJson(sec.content || '')
      }));
    }
    
    chapters.push(chapter);
    successCount++;
    console.log('✓ ' + filename);
    
  } catch (e) {
    console.log('✗ ' + filename + ': ' + e.message.substring(0, 80));
  }
});

console.log('\n成功: ' + successCount + '/10');

if (successCount >= 4) {
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
  console.log('合計節数:', totalSections);
  console.log('合計クイズ数:', totalQuizzes);
  
  chapters.forEach(ch => {
    console.log(ch.title + ': ' + (ch.sections ? ch.sections.length : 0) + '節');
  });
} else {
  console.log('\n⚠️ 十分なファイルが読み込めなかったため、統合を中断しました');
  process.exit(1);
}
