"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-white shadow">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">
          <Link href="/">GiftSwap</Link>
        </h1>
        <nav className="space-x-4 text-sm font-medium">
          <Link href="/gifticons" className="hover:underline">기프티콘 목록</Link>
          <Link href="/sell" className="hover:underline">판매하기</Link>
          <Link href="/mypage" className="hover:underline">마이페이지</Link>
        </nav>
      </div>
    </header>
  );
}
