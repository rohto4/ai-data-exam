import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { createStorageAPI } from "../lib/storage";
import quizzesData from "../../data/quizzes.json";
import { Quiz as QuizType } from "../lib/storage";
import { RotateCcw, CheckCircle2, X, HelpCircle } from "lucide-react";

const api = createStorageAPI();

export default function Review() {
  const [history, setHistory] = useState(api.getHistory());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [, setShowAnswer] = useState(false);

  // 未解決の誤答を取得（優先順位付き）
  const reviewQuizzes = useMemo(() => {
    // 未解決の誤答を抽出
    const unresolved = history.mistakes.filter((m) => !m.resolved);
    
    // 優先順位でソート
    // 1. 未復習（reviewed=false）が最優先
    // 2. その中で古いもの（firstMistakeAtが古い）を優先
    // 3. 復習済みだが未解決のものは後回し
    const sorted = [...unresolved].sort((a, b) => {
      // 未復習を優先
      if (a.reviewed !== b.reviewed) {
        return a.reviewed ? 1 : -1;
      }
      // 古い誤答を優先
      return new Date(a.firstMistakeAt).getTime() - new Date(b.firstMistakeAt).getTime();
    });
    
    // 最大20問に制限
    return sorted.slice(0, 20);
  }, [history]);

  const currentMistake = reviewQuizzes[currentIndex];
  const currentQuiz = (quizzesData.quizzes as QuizType[]).find(
    (q) => q.id === currentMistake?.questionId
  );

  if (reviewQuizzes.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">復習モード</h1>
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <CheckCircle2 size={48} className="text-green-500 mx-auto mb-4" />
          <p className="text-lg text-gray-700">未解決の誤答はありません！</p>
          <p className="text-gray-500 mt-2">すべての問題をマスターしました。</p>
          <Link
            to="/"
            className="inline-block mt-6 px-6 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg font-semibold transition-colors"
          >
            ダッシュボードへ戻る
          </Link>
        </div>
      </div>
    );
  }

  const handleResolve = () => {
    // 誤答を解決済みにマーク
    const updatedHistory = { ...history };
    const mistakeIndex = updatedHistory.mistakes.findIndex(
      (m) => m.questionId === currentMistake.questionId
    );
    if (mistakeIndex !== -1) {
      updatedHistory.mistakes[mistakeIndex].resolved = true;
      updatedHistory.mistakes[mistakeIndex].resolvedAt = new Date().toISOString();
      updatedHistory.mistakes[mistakeIndex].reviewed = true;
      updatedHistory.mistakes[mistakeIndex].reviewedAt = new Date().toISOString();
      api.saveHistory(updatedHistory);
      setHistory(updatedHistory);
    }

    if (currentIndex < reviewQuizzes.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowAnswer(false);
    }
  };

  const handleNext = () => {
    // 復習したが未解決としてマーク
    const updatedHistory = { ...history };
    const mistakeIndex = updatedHistory.mistakes.findIndex(
      (m) => m.questionId === currentMistake.questionId
    );
    if (mistakeIndex !== -1) {
      updatedHistory.mistakes[mistakeIndex].reviewed = true;
      updatedHistory.mistakes[mistakeIndex].reviewedAt = new Date().toISOString();
      api.saveHistory(updatedHistory);
      setHistory(updatedHistory);
    }

    if (currentIndex < reviewQuizzes.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowAnswer(false);
    }
  };

  if (!currentQuiz) {
    return <div className="p-4">問題が見つかりません</div>;
  }

  // 統計情報
  const unreviewedCount = history.mistakes.filter(m => !m.resolved && !m.reviewed).length;
  const reviewedCount = history.mistakes.filter(m => !m.resolved && m.reviewed).length;

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">復習モード</h1>
        <div className="flex items-center gap-2 text-sky-600">
          <RotateCcw size={20} />
          <span className="font-semibold">
            {currentIndex + 1} / {reviewQuizzes.length}
          </span>
        </div>
      </div>

      {/* 統計 */}
      <div className="flex gap-4 text-sm">
        <p className="text-gray-600">
          未復習の誤答: <span className="font-semibold text-red-600">{unreviewedCount}</span>件
        </p>
        <p className="text-gray-600">
          復習済み（未解決）: <span className="font-semibold text-orange-600">{reviewedCount}</span>件
        </p>
      </div>

      {/* 問題 */}
      <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
        <h2 className="text-lg font-medium text-gray-900">{currentQuiz.question}</h2>

        {/* 選択肢 */}
        <div className="space-y-3">
          {currentQuiz.choices.map((choice, index) => (
            <div
              key={index}
              className={`p-4 border-2 rounded-lg ${
                index === currentQuiz.correctIndex
                  ? "border-green-500 bg-green-50"
                  : index === currentMistake.wrongAnswerIndex
                  ? "border-red-500 bg-red-50"
                  : "border-gray-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="font-semibold text-gray-500">
                  {["A", "B", "C", "D"][index]}
                </span>
                <span className="text-gray-900">{choice}</span>
                {index === currentQuiz.correctIndex && (
                  <CheckCircle2 size={20} className="text-green-600 ml-auto" />
                )}
                {index === currentMistake.wrongAnswerIndex && (
                  <X size={20} className="text-red-600 ml-auto" />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* 解説 */}
        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-start gap-2 text-gray-700">
            <HelpCircle size={20} className="text-sky-500 flex-shrink-0 mt-0.5" />
            <p>{currentQuiz.explanation}</p>
          </div>
        </div>

        {/* 試行情報 */}
        <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-600">
          誤答回数: {currentMistake.totalAttempts}回 | 
          初回誤答: {new Date(currentMistake.firstMistakeAt).toLocaleDateString('ja-JP')}
        </div>

        {/* アクションボタン */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={handleNext}
            className="px-6 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-semibold transition-colors"
          >
            まだ復習が必要
          </button>
          <button
            onClick={handleResolve}
            className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-colors"
          >
            理解した ✓
          </button>
        </div>
      </div>
    </div>
  );
}
