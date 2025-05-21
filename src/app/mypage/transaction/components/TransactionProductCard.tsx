import React from "react";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

interface Product {
  id: number;
  title: string;
  price: number;
  image: string[];
  seller: string;
  creditScore: string;
  timeAgo: string;
  status?: "완료" | "진행중" | "취소";
  transactionDate?: string;
}

interface TransactionProductCardProps {
  product: Product;
  type: "purchase" | "sale";
}

export default function TransactionProductCard({
  product,
  type,
}: TransactionProductCardProps) {
  return (
    <div className="flex flex-col gap-2">
      <Link href={`/product/${product.id}`} className="flex gap-4">
        <div className="flex-shrink-0 relative w-[110px] h-[110px] border border-black rounded overflow-hidden">
          <Image
            src={product.image[0]}
            alt={product.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 110px, 110px"
            quality={80}
          />
          {product.status && (
            <div
              className={`absolute top-0 left-0 px-2 py-1 text-xs text-white ${
                product.status === "완료"
                  ? "bg-green-500"
                  : product.status === "진행중"
                  ? "bg-blue-500"
                  : "bg-red-500"
              }`}
            >
              {product.status}
            </div>
          )}
        </div>

        <div className="flex flex-col justify-between py-1 flex-grow">
          <div>
            <h3 className="text-base font-normal line-clamp-2">
              {product.title}
            </h3>
            <div className="flex gap-1 text-xs text-gray-500 mt-1">
              <span>{product.seller}</span>
              <span>·</span>
              <span>신용 {product.creditScore}</span>
              <span>·</span>
              <span>{product.timeAgo}</span>
            </div>
            {product.transactionDate && (
              <div className="text-xs text-gray-500 mt-1">
                거래일: {product.transactionDate}
              </div>
            )}
          </div>
          <p className="text-[#366CFF] font-bold">
            {formatPrice(product.price)}
          </p>
        </div>
      </Link>

      <Link
        href={`/mypage/transaction/detail/${product.id}?type=${type}`}
        className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-md text-sm"
      >
        <span>상세 내역 보기</span>
        <ChevronRight size={16} className="text-gray-400" />
      </Link>
    </div>
  );
}
