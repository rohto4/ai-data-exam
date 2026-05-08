import { useParams, Link } from "react-router-dom";
import { createStorageAPI } from "../lib/storage";
import syllabusData from "../../data/syllabus.json";
import { ChevronRight, CheckCircle2, BookOpen, ExternalLink } from "lucide-react";
import { useState } from "react";

const api = createStorageAPI();

interface Reference {
  title: string;
  url: string;
  section?: string;
}

interface Chapter {
  id: string;
  title: string;
  description: string;
  order: number;
  sections: Array<{
    id: string;
    chapterId: string;
    title: string;
    content: string;
    order: number;
    quizCount: number;
  }>;
  references?: Reference[];
}

export default function ChapterDetail() {
  const { chapterId } = useParams<{ chapterId: string }>();
  const [progress] = useState(api.getProgress());
  
  const chapter = (syllabusData.chapters as Chapter[]).find(
    (c) => c.id === chapterId
  );

  if (!chapter) {
    return <div className="p-4">章が見つかりません</div>;
  }

  // 章の進捗率
  const completedCount = chapter.sections.filter((s) =>
    progress.completedSections.some((cs) => cs.sectionId === s.id)
  ).length;
  const chapterProgress = Math.round((completedCount / chapter.sections.length) * 100);

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link to="/" className="hover:text-sky-600">ホーム</Link>
        <ChevronRight size={16} />
        <span>{chapter.title}</span>
      </div>

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{chapter.title}</h1>
        <div className="text-right">
          <span className="text-2xl font-bold text-sky-600">{chapterProgress}%</span>
          <p className="text-sm text-gray-500">完了</p>
        </div>
      </div>

      {/* 進捗バー */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-sky-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${chapterProgress}%` }}
          />
        </div>
        <p className="text-sm text-gray-600 mt-2">
          {completedCount} / {chapter.sections.length} 節完了
        </p>
      </div>

      {/* 節一覧 */}
      <div className="space-y-3">
        {chapter.sections.map((section, index) => {
          const isCompleted = progress.completedSections.some(
            (cs) => cs.sectionId === section.id
          );
          return (
            <Link
              key={section.id}
              to={`/sections/${section.id}`}
              className={`block p-4 rounded-xl shadow-sm transition-colors ${
                isCompleted
                  ? "bg-green-50 hover:bg-green-100"
                  : "bg-white hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  {isCompleted ? (
                    <CheckCircle2 size={24} className="text-green-600" />
                  ) : (
                    <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center text-sm text-gray-500">
                      {index + 1}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{section.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {section.content}
                  </p>
                </div>
                <ChevronRight size={20} className="text-gray-400" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* 参考文献 */}
      {chapter.references && chapter.references.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <BookOpen size={20} className="text-sky-500" />
            参考文献・出典
          </h2>
          <ul className="space-y-3">
            {chapter.references.map((ref, index) => (
              <li key={index} className="flex items-start gap-3">
                <ExternalLink size={16} className="text-sky-400 mt-1 flex-shrink-0" />
                <div>
                  <a
                    href={ref.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sky-600 hover:text-sky-700 font-medium hover:underline"
                  >
                    {ref.title}
                  </a>
                  {ref.section && (
                    <p className="text-sm text-gray-500">{ref.section}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
