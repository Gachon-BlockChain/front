"use client";

import React from "react";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function DetailHeader() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type") || "purchase";

  return (
    <header className="flex items-center px-4 py-3 border-b border-gray-100">
      <Link href={`/mypage/transaction?type=${type}`} className="p-1 mr-2">
        <ChevronLeft size={24} />
      </Link>
      <h1 className="text-lg font-semibold">거래 상세 내역</h1>
    </header>
  );
}
