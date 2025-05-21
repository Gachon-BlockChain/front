"use client";

import React, { useMemo } from "react";
import TransactionProductCard from "./TransactionProductCard";
import { products } from "@/constant/constData";
import { useSearchParams } from "next/navigation";

// 더미 거래 상태 데이터 (실제로는 서버에서 가져옴)
const transactionData = products.map(
  (product, index) =>
    ({
      ...product,
      status: index % 3 === 0 ? "완료" : index % 3 === 1 ? "진행중" : "취소",
      transactionDate: `2024-${
        (index % 12) + 1 < 10 ? "0" + ((index % 12) + 1) : (index % 12) + 1
      }-${(index % 28) + 1 < 10 ? "0" + ((index % 28) + 1) : (index % 28) + 1}`,
    } as const)
);

export default function TransactionProductList() {
  const searchParams = useSearchParams();
  const typeParam = searchParams.get("type") || "purchase";
  const type = typeParam === "sale" ? "sale" : "purchase";

  // 판매/구매 내역에 따라 필터링 (실제로는 API 호출로 분리될 것)
  const filteredProducts = useMemo(() => {
    // 더미 데이터에서는 임의로 짝수/홀수 인덱스로 구분
    if (type === "purchase") {
      return transactionData.filter((_, index) => index % 2 === 0);
    } else {
      return transactionData.filter((_, index) => index % 2 === 1);
    }
  }, [type]);

  if (filteredProducts.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        {type === "purchase"
          ? "구매 내역이 없습니다."
          : "판매 내역이 없습니다."}
      </div>
    );
  }

  return (
    <div className="p-4 flex flex-col gap-6">
      {filteredProducts.map((product, index) => (
        <React.Fragment key={product.id}>
          {index > 0 && <div className="border-t border-gray-100 w-full"></div>}
          <TransactionProductCard product={product} type={type} />
        </React.Fragment>
      ))}
    </div>
  );
}
