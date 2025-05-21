import React from "react";
import { formatPrice } from "@/lib/utils";

interface PriceNoticeProps {
  price: string;
}

export default function PriceNotice({ price }: PriceNoticeProps) {
  const calculateFee = () => {
    if (!price || isNaN(Number(price))) return "0원";
    const numPrice = parseInt(price);
    const fee = numPrice * 0.1; // 10% 수수료
    return formatPrice(fee);
  };

  return (
    <div className="w-full p-4 bg-blue-50 rounded-md">
      <p className="text-sm text-blue-800">
        상품이 판매되기 전까지 물건 가격의 110%인{" "}
        {price ? formatPrice(parseInt(price) * 1.1) : "0원"}가 지갑에서
        차감됩니다.
      </p>
      <div className="mt-2 flex justify-between text-sm">
        <span>판매 수수료 (10%)</span>
        <span>{calculateFee()}</span>
      </div>
    </div>
  );
}
