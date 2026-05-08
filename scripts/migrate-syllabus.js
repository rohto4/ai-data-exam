const fs = require('fs');
const path = require('path');

// 新しいシラバス構造の定義
const chapterDefs = [
  {
    id: 'ch01',
    title: '第1章 データ・AIの基礎と戦略',
    description: 'デジタルトランスフォーメーション、データドリブン経営、AIの歴史と発展、ビジネス戦略との連携を学ぶ。',
    sectionCount: 4,
    references: [
      {title: 'IPA デジタルスキル標準 v2.0', url: 'https://www.ipa.go.jp/jinzai/skill-standard/dss.html', section: 'DX推進スキル標準'},
      {title: '経済産業省 DX白書 2025', url: 'https://www.meti.go.jp/policy/digital_transformation/', section: 'DX推進指針'}
    ],
    sections: [
      {title: '1-1 DXとデータドリブン経営の基礎', quizCount: 10},
      {title: '1-2 データリテラシーとAIの基礎知識', quizCount: 10},
      {title: '1-3 ビジネスKPI設計とROI試算', quizCount: 10},
      {title: '1-4 AI実装の準備度とロードマップ', quizCount: 8}
    ]
  },
  {
    id: 'ch02',
    title: '第2章 データガバナンスと品質管理',
    description: 'データガバナンスの原則、データ品質管理、メタデータ管理、コンプライアンス対応、セキュリティを網羅的に学ぶ。',
    sectionCount: 5,
    references: [
      {title: 'DAMA-DMBOK2', url: 'https://dama.org/', section: 'データマネジメント知識体系'},
      {title: 'IPA データマネジメント類型', url: 'https://www.ipa.go.jp/jinzai/skill-standard/dss.html', section: 'データスチュワード・データエンジニア'}
    ],
    sections: [
      {title: '2-1 データガバナンスの原則とフレームワーク', quizCount: 10},
      {title: '2-2 データ品質管理とアセスメント', quizCount: 10},
      {title: '2-3 メタデータ管理とデータカタログ', quizCount: 8},
      {title: '2-4 個人情報保護法とGDPR対応', quizCount: 10},
      {title: '2-5 データセキュリティとアクセス管理', quizCount: 8}
    ]
  },
  {
    id: 'ch03',
    title: '第3章 データエンジニアリング',
    description: 'データ収集、ETL/ELTパイプライン、データベース設計、データレイク・ウェアハウス、リアルタイム処理、分散処理、クラウドデータ基盤を学ぶ。',
    sectionCount: 6,
    references: [
      {title: 'AWS Data Analytics', url: 'https://aws.amazon.com/jp/big-data/datalakes-and-analytics/', section: 'クラウドデータ基盤'},
      {title: 'Google Cloud Data Analytics', url: 'https://cloud.google.com/solutions/data-analytics', section: 'データ分析基盤'}
    ],
    sections: [
      {title: '3-1 データ収集とETL/ELTパイプライン', quizCount: 10},
      {title: '3-2 データベース設計と選定', quizCount: 10},
      {title: '3-3 データレイク・データウェアハウス・データレイクハウス', quizCount: 10},
      {title: '3-4 リアルタイム処理とストリーミング', quizCount: 8},
      {title: '3-5 分散処理フレームワーク', quizCount: 8},
      {title: '3-6 クラウドデータ基盤とマルチクラウド戦略', quizCount: 8}
    ]
  },
  {
    id: 'ch04',
    title: '第4章 統計・分析手法',
    description: '記述統計、確率分布、仮説検定、回帰分析、多変量解析、時系列分析、BIツール活用を学ぶ。',
    sectionCount: 7,
    references: [
      {title: '統計学入門', url: 'https://www.stat.go.jp/', section: '基礎統計'},
      {title: 'Tableau Public', url: 'https://public.tableau.com/', section: 'データ可視化'}
    ],
    sections: [
      {title: '4-1 記述統計とデータの可視化', quizCount: 10},
      {title: '4-2 確率分布と仮説検定', quizCount: 10},
      {title: '4-3 回帰分析と相関分析', quizCount: 10},
      {title: '4-4 多変量解析の基礎', quizCount: 8},
      {title: '4-5 時系列分析と異常検知', quizCount: 8},
      {title: '4-6 BIツールとダッシュボード設計', quizCount: 8},
      {title: '4-7 A/Bテストと実験設計', quizCount: 8}
    ]
  },
  {
    id: 'ch05',
    title: '第5章 機械学習の基礎',
    description: '機械学習の分類、前処理、分類・回帰アルゴリズム、クラスタリング、モデル評価を網羅的に学ぶ。',
    sectionCount: 7,
    references: [
      {title: 'scikit-learn', url: 'https://scikit-learn.org/', section: 'MLライブラリ'},
      {title: 'Google ML Crash Course', url: 'https://developers.google.com/machine-learning/crash-course', section: 'ML基礎'}
    ],
    sections: [
      {title: '5-1 機械学習の分類と適用場面', quizCount: 10},
      {title: '5-2 前処理と特徴量エンジニアリング', quizCount: 10},
      {title: '5-3 分類アルゴリズム（決定木、SVM、ブースティング）', quizCount: 10},
      {title: '5-4 回帰アルゴリズムとアンサンブル学習', quizCount: 8},
      {title: '5-5 クラスタリングと次元削減', quizCount: 8},
      {title: '5-6 モデル評価と性能指標', quizCount: 10},
      {title: '5-7 機械学習パイプラインの構築', quizCount: 8}
    ]
  },
  {
    id: 'ch06',
    title: '第6章 深層学習とニューラルネットワーク',
    description: 'ニューラルネットワークの仕組み、CNN、RNN/LSTM、Transformer、事前学習モデル、深層学習フレームワークを学ぶ。',
    sectionCount: 8,
    references: [
      {title: 'PyTorch', url: 'https://pytorch.org/', section: '深層学習フレームワーク'},
      {title: 'TensorFlow', url: 'https://www.tensorflow.org/', section: 'MLプラットフォーム'},
      {title: 'Attention Is All You Need', url: 'https://arxiv.org/abs/1706.03762', section: 'Transformer論文'}
    ],
    sections: [
      {title: '6-1 ニューラルネットワークの仕組みと学習', quizCount: 10},
      {title: '6-2 CNN（畳み込みニューラルネットワーク）', quizCount: 10},
      {title: '6-3 RNNとLSTM・GRU', quizCount: 8},
      {title: '6-4 Transformerアーキテクチャ', quizCount: 10},
      {title: '6-5 事前学習モデルと転移学習', quizCount: 10},
      {title: '6-6 深層学習フレームワーク（PyTorch/TensorFlow）', quizCount: 8},
      {title: '6-7 生成モデル（GAN・VAE・拡散モデル）', quizCount: 8},
      {title: '6-8 深層学習の実践テクニック', quizCount: 8}
    ]
  },
  {
    id: 'ch07',
    title: '第7章 生成AIと大規模言語モデル（LLM）',
    description: '生成AIの基礎、LLMの仕組み、プロンプトエンジニアリング、RAG、Fine-tuning、AIエージェント、マルチモーダルAIを学ぶ。',
    sectionCount: 8,
    references: [
      {title: 'OpenAI Documentation', url: 'https://platform.openai.com/docs', section: 'GPTモデル'},
      {title: 'LangChain', url: 'https://langchain.com/', section: 'LLMアプリケーションフレームワーク'},
      {title: 'Hugging Face', url: 'https://huggingface.co/', section: 'MLモデルハブ'}
    ],
    sections: [
      {title: '7-1 生成AIの基礎と種類（GAN・VAE・拡散モデル）', quizCount: 8},
      {title: '7-2 大規模言語モデル（LLM）の仕組み', quizCount: 10},
      {title: '7-3 プロンプトエンジニアリング', quizCount: 10},
      {title: '7-4 RAG（検索拡張生成）', quizCount: 10},
      {title: '7-5 Fine-tuningとアダプタ手法（LoRA・QLoRA）', quizCount: 10},
      {title: '7-6 AIエージェントとマルチエージェントシステム', quizCount: 10},
      {title: '7-7 マルチモーダルAIと画像生成', quizCount: 8},
      {title: '7-8 LLMの運用と最適化', quizCount: 8}
    ]
  },
  {
    id: 'ch08',
    title: '第8章 AIエージェントとMLOps',
    description: 'AIエージェントの概念、Function Calling、MLOpsライフサイクル、CI/CD、モニタリング、実験管理を学ぶ。',
    sectionCount: 6,
    references: [
      {title: 'MLOps Community', url: 'https://mlops.community/', section: 'MLOps知見'},
      {title: 'Google MLOps', url: 'https://cloud.google.com/architecture/mlops-continuous-delivery-and-automation-pipelines-in-machine-learning', section: 'MLOps実践'},
      {title: 'MLflow', url: 'https://mlflow.org/', section: '実験管理'}
    ],
    sections: [
      {title: '8-1 AIエージェントの概念とアーキテクチャ', quizCount: 10},
      {title: '8-2 Function Callingとツール使用', quizCount: 10},
      {title: '8-3 MLOpsの基盤とライフサイクル', quizCount: 10},
      {title: '8-4 CI/CDパイプラインと自動化', quizCount: 8},
      {title: '8-5 モデルモニタリングとドリフト検知', quizCount: 8},
      {title: '8-6 実験管理とモデルバージョニング', quizCount: 8}
    ]
  },
  {
    id: 'ch09',
    title: '第9章 AI倫理・ガバナンス・法制度',
    description: 'AI倫理の基本原則、バイアス・フェアネス、XAI、プライバシー保護、知的財産権、国内外の規制を学ぶ。',
    sectionCount: 5,
    references: [
      {title: 'AI戦略会議', url: 'https://www.ai-strategy.go.jp/', section: 'AIガバナンス'},
      {title: 'EU AI Act', url: 'https://artificialintelligenceact.eu/', section: 'EU AI法'},
      {title: 'OECD AI Principles', url: 'https://oecd.ai/en/ai-principles', section: 'OECD AI原則'}
    ],
    sections: [
      {title: '9-1 AI倫理の基本原則とガイドライン', quizCount: 10},
      {title: '9-2 バイアス・フェアネスと差別防止', quizCount: 10},
      {title: '9-3 説明可能なAI（XAI）', quizCount: 10},
      {title: '9-4 プライバシー保護と匿名化技術', quizCount: 8},
      {title: '9-5 AIと知的財産権・著作権・国内外規制', quizCount: 10}
    ]
  },
  {
    id: 'ch10',
    title: '第10章 実践的データ・AIプロジェクト',
    description: 'プロジェクト設計、アジャイル開発、エッジAI、コスト設計、組織改革、将来展望を学ぶ。',
    sectionCount: 4,
    references: [
      {title: 'CRISP-DM', url: 'https://www.datascience-pm.com/crisp-dm-2/', section: 'データマイニングプロセス'},
      {title: 'Team Data Science Process', url: 'https://learn.microsoft.com/en-us/azure/architecture/data-science-process/overview', section: 'Microsoftのデータサイエンスプロセス'}
    ],
    sections: [
      {title: '10-1 プロジェクト設計と要件定義', quizCount: 10},
      {title: '10-2 アジャイル開発とPoC・パイロット', quizCount: 10},
      {title: '10-3 エッジAIとデバイス最適化・コスト設計', quizCount: 8},
      {title: '10-4 組織変革とデータ・AI活用の将来展望', quizCount: 8}
    ]
  }
];

