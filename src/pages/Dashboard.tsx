import { useState } from "react";
import { Link } from "react-router-dom";
import { createStorageAPI } from "../lib/storage";
import syllabusData from "../../data/syllabus.json";
import { Chapter as ChapterType, CompletedSection } from "../lib/storage";
import { CheckCircle2, Circle, BookOpen, Brain, RotateCcw, Clock } from "lucide-react";

const api = createStorageAPI();

// ステータスバッジの種類
const StatusBadge = {
  UNREAD: { label: "未読", color: "bg-gray-100 text-gray-600" },
  READ: { label: "読了", color: "bg-sky-100 text-sky-700" },
  IN_PROGRESS: { label: "学習中", color: "bg-orange-100 text-orange-700" },
  QUIZ_DONE: { label: "クイズ完了", color: "bg-green-100 text-green-700" },
  REVIEWED: { label: "復習完了", color: "bg-emerald-100 text-emerald-700" },
};

export default function Dashboard() {
  const [progress] = useState(api.getProgress());
  const [history] = useState(api.getHistory());
  const chapters = syllabusData.chapters as ChapterType[];

  // 節の完了状態を取得
  const getSectionStatus = (sectionId: string): CompletedSection | undefined => {
    return progress.completedSections.find((cs) => cs.sectionId === sectionId);
  };

  // ステータスバッジを取得
  const getStatusBadge = (sectionId: string) => {
    const status = getSectionStatus(sectionId);
    if (!status) return StatusBadge.UNREAD;
    if (status.quizReviewed) return StatusBadge.REVIEWED;
    if (status.quizCompleted) return StatusBadge.QUIZ_DONE;
    if (status.textRead) return StatusBadge.IN_PROGRESS;
    return StatusBadge.READ;
  };

  // 章ごとの3進捗率を計算
  const getChapterProgress = (chapterId: string) => {
    const chapter = chapters.find((c) => c.id === chapterId);
    if (!chapter) return { text: 0, quiz: 0, review: 0 };

    const sections = chapter.sections;
    const sectionIds = sections.map((s) => s.id);
    const completedSections = progress.completedSections.filter((cs) =>
      sectionIds.includes(cs.sectionId)
    );

    const textRead = completedSections.filter((cs) => cs.textRead).length;
    const quizDone = completedSections.filter((cs) => cs.quizCompleted).length;
    const reviewed = completedSections.filter((cs) => cs.quizReviewed).length;

    return {
      text: Math.round((textRead / sections.length) * 100),
      quiz: Math.round((quizDone / sections.length) * 100),
      review: Math.round((reviewed / sections.length) * 100),
    };
  };

  // 全体進捗
  const totalSections = chapters.reduce((sum, ch) => sum + ch.sections.length, 0);
  const textReadCount = progress.completedSections.filter((cs) => cs.textRead).length;
  const quizDoneCount = progress.completedSections.filter((cs) => cs.quizCompleted).length;
  const reviewedCount = progress.completedSections.filter((cs) => cs.quizReviewed).length;

  // 未復習の誤答数
  const unreviewedMistakes = history.mistakes.filter((m) => !m.resolved && !m.reviewed).length;

  return (
    <div className="space-y-6 pb-8">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">ダッシュボード</h1>
        {unreviewedMistakes > 0 && (
          <Link
            to="/review"
            className="flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-lg font-semibold hover:bg-orange-200 transition-colors"
          >
            <RotateCcw size={18} />
            復習が必要: {unreviewedMistakes}件
          </Link>
        )}
      </div>

      {/* 全体進捗 - 3本バー */}
      <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">学習の進捗</h2>
        
        {/* 教本読了 */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-700">
              <BookOpen size={16} className="text-sky-500" />
              <span>教本読了</span>
            </div>
            <span className="font-semibold text-sky-600">{Math.round((textReadCount / totalSections) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div
              className="bg-sky-400 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(textReadCount / totalSections) * 100}%` }}
            />
          </div>
        </div>

        {/* クイズ完了 */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-700">
              <Brain size={16} className="text-green-500" />
              <span>クイズ完了</span>
            </div>
            <span className="font-semibold text-green-600">{Math.round((quizDoneCount / totalSections) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div
              className="bg-green-400 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(quizDoneCount / totalSections) * 100}%` }}
            />
          </div>
        </div>

        {/* 復習完了 */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-700">
              <CheckCircle2 size={16} className="text-emerald-500" />
              <span>復習完了</span>
            </div>
            <span className="font-semibold text-emerald-600">{Math.round((reviewedCount / totalSections) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div
              className="bg-emerald-400 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(reviewedCount / totalSections) * 100}%` }}
            />
          </div>
        </div>

        <p className="text-sm text-gray-500 pt-2">
          {quizDoneCount} / {totalSections} 節のクイズ完了
        </p>
      </div>

      {/* 章一覧 - 縦長カード形式 */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">章一覧</h2>
        {chapters.map((chapter) => {
          const progress3 = getChapterProgress(chapter.id);
          return (
            <div
              key={chapter.id}
              className="bg-white rounded-xl shadow-sm overflow-hidden"
            >
              {/* 章ヘッダー - 3本バー */}
              <Link
                to={`/chapters/${chapter.id}`}
                className="block p-4 hover:bg-sky-50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">{chapter.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{chapter.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <div className="text-center">
                      <div className="text-xs text-gray-500">教本</div>
                      <div className="font-bold text-sky-600">{progress3.text}%</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-500">クイズ</div>
                      <div className="font-bold text-green-600">{progress3.quiz}%</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-500">復習</div>
                      <div className="font-bold text-emerald-600">{progress3.review}%</div>
                    </div>
                  </div>
                </div>

                {/* 3本の進捗バー */}
                <div className="flex gap-1 h-1.5">
                  <div
                    className="bg-sky-400 rounded-full transition-all duration-500"
                    style={{ width: `${progress3.text}%` }}
                  />
                  <div
                    className="bg-green-400 rounded-full transition-all duration-500"
                    style={{ width: `${progress3.quiz}%` }}
                  />
                  <div
                    className="bg-emerald-400 rounded-full transition-all duration-500"
                    style={{ width: `${progress3.review}%` }}
                  />
                </div>
              </Link>

              {/* 節一覧 - 縦並び */}
              <div className="border-t border-gray-100">
                {chapter.sections.map((section) => {
                  const badge = getStatusBadge(section.id);
                  return (
                    <Link
                      key={section.id}
                      to={`/sections/${section.id}`}
                      className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-b-0"
                    >
                      <div className="flex items-center gap-3">
                        {badge === StatusBadge.UNREAD ? (
                          <Circle size={16} className="text-gray-300" />
                        ) : badge === StatusBadge.REVIEWED ? (
                          <CheckCircle2 size={16} className="text-emerald-500" />
                        ) : (
                          <Clock size={16} className="text-sky-400" />
                        )}
                        <span className="text-gray-700">{section.title}</span>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${badge.color}`}>
                        {badge.label}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
