"use client";

import { notFound } from "next/navigation";
import Layout from "@/components/Layout";

const dummyData = [
  {
    id: "1",
    title: "스타벅스 아메리카노",
    category: "카페",
    price: 0.01,
    currency: "ETH",
    seller: "alice.eth",
    expiry: "2025-12-31",
    imageUrl: "/images/barcode.svg",
  },
  {
    id: "2",
    title: "GS25 모바일 상품권",
    category: "편의점",
    price: 0.02,
    currency: "ETH",
    seller: "bob.eth",
    expiry: "2025-07-13",
    imageUrl: "/images/barcode.svg",
  },
  {
    id: "3",
    title: "이케아 테이블 쿠폰",
    category: "가구",
    price: 0.03,
    currency: "BTC",
    seller: "carol.eth",
    expiry: "2025-11-20",
    imageUrl: "/images/barcode.svg",
  },
  {
    id: "4",
    title: "CU 1만원 상품권",
    category: "상품권",
    price: 0.015,
    currency: "ETH",
    seller: "dan.eth",
    expiry: "2025-06-30",
    imageUrl: "/images/barcode.svg",
  },
  {
    id: "5",
    title: "맥도날드 불고기버거 세트",
    category: "식품",
    price: 0.013,
    currency: "BTC",
    seller: "eve.eth",
    expiry: "2025-08-31",
    imageUrl: "/images/barcode.svg",
  },
  {
    id: "6",
    title: "유니클로 2만원 쿠폰",
    category: "패션",
    price: 0.025,
    currency: "ETH",
    seller: "frank.eth",
    expiry: "2025-07-31",
    imageUrl: "/images/barcode.svg",
  },
];

type Props = {
  params: { id: string };
};

export default async function GifticonDetailPage({ params }: Props) {
  const id = params.id;

  // 예: fetch로 데이터 가져오는 경우도 대비
  const gifticon = dummyData.find((item) => item.id === id);

  if (!gifticon) return notFound();

  return (
    <Layout>
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">{gifticon.title}</h1>
      <img
        src={gifticon.imageUrl}
        alt="기프티콘 바코드"
        className="w-full h-40 object-contain mb-4"
      />
      <p className="text-sm text-gray-700 mb-1">카테고리: {gifticon.category}</p>
      <p className="text-sm text-gray-700 mb-1">판매자: {gifticon.seller}</p>
      <p className="text-sm text-gray-700 mb-1">유효기간: {gifticon.expiry.replace(/-/g, ".")}</p>
      <p className="text-lg font-semibold mt-3 mb-6">
        {gifticon.price} {gifticon.currency}
      </p>

      <a
        href={`/purchase/${gifticon.id}`}
        className="block text-center bg-orange-500 text-white py-2 rounded hover:bg-orange-600"
      >
        구매하기
      </a>
    </div>
    </Layout>
  );
}
