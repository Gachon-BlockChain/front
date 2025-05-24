import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";

// 판매 중인 상품 목록을 위한 가상 데이터
const mockProducts = [
  {
    id: 1,
    title: "스타벅스 아메리카노 Tall",
    price: 3.8,
    expiryDate: "2025-12-31",
    imageUrl: "/images/sample/starbucks.jpg",
  },
  {
    id: 2,
    title: "배스킨라빈스 싱글레귤러",
    price: 2.9,
    expiryDate: "2025-11-15",
    imageUrl: "/images/sample/baskin.jpg",
  },
  {
    id: 3,
    title: "CGV 영화 관람권",
    price: 9.1,
    expiryDate: "2026-01-20",
    imageUrl: "/images/sample/cu.jpg",
  },
];

export default function CurrentSales() {
  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold">판매 중인 상품</h3>
          <Link
            href="/mypage/sales"
            className="flex items-center text-sm text-gray-500"
          >
            전체보기 <ChevronRight size={16} className="ml-1" />
          </Link>
        </div>

        <div className="space-y-4">
          {mockProducts.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.id}`}
              className="flex items-center border-b border-gray-100 pb-3 last:border-0 last:pb-0"
            >
              <div className="relative w-16 h-16 bg-gray-100 rounded-md overflow-hidden">
                <Image
                  src={product.imageUrl}
                  alt={product.title}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>

              <div className="ml-3 flex-1">
                <h4 className="font-medium">{product.title}</h4>
                <p className="text-sm text-gray-500">
                  유효기간: {product.expiryDate}
                </p>
                <p className="text-[#366CFF] font-bold mt-1">
                  {product.price.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })} POL
                </p>
              </div>
            </Link>
          ))}
        </div>

        {mockProducts.length === 0 && (
          <div className="py-8 text-center text-gray-500">
            판매 중인 상품이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}
