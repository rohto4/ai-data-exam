import { useState, useRef } from "react";
import { createStorageAPI } from "../lib/storage";
import { Download, Upload, Trash2 } from "lucide-react";

const api = createStorageAPI();

export default function Settings() {
  const [, setSettings] = useState(api.getSettings());
  const [message, setMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const data = api.exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ai-exam-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showMessage("データをエクスポートしました");
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        api.importData(data);
        setSettings(api.getSettings());
        showMessage("データをインポートしました");
      } catch (error) {
        showMessage("インポートに失敗しました: " + (error as Error).message);
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleClear = () => {
    if (confirm("すべての学習データを削除します。よろしいですか？")) {
      api.clearAll();
      setSettings(api.getSettings());
      showMessage("すべてのデータを削除しました");
    }
  };

  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">設定</h1>

      {/* メッセージ */}
      {message && (
        <div className="bg-sky-50 text-sky-700 px-4 py-3 rounded-lg">
          {message}
        </div>
      )}

      {/* データ管理 */}
      <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
        <h2 className="text-lg font-semibold text-gray-900">データ管理</h2>

        {/* エクスポート */}
        <div className="space-y-2">
          <h3 className="font-medium text-gray-700">データのエクスポート</h3>
          <p className="text-sm text-gray-600">
            学習進捨、誤答履歴、設定をJSONファイルとして保存します。
          </p>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg font-semibold transition-colors"
          >
            <Download size={20} />
            エクスポート
          </button>
        </div>

        {/* インポート */}
        <div className="space-y-2">
          <h3 className="font-medium text-gray-700">データのインポート</h3>
          <p className="text-sm text-gray-600">
            以前エクスポートしたJSONファイルからデータを復元します。
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-semibold transition-colors"
          >
            <Upload size={20} />
            インポート
          </button>
        </div>

        {/* データ削除 */}
        <div className="pt-4 border-t border-gray-200 space-y-2">
          <h3 className="font-medium text-red-700">データの削除</h3>
          <p className="text-sm text-gray-600">
            すべての学習データを削除します。この操作は元に戻せません。
          </p>
          <button
            onClick={handleClear}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors"
          >
            <Trash2 size={20} />
            すべて削除
          </button>
        </div>
      </div>

      {/* アプリ情報 */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">アプリ情報</h2>
        <div className="space-y-2 text-sm text-gray-600">
          <p>バージョン: 2.0</p>
          <p>データ形式: v2.0</p>
          <p className="text-gray-500 mt-4">
            2027年 プロフェッショナルデジタルスキル（データ・AI）試験対策
          </p>
        </div>
      </div>
    </div>
  );
}
