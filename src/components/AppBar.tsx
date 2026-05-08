import { Link, useLocation } from "react-router-dom";
import { RotateCcw, Settings, Home, ClipboardCheck } from "lucide-react";

export default function AppBar() {
  const location = useLocation();

  const navItems = [
    { path: "/", icon: Home, label: "ホーム" },
    { path: "/mock-exam", icon: ClipboardCheck, label: "模試" },
    { path: "/review", icon: RotateCcw, label: "復習" },
    { path: "/settings", icon: Settings, label: "設定" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-[#7DD3FC] text-white shadow-md z-50">
      <div className="h-full flex items-center justify-between px-4 max-w-7xl mx-auto">
        {/* ロゴ */}
        <Link to="/" className="text-lg font-bold hover:text-[#F0F9FF] transition-colors">
          データ・AI 試験対策
        </Link>

        {/* ナビゲーション */}
        <nav className="flex items-center gap-1">
          {navItems.map(({ path, icon: Icon, label }) => {
            const isActive = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? "bg-[#0284C7] text-white"
                    : "text-white hover:bg-[#0284C7]"
                }`}
              >
                <Icon size={18} />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
