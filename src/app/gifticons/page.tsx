"use client";

import { useState } from "react";
import Layout from "@/components/Layout";
import GifticonCard from "@/components/GifticonCard";
import Link from "next/link";

const categories = ["전체", "식품", "상품권", "가구", "카페", "편의점", "패션", "기타"];

const dummyData = [
  {
    title: "스타벅스 아메리카노",
    category: "카페",
    price: 0.01,
    currency: "ETH",
    seller: "alice.eth",
    expiry: "2025-12-31",
    imageUrl: "/images/barcode.svg",
  },
  {
    title: "GS25 모바일 상품권",
    category: "편의점",
    price: 0.02,
    currency: "ETH",
    seller: "bob.eth",
    expiry: "2025-12-31",
    imageUrl: "/images/barcode.svg",
  },
  {
    title: "이케아 테이블 쿠폰",
    category: "가구",
    price: 0.03,
    currency: "BTC",
    seller: "carol.eth",
    expiry: "2025-12-31",
    imageUrl: "/images/barcode.svg",
  },
  {
    title: "CU 1만원 상품권",
    category: "상품권",
    price: 0.015,
    currency: "ETH",
    seller: "dan.eth",
    expiry: "2025-12-31",
    imageUrl: "/images/barcode.svg",
  },
  {
    title: "맥도날드 불고기버거 세트",
    category: "식품",
    price: 0.013,
    currency: "BTC",
    seller: "eve.eth",
    expiry: "2025-12-31",
    imageUrl: "/images/barcode.svg",
  },
  {
    title: "유니클로 2만원 쿠폰",
    category: "패션",
    price: 0.025,
    currency: "ETH",
    seller: "frank.eth",
    expiry: "2025-12-31",
    imageUrl: "/images/barcode.svg",
  },
];

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState("전체");

  const filtered = selectedCategory === "전체"
    ? dummyData
    : dummyData.filter(item => item.category === selectedCategory);

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">기프티콘 중고거래</h1>
        <Link
          href="/sell"
          className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition"
        >
          상품 등록
        </Link>
      </div>

      {/* 카테고리 필터 */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1 rounded-full border text-sm ${
              selectedCategory === cat
                ? "bg-orange-500 text-white"
                : "bg-white text-gray-700"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 상품 목록 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {filtered.map((item, idx) => (
          <GifticonCard key={idx} {...item} />
        ))}
      </div>
    </Layout>
  );
}