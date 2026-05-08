import { ReactNode } from "react";
import AppBar from "./AppBar";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <AppBar />
      <main className="pt-14 pb-8 px-4 max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  );
}
