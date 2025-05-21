import React from "react";
import { Settings } from "lucide-react";
import Link from "next/link";

export default function MyPageHeader() {
  return (
    <header className="flex justify-between items-center px-4 py-3 border-b border-gray-100">
      <h1 className="text-lg font-semibold">마이페이지</h1>
      <Link href="/settings" className="p-1">
        <Settings size={24} />
      </Link>
    </header>
  );
}
