import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { createStorageAPI } from "../lib/storage";
import syllabusData from "../../data/syllabus.json";
import { Section as SectionType } from "../lib/storage";
import { ChevronRight, PlayCircle, CheckCircle2, BookOpen } from "lucide-react";

const api = createStorageAPI();

export default function SectionDetail() {
  const { sectionId } = useParams<{ sectionId: string }>();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(api.getProgress());

  const section = syllabusData.chapters
    .flatMap((ch) => ch.sections)
    .find((s: SectionType) => s.id === sectionId);

  if (!section) {
    return <div className="p-4">節が見つかりません</div>;
  }

  const chapter = syllabusData.chapters.find((ch) => ch.id === section.chapterId);
  
  // 節の完了状態を取得
  const sectionStatus = progress.completedSections.find((cs) => cs.sectionId === sectionId);
  const isTextRead = sectionStatus?.textRead || false;
  const isQuizCompleted = sectionStatus?.quizCompleted || false;

  // コンテンツ表示
  const content = section.content || "";

  const handleStartQuiz = () => {
    navigate(`/quiz/${sectionId}`);
  };

  const handleMarkAsRead = () => {
    const newProgress = { ...progress };
    const existingIndex = newProgress.completedSections.findIndex(
      (cs) => cs.sectionId === sectionId
    );

    if (existingIndex >= 0) {
      // 既存のエントリを更新
      newProgress.completedSections[existingIndex].textRead = true;
      newProgress.completedSections[existingIndex].textReadAt = new Date().toISOString();
    } else {
      // 新規エントリを作成
      newProgress.completedSections.push({
        sectionId: sectionId!,
        textRead: true,
        textReadAt: new Date().toISOString(),
        quizCompleted: false,
        quizResults: [],
        quizReviewed: false,
      });
    }

    api.saveProgress(newProgress);
    setProgress(newProgress);
  };

  return (
    <div className="space-y-6">
      {/* パンくず */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link to="/" className="hover:text-sky-600">ホーム</Link>
        <ChevronRight size={16} />
        <Link to={`/chapters/${chapter?.id}`} className="hover:text-sky-600">
          {chapter?.title}
        </Link>
        <ChevronRight size={16} />
        <span>{section.title}</span>
      </div>

      {/* コンテンツ */}
      <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-900">{section.title}</h1>
          {isQuizCompleted && (
            <CheckCircle2 size={24} className="text-green-600" />
          )}
        </div>

        {/* ステータスバッジ */}
        <div className="flex gap-2">
          {isTextRead ? (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-sky-100 text-sky-700">
              <BookOpen size={14} />
              教本読了済み
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-600">
              <BookOpen size={14} />
              教本未読
            </span>
          )}
          {isQuizCompleted && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
              <CheckCircle2 size={14} />
              クイズ完了
            </span>
          )}
        </div>

        <div className="prose max-w-none">
          <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
            {content || section.content}
          </div>
        </div>

        {/* アクションボタン */}
        <div className="border-t border-gray-200 pt-4 space-y-3">
          {/* 読了ボタン */}
          {!isTextRead && (
            <button
              onClick={handleMarkAsRead}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-lg font-semibold transition-colors shadow-sm"
            >
              <BookOpen size={20} />
              教本を読了しました
            </button>
          )}

          {/* クイズ情報 */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">
                この節のクイズ：{section.quizCount}問
              </p>
            </div>
            <button
              onClick={handleStartQuiz}
              className="flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-colors shadow-sm"
            >
              <PlayCircle size={20} />
              {isQuizCompleted ? "クイズを再挑戦" : "クイズを始める"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
