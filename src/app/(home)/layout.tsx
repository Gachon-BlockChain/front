import React from "react";
import type { Metadata } from "next";
import StatusBar from "./components/StatusBar";
import BottomNavigation from "./components/BottomNavigation";

export const metadata: Metadata = {
  title: "기프티콘 마켓",
  description: "기프티콘을 거래하는 플랫폼입니다.",
};

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="max-w-md mx-auto min-h-screen bg-white flex flex-col">
      <StatusBar />
      {/* 메인 콘텐츠 */}
      <div className="flex-1 overflow-auto">{children}</div>

      {/* 네비게이션 바 (Bottom Navigation) */}
      <div className="h-16 border-t border-gray-200"></div>
      <BottomNavigation />
    </div>
  );
}
