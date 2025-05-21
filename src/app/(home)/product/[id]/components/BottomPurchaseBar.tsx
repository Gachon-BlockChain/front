"use client";

import React, { useState } from "react";
import { formatPrice } from "@/lib/utils";

interface BottomPurchaseBarProps {
  price: number;
}

export default function BottomPurchaseBar({ price }: BottomPurchaseBarProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handlePurchase = () => {
    setIsLoading(true);

    // 구매 처리 시뮬레이션 (실제로는 API 호출 등이 들어갈 것)
    setTimeout(() => {
      setIsLoading(false);
      alert("구매 기능은 아직 준비 중입니다.");
    }, 1000);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50">
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <span className="text-sm text-gray-500">상품 가격</span>
          <span className="text-lg font-bold">{formatPrice(price)}</span>
        </div>
        <button
          className={`px-6 py-3 ${
            isLoading ? "bg-blue-400" : "bg-blue-500"
          } text-white font-semibold rounded-lg transition-all transform active:scale-95 ${
            isLoading ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-600"
          }`}
          onClick={handlePurchase}
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              처리 중...
            </span>
          ) : (
            "구매하기"
          )}
        </button>
      </div>
    </div>
  );
}
