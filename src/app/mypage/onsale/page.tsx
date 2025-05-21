"use client";

import Layout from "@/components/Layout";
import { useState } from "react";

const onSaleData = [
  {
    id: 1,
    title: "배스킨라빈스 싱글레귤러",
    category: "식품",
    price: 0.011,
    currency: "ETH",
    barcode: "1122334455",
    expiry: "2025-10-20",
    listedAt: "2025-05-18T11:00:00",
  },
  {
    id: 2,
    title: "GS25 모바일 상품권",
    category: "편의점",
    price: 0.018,
    currency: "BTC",
    barcode: "6677889900",
    expiry: "2025-11-30",
    listedAt: "2025-05-17T14:30:00",
  },
];

export default function OnSalePage() {
  const [cancelled, setCancelled] = useState<number | null>(null);

  const handleCancel = (id: number) => {
    setCancelled(id);
    alert("판매가 취소되었습니다.");
  };

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-6">현재 판매 중인 상품</h1>

      <table className="w-full text-sm border">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-2 border-b">바코드</th>
            <th className="p-2 border-b">등록일자</th>
            <th className="p-2 border-b">금액</th>
            <th className="p-2 border-b">판매취소</th>
          </tr>
        </thead>
        <tbody>
          {onSaleData.map((item) => (
            <tr key={item.id} className="border-b">
              <td className="p-2">{item.barcode}</td>
              <td className="p-2">{item.listedAt.split("T")[0].replace(/-/g, ".")}</td>
              <td className="p-2">
                {item.price} {item.currency}
              </td>
              <td className="p-2">
                <button
                  onClick={() => handleCancel(item.id)}
                  className="text-red-600 hover:underline"
                >
                  판매취소
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {cancelled !== null && (
        <div className="mt-6 p-4 border rounded bg-red-50 text-sm text-red-600">
          ID {cancelled}번 상품의 판매가 취소되었습니다.
        </div>
      )}
    </Layout>
  );
}