// 旧シラバスを読み込み
const oldSyllabusPath = path.join(__dirname, '..', 'data', 'syllabus.json');
const oldSyllabus = JSON.parse(fs.readFileSync(oldSyllabusPath, 'utf8'));

// 新しいシラバスを構築
const newStructure = {
  version: '2.0',
  title: '2027年 プロフェッショナルデジタルスキル（データ・AI）試験対策',
  description: 'データ活用とAI活用の専門知識を網羅した学習シラバス。IPA DSS v2.1、JDLA G検定、および2025-2026年の最新生成AIトレンドを統合。',
  totalSections: 0,
  chapters: []
};

chapterDefs.forEach((chDef, chIndex) => {
  const oldChapter = oldSyllabus.chapters.find(c => c.id === chDef.id);
  
  const newChapter = {
    id: chDef.id,
    title: chDef.title,
    description: chDef.description,
    order: chIndex + 1,
    references: chDef.references,
    sections: []
  };
  
  // セクションを構築
  chDef.sections.forEach((secDef, secIndex) => {
    const secNum = String(secIndex + 1).padStart(2, '0');
    
    // 旧シラバスから対応するcontentを探す（あれば使用）
    let content = 'TBD: コンテンツはPhase 2-2で作成予定';
    if (oldChapter && oldChapter.sections[secIndex]) {
      content = oldChapter.sections[secIndex].content;
    }
    
    newChapter.sections.push({
      id: chDef.id + '-sec' + secNum,
      chapterId: chDef.id,
      title: secDef.title,
      content: content,
      order: secIndex + 1,
      quizCount: secDef.quizCount
    });
  });
  
  newStructure.chapters.push(newChapter);
});

// 合計節数を計算
newStructure.totalSections = newStructure.chapters.reduce((sum, ch) => sum + ch.sections.length, 0);

// ファイルに書き出し
const outputPath = path.join(__dirname, '..', 'data', 'syllabus_v2.json');
fs.writeFileSync(outputPath, JSON.stringify(newStructure, null, 2));

console.log('✅ syllabus_v2.json 作成完了');
console.log('合計節数: ' + newStructure.totalSections + '節');
console.log('章ごとの節数:');
newStructure.chapters.forEach(ch => {
  console.log('  ' + ch.title + ': ' + ch.sections.length + '節');
});
