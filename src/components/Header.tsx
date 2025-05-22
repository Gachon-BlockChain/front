"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-white shadow">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-black font-bold">
          <Link href="/">블록은역시레고</Link>
        </h1>
        <nav className="space-x-4 text-black font-medium">
          <Link href="/" className="hover:underline">기프티콘 목록</Link>
          <Link href="/sell" className="hover:underline">판매하기</Link>
          <Link href="/mypage" className="hover:underline">마이페이지</Link>
        </nav>
      </div>
    </header>
  );
}
