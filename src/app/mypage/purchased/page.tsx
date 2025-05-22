"use client";

import Layout from "@/components/Layout";
import { useState } from "react";

const purchasedData = [
  {
    id: 1,
    title: "베스킨라빈스 파인트",
    category: "식품",
    price: 0.012,
    currency: "ETH",
    barcode: "4455667788",
    expiry: "2025-11-15",
    purchasedAt: "2025-05-15T16:20:00",
    sellerWallet: "0xDEADBEEF1234567890ABCDEF1234567890FEED01",
    sellerName: "icecream.eth",
  },
  {
    id: 2,
    title: "이디야 아메리카노",
    category: "카페",
    price: 0.009,
    currency: "ETH",
    barcode: "9988776655",
    expiry: "2025-12-05",
    purchasedAt: "2025-05-16T10:10:00",
    sellerWallet: "0xBADA55CAFEBABE1234567890ABCDEF9876543210",
    sellerName: "ediya.eth",
  },
];

export default function PurchasedPage() {
  const [selected, setSelected] = useState<number | null>(null);

  const selectedItem = purchasedData.find((item) => item.id === selected);

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-6">내 구매 내역</h1>

      <table className="w-full text-sm border">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-2 border-b">바코드 번호</th>
            <th className="p-2 border-b">구매일자</th>
            <th className="p-2 border-b">금액</th>
            <th className="p-2 border-b">상세내역</th>
            <th className="p-2 border-b text-center">신고</th>
          </tr>
        </thead>
        <tbody>
          {purchasedData.map((item) => (
            <tr key={item.id} className="border-b">
              <td className="p-2">{item.barcode}</td>
              <td className="p-2">{item.purchasedAt.split("T")[0].replace(/-/g, ".")}</td>
              <td className="p-2">
                {item.price} {item.currency}
              </td>
              <td className="p-2">
                <button
                  onClick={() => setSelected(item.id)}
                  className="text-blue-600 hover:underline"
                >
                  상세내역
                </button>
              </td>
              <td className="p-2 text-center">
                <button className="text-red-500 hover:underline">
                  신고🚨
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedItem && (
        <div className="mt-6 p-4 border rounded bg-gray-50">
          <h2 className="text-lg font-semibold mb-2">상세 정보</h2>
          <p><strong>상품명:</strong> {selectedItem.title}</p>
          <p><strong>카테고리:</strong> {selectedItem.category}</p>
          <p><strong>상품 금액:</strong> {selectedItem.price} {selectedItem.currency}</p>
          <p><strong>기프티콘 유효기간:</strong> {selectedItem.expiry}</p>
          <p><strong>구매일시:</strong> {selectedItem.purchasedAt.replace("T", " ")}</p>
          <p><strong>판매자명:</strong> {selectedItem.sellerName}</p>
          <p><strong>판매자 지갑주소:</strong> {selectedItem.sellerWallet}</p>
          <div className="flex justify-center mt-4">
            <button
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              기프티콘 교환
            </button>
          </div>
          <div className="flex justify-center mt-4">
            <button
              onClick={() => setSelected(null)}
              className="px-4 py-1 bg-gray-300 text-sm rounded hover:bg-gray-400"
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
}
