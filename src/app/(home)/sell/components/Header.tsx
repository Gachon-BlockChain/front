import React from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function Header() {
  return (
    <div className="flex items-center p-4 border-b border-gray-200">
      <Link href="/" className="mr-4">
        <ChevronLeft size={24} />
      </Link>
      <h1 className="text-xl font-bold">상품 등록</h1>
    </div>
  );
}
