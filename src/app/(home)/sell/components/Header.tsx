'use client';

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // ✅ Next.js 13+ App Router용
import { ChevronLeft } from "lucide-react";
import { Button } from '@/components/ui/button';

export default function Header() {
  const router = useRouter(); // ✅ 라우터 인스턴스

  const handleSubmit = () => {
    router.push("/resell"); // ✅ 버튼 누르면 이동
  };

  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200">
      {/* 왼쪽: 뒤로가기 + 제목 */}
      <div className="flex items-center">
        <Link href="/" className="mr-4">
          <ChevronLeft size={24} />
        </Link>
        <h1 className="text-xl font-bold">신상품 등록</h1>
      </div>

      {/* 오른쪽: 등록하기 버튼 */}
      <Button
        className="bg-blue-500 hover:bg-blue-600"
        onClick={handleSubmit}
      >
        NFT 등록
      </Button>
    </div>
  );
}
