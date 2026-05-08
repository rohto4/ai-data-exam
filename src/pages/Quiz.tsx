import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { createStorageAPI } from "../lib/storage";
import syllabusData from "../../data/syllabus.json";
import quizzesData from "../../data/quizzes.json";
import { Quiz as QuizType } from "../lib/storage";
import { ChevronRight, Check, X, HelpCircle } from "lucide-react";

const api = createStorageAPI();

export default function Quiz() {
  const { sectionId } = useParams<{ sectionId: string }>();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizResults, setQuizResults] = useState<{ questionId: string; isCorrect: boolean }[]>([]);

  const section = syllabusData.chapters
    .flatMap((ch) => ch.sections)
    .find((s) => s.id === sectionId);

  const chapter = syllabusData.chapters.find((ch) => ch.id === section?.chapterId);

  const quizzes = (quizzesData.quizzes as QuizType[]).filter(
    (q) => q.sectionId === sectionId
  );

  const currentQuiz = quizzes[currentIndex];
  const isLastQuestion = currentIndex === quizzes.length - 1;

  if (!currentQuiz) {
    return <div className="p-4">クイズが見つかりません</div>;
  }

  const handleSelectChoice = (index: number) => {
    if (showExplanation) return;
    setSelectedChoice(index);
  };

  const handleCheckAnswer = () => {
    if (selectedChoice === null) return;
    setShowExplanation(true);
    
    const isCorrect = selectedChoice === currentQuiz.correctIndex;
    setQuizResults([...quizResults, { questionId: currentQuiz.id, isCorrect }]);
    
    // 誤答の場合は履歴に記録
    if (!isCorrect) {
      const history = api.getHistory();
      const existingMistake = history.mistakes.find(m => m.questionId === currentQuiz.id);
      
      if (existingMistake) {
        // 既存の誤答を更新
        existingMistake.totalAttempts += 1;
        existingMistake.wrongAnswerIndex = selectedChoice;
        existingMistake.resolved = false;
        delete existingMistake.resolvedAt;
      } else {
        // 新規誤答を追加
        history.mistakes.push({
          questionId: currentQuiz.id,
          sectionId: sectionId!,
          chapterId: chapter?.id || '',
          wrongAnswerIndex: selectedChoice,
          firstMistakeAt: new Date().toISOString(),
          totalAttempts: 1,
          resolved: false,
          reviewed: false,
        });
      }
      
      api.saveHistory(history);
    }
  };

  const handleNext = () => {
    if (isLastQuestion) {
      // 節の完了を記録
      const progress = api.getProgress();
      const existingSection = progress.completedSections.find(
        (cs) => cs.sectionId === sectionId
      );
      
      if (!existingSection) {
        progress.completedSections.push({
          sectionId: sectionId!,
          textRead: false,
          quizCompleted: true,
          quizCompletedAt: new Date().toISOString(),
          quizResults: quizResults.map((r, idx) => ({
            questionId: quizzes[idx].id,
            isCorrect: r.isCorrect,
            answeredAt: new Date().toISOString(),
            attempts: 1,
          })),
          quizReviewed: false,
        });
        api.saveProgress(progress);
      }
      
      navigate(`/sections/${sectionId}`);
    } else {
      setCurrentIndex(currentIndex + 1);
      setSelectedChoice(null);
      setShowExplanation(false);
    }
  };

  const getChoiceStyle = (index: number) => {
    if (!showExplanation) {
      return selectedChoice === index
        ? "border-sky-500 bg-sky-50"
        : "border-gray-200 hover:border-sky-300 hover:bg-gray-50";
    }

    if (index === currentQuiz.correctIndex) {
      return "border-green-500 bg-green-50";
    }
    if (selectedChoice === index && index !== currentQuiz.correctIndex) {
      return "border-red-500 bg-red-50";
    }
    return "border-gray-200 opacity-50";
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
        <span>クイズ</span>
      </div>

      {/* 進捗 */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">
          問題 {currentIndex + 1} / {quizzes.length}
        </h1>
        <div className="w-32 bg-gray-200 rounded-full h-2">
          <div
            className="bg-sky-500 h-2 rounded-full transition-all"
            style={{ width: `${((currentIndex + 1) / quizzes.length) * 100}%` }}
          />
        </div>
      </div>

      {/* 問題 */}
      <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
        <h2 className="text-lg font-medium text-gray-900">{currentQuiz.question}</h2>

        {/* 選択肢 */}
        <div className="space-y-3">
          {currentQuiz.choices.map((choice, index) => (
            <button
              key={index}
              onClick={() => handleSelectChoice(index)}
              disabled={showExplanation}
              className={`w-full p-4 border-2 rounded-lg text-left transition-colors ${getChoiceStyle(index)}`}
            >
              <div className="flex items-center gap-3">
                <span className="font-semibold text-gray-500">{["A", "B", "C", "D"][index]}</span>
                <span className="text-gray-900">{choice}</span>
                {showExplanation && index === currentQuiz.correctIndex && (
                  <Check size={20} className="text-green-600 ml-auto" />
                )}
                {showExplanation && selectedChoice === index && index !== currentQuiz.correctIndex && (
                  <X size={20} className="text-red-600 ml-auto" />
                )}
              </div>
            </button>
          ))}
        </div>

        {/* 解説 */}
        {showExplanation && (
          <div className="border-t border-gray-200 pt-4">
            <div className="flex items-start gap-2 text-gray-700">
              <HelpCircle size={20} className="text-sky-500 flex-shrink-0 mt-0.5" />
              <p>{currentQuiz.explanation}</p>
            </div>
          </div>
        )}

        {/* アクションボタン */}
        <div className="flex justify-end gap-3 pt-4">
          {!showExplanation ? (
            <button
              onClick={handleCheckAnswer}
              disabled={selectedChoice === null}
              className="px-6 py-2 bg-sky-500 hover:bg-sky-600 disabled:bg-gray-300 text-white rounded-lg font-semibold transition-colors"
            >
              回答する
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg font-semibold transition-colors"
            >
              {isLastQuestion ? "完了" : "次へ"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
