"use client";

import Layout from "@/components/Layout";
import { useState } from "react";

const soldData = [
  {
    id: 1,
    title: "스타벅스 아메리카노",
    category: "카페",
    price: 0.01,
    currency: "ETH",
    barcode: "1234567890",
    expiry: "2025-12-31",
    soldAt: "2025-05-17T14:00:00",
    buyerWallet: "0xA1B2C3D4E5F678901234567890ABCDEF1234B3F",
    buyerName: "alice.eth",
  },
  {
    id: 2,
    title: "CU 상품권",
    category: "상품권",
    price: 0.015,
    currency: "ETH",
    barcode: "9876543210",
    expiry: "2025-11-30",
    soldAt: "2025-05-16T09:30:00",
    buyerWallet: "0xC0FFEE1234567890ABCDEF1234567890DEADBEEF",
    buyerName: "bob.eth",
  },
];

export default function SoldPage() {
  const [selected, setSelected] = useState<number | null>(null);

  const selectedItem = soldData.find((item) => item.id === selected);

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-6">내 판매 내역</h1>

      <table className="w-full text-sm border">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-2 border-b">바코드</th>
            <th className="p-2 border-b">판매일자</th>
            <th className="p-2 border-b">금액</th>
            <th className="p-2 border-b">상세내역</th>
          </tr>
        </thead>
        <tbody>
          {soldData.map((item) => (
            <tr key={item.id} className="border-b">
              <td className="p-2">{item.barcode}</td>
              <td className="p-2">{item.soldAt.split("T")[0].replace(/-/g, ".")}</td>
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
            </tr>
          ))}
        </tbody>
      </table>

      {selectedItem && (
        <div className="mt-6 p-4 border rounded bg-gray-50">
          <h2 className="text-lg font-semibold mb-2">상세 정보</h2>
          <p><strong>상품명 :</strong> {selectedItem.title}</p>
          <p><strong>카테고리 :</strong> {selectedItem.category}</p>
          <p><strong>상품 금액 :</strong> {selectedItem.price} {selectedItem.currency}</p>
          <p><strong>기프티콘 유효기간 :</strong> {selectedItem.expiry}</p>
          <p><strong>판매일시 :</strong> {selectedItem.soldAt.replace("T", " ")}</p>
          <p><strong>구매자명 :</strong> {selectedItem.buyerName}</p>
          <p><strong>구매자 지갑주소 :</strong> {selectedItem.buyerWallet}</p>
          <button
            onClick={() => setSelected(null)}
            className="mt-3 px-4 py-1 bg-gray-300 text-sm rounded hover:bg-gray-400"
          >
            닫기
          </button>
        </div>
      )}
    </Layout>
  );
}
