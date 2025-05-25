import React from "react";
import Image from "next/image";
import Link from "next/link";
import { GifticonNFT } from "@/types";
import { formatPrice } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

interface TransactionProductCardProps {
  nft: GifticonNFT;
  type: "purchase" | "sale";
}

export default function TransactionProductCard({
  nft,
  type,
}: TransactionProductCardProps) {
  const statusMap = {
    Listed: "진행중",
    Redeemed: "완료",
    Penalized: "취소",
  } as const;

  return (
    <div className="flex flex-col gap-2">
      <Link href={`/product/${nft.tokenId.toString()}`} className="flex gap-4">
        <div className="flex-shrink-0 relative w-[110px] h-[110px] border border-black rounded overflow-hidden">
          <Image
            src={nft.image[0]}
            alt={nft.productName}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 110px, 110px"
            quality={80}
          />
          <div
            className={`absolute top-0 left-0 px-2 py-1 text-xs text-white ${
              nft.status === "Listed"
                ? "bg-blue-500"
                : nft.status === "Redeemed"
                ? "bg-green-500"
                : "bg-red-500"
            }`}
          >
            {statusMap[nft.status]}
          </div>
        </div>        

        <div className="flex flex-col justify-between py-1 flex-grow">
          <div>
            <h3 className="text-base font-normal line-clamp-2">
              {nft.productName}
            </h3>
            <div className="flex gap-1 text-xs text-gray-500 mt-1">
              <span>Token #{nft.tokenId.toString()}</span>
              <span>·</span>
              <span>상태: {statusMap[nft.status]}</span>
            </div>
            {nft.burnTimestamp > 0 && (
              <div className="text-xs text-gray-500 mt-1">
                만료일:{" "}
                {new Date(nft.burnTimestamp * 1000).toLocaleDateString()}
              </div>
            )}
          </div>
          <p className="text-[#366CFF] font-bold">
            {formatPrice(nft.depositAmount)}
          </p>
        </div>
      </Link>

      <Link
        href={`/mypage/transaction/detail/${nft.tokenId.toString()}?type=${type}`}
        className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-md text-sm"
      >
        <span>상세 내역 보기</span>
        <ChevronRight size={16} className="text-gray-400" />
      </Link>
    </div>
  );
}
