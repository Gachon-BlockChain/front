import React from "react";
import { GifticonItem } from "@/types"; // ✅ 실제 NFT 타입
import { formatPrice } from "@/lib/utils";

interface ProductInfoProps {
  product: GifticonItem;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  return (
    <div className="p-4 border-b border-gray-100">
      {/* 판매자 정보 */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden"></div>
        <div className="flex-1">
          <h3 className="font-bold text-sm">{product.originalOwner.slice(0,6)}...{product.originalOwner.slice(-3)}</h3>
          <p className="text-xs text-gray-500">판매상품 8 · 거래만족도 95%</p>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-1">
            <span className="text-[#4AC1DB] font-bold text-sm">{`86°C`}</span>
            <div className="w-[46px] h-1 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-[#4AC1DB] rounded-full" style={{ width: "40px" }}></div>
            </div>
          </div>
          <span className="text-gray-500 text-xs">매너온도</span>
        </div>
      </div>

      {/* 상품 정보 */}
      <div className="border-t border-gray-100 pt-4">
        <h2 className="text-lg font-bold mb-1">{product.productName}</h2>
        <div className="flex gap-1 text-xs text-gray-500 mb-3">
          <span>{product.categoryName}</span>
          <span>·</span>
          <span>{formatPrice(product.price)}</span>
          <span>·</span>
          <span>
            유효기간{" "}
            {new Date(product.burnTimestamp * 1000).toLocaleDateString("ko-KR")}
          </span>
        </div>

        <div className="mt-4 text-sm leading-6 text-gray-700">
          <p>{product.description || "설명이 등록되지 않았습니다."}</p>
        </div>
      </div>
    </div>
  );
}
