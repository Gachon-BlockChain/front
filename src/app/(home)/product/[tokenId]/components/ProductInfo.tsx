import React from "react";
import { GifticonItem } from "@/types"; // ✅ 실제 NFT 타입
import { formatPrice } from "@/lib/utils";
import { ethers } from "ethers";

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
          <span className="text-sm font-semibold text-gray-800">
            담보금: {formatPrice(parseFloat(ethers.utils.formatEther(product.depositAmount)))}
          </span>
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
