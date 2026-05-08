import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import mockExamData from "../../data/mock-exam.json";
import { Clock, CheckCircle2, AlertCircle, ChevronLeft, ChevronRight, Trophy } from "lucide-react";

interface MockQuestion {
  id: string;
  question: string;
  choices: string[];
  correctIndex: number;
  explanation: string;
  difficulty: string;
  sectionId: string;
  chapterId: string;
}

export default function MockExam() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState(60 * 60); // 60分
  const [isFinished, setIsFinished] = useState(false);
  const [startTime] = useState(Date.now());

  const questions = mockExamData.questions as MockQuestion[];
  const currentQuestion = questions[currentIndex];

  // タイマー
  useEffect(() => {
    if (isFinished) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isFinished]);

  // 回答を選択
  const handleSelectAnswer = (questionId: string, answerIndex: number) => {
    if (isFinished) return;
    setAnswers((prev) => ({ ...prev, [questionId]: answerIndex }));
  };

  // 次の問題へ
  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  // 前の問題へ
  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  // 模試を終了
  const handleFinish = useCallback(() => {
    setIsFinished(true);
    
    // 結果を保存
    const endTime = Date.now();
    const duration = Math.floor((endTime - startTime) / 1000);
    
    const result = {
      takenAt: new Date().toISOString(),
      duration,
      totalQuestions: questions.length,
      answeredCount: Object.keys(answers).length,
      correctCount: questions.filter((q) => answers[q.id] === q.correctIndex).length,
      score: Math.round((questions.filter((q) => answers[q.id] === q.correctIndex).length / questions.length) * 100),
      answers,
    };
    
    // LocalStorageに保存
    const existingResults = JSON.parse(localStorage.getItem("ai-exam-mock-results") || "[]");
    existingResults.push(result);
    localStorage.setItem("ai-exam-mock-results", JSON.stringify(existingResults));
  }, [answers, questions, startTime]);

  // 時間表示
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // 結果表示
  if (isFinished) {
    const correctCount = questions.filter((q) => answers[q.id] === q.correctIndex).length;
    const score = Math.round((correctCount / questions.length) * 100);
    const passed = score >= mockExamData.passingScore;

    return (
      <div className="space-y-6 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 text-center">模試結果</h1>
        
        <div className="bg-white rounded-xl shadow-sm p-8 text-center space-y-6">
          <div className="flex justify-center">
            {passed ? (
              <Trophy size={64} className="text-yellow-500" />
            ) : (
              <AlertCircle size={64} className="text-orange-500" />
            )}
          </div>
          
          <div>
            <p className={`text-5xl font-bold ${passed ? "text-green-600" : "text-orange-600"}`}>
              {score}点
            </p>
            <p className="text-gray-500 mt-2">
              {passed ? "合格おめでとうございます！" : "合格基準まであと少し"}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">{correctCount}</p>
              <p className="text-sm text-gray-600">正解数</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">{questions.length - correctCount}</p>
              <p className="text-sm text-gray-600">不正解</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">{Object.keys(answers).length}</p>
              <p className="text-sm text-gray-600">回答数</p>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              合格基準: {mockExamData.passingScore}% ({Math.ceil(questions.length * mockExamData.passingScore / 100)}問以上)
            </p>
            <p className="text-sm text-gray-600">
              所要時間: {formatTime(Math.floor((Date.now() - startTime) / 1000))}
            </p>
          </div>

          <div className="flex gap-4 justify-center pt-4">
            <Link
              to="/"
              className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition-colors"
            >
              ダッシュボードへ
            </Link>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-lg font-semibold transition-colors"
            >
              もう一度受験
            </button>
          </div>
        </div>

        {/* 問題レビュー */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900">問題レビュー</h2>
          {questions.map((q, index) => {
            const userAnswer = answers[q.id];
            const isCorrect = userAnswer === q.correctIndex;
            
            return (
              <div
                key={q.id}
                className={`bg-white rounded-xl shadow-sm p-4 border-l-4 ${
                  isCorrect ? "border-green-500" : "border-red-500"
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-semibold text-gray-700">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 mb-2">{q.question}</p>
                    <div className="space-y-1 text-sm">
                      <p className={isCorrect ? "text-green-600" : "text-red-600"}>
                        あなたの回答: {userAnswer !== undefined ? ["A", "B", "C", "D"][userAnswer] : "未回答"} 
                        {isCorrect ? " ✓" : " ✗"}
                      </p>
                      {!isCorrect && (
                        <p className="text-green-600">
                          正解: {["A", "B", "C", "D"][q.correctIndex]}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">模擬試験</h1>
          <p className="text-gray-600">{questions.length}問 / 制限時間60分</p>
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold ${
          timeLeft < 300 ? "bg-red-100 text-red-700" : "bg-sky-100 text-sky-700"
        }`}>
          <Clock size={20} />
          <span className="text-xl">{formatTime(timeLeft)}</span>
        </div>
      </div>

      {/* 進捗バー */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">
            問題 {currentIndex + 1} / {questions.length}
          </span>
          <span className="text-sm text-gray-600">
            回答済み: {Object.keys(answers).length}問
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-sky-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* 問題 */}
      <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
        <h2 className="text-lg font-medium text-gray-900">
          問{currentIndex + 1}. {currentQuestion.question}
        </h2>

        {/* 選択肢 */}
        <div className="space-y-3">
          {currentQuestion.choices.map((choice, index) => {
            const isSelected = answers[currentQuestion.id] === index;
            return (
              <button
                key={index}
                onClick={() => handleSelectAnswer(currentQuestion.id, index)}
                className={`w-full p-4 border-2 rounded-lg text-left transition-colors ${
                  isSelected
                    ? "border-sky-500 bg-sky-50"
                    : "border-gray-200 hover:border-sky-300 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                    isSelected ? "bg-sky-500 text-white" : "bg-gray-100 text-gray-700"
                  }`}>
                    {["A", "B", "C", "D"][index]}
                  </span>
                  <span className="text-gray-900">{choice}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* ナビゲーション */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={20} />
            前の問題
          </button>

          <div className="flex gap-2">
            {currentIndex === questions.length - 1 ? (
              <button
                onClick={handleFinish}
                className="flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-colors"
              >
                <CheckCircle2 size={20} />
                模試を終了
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-lg font-semibold transition-colors"
              >
                次の問題
                <ChevronRight size={20} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 問題一覧（クイックジャンプ） */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <p className="text-sm font-medium text-gray-700 mb-3">問題一覧</p>
        <div className="flex flex-wrap gap-2">
          {questions.map((q, index) => {
            const isAnswered = answers[q.id] !== undefined;
            const isCurrent = index === currentIndex;
            return (
              <button
                key={q.id}
                onClick={() => setCurrentIndex(index)}
                className={`w-10 h-10 rounded-lg font-semibold text-sm transition-colors ${
                  isCurrent
                    ? "bg-sky-500 text-white"
                    : isAnswered
                    ? "bg-green-100 text-green-700 hover:bg-green-200"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {index + 1}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
