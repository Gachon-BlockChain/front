import React from "react";
import { Product } from "@/app/(home)/product/[id]/components/types";
import { formatPrice } from "@/lib/utils";

interface ProductInfoProps {
  product: Product;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  return (
    <div className="p-4 border-b border-gray-100">
      {/* 판매자 정보 */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden"></div>
        <div className="flex-1">
          <h3 className="font-bold text-sm">{product.seller}</h3>
          <p className="text-xs text-gray-500">판매상품 8 · 거래만족도 95%</p>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-1">
            <span className="text-[#4AC1DB] font-bold text-sm">{`${product.creditScore}°C`}</span>
            <div className="w-[46px] h-1 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#4AC1DB] rounded-full"
                style={{
                  width: `${(Number(product.creditScore) / 100) * 46}px`,
                }}
              ></div>
            </div>
          </div>
          <span className="text-gray-500 text-xs">매너온도</span>
        </div>
      </div>

      {/* 상품 정보 */}
      <div className="border-t border-gray-100 pt-4">
        <h2 className="text-lg font-bold mb-1">{product.title}</h2>
        <div className="flex gap-1 text-xs text-gray-500 mb-3">
          <span>{product.category}</span>
          <span>·</span>
          <span>{formatPrice(product.price)} POL</span>
          <span>·</span>
          <span>유효기간 2024.12.31</span>
          <span>·</span>
          <span>{product.timeAgo}</span>
        </div>

        <div className="mt-4 text-sm">
          <p className="leading-6 text-gray-700">
            안녕하세요! 사용하지 않는 기프티콘이라 판매합니다. 유통기한은
            충분합니다. 구매 후 바로 교환 가능합니다. 궁금한 점 있으시면
            문의주세요 :)
          </p>
        </div>
      </div>
    </div>
  );
}
