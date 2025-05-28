"use client";

import React, { useEffect, useState } from "react";
import useItems from "@/hooks/useItems";
import { GifticonNFT, GifticonItem } from "@/types";
import LoadingOverlay from "@/components/ui/loadingSpinner";
import { Button } from "@/components/ui/button";


interface Props {
  id: string;
  type: "purchase" | "sale";
}

export default function TransactionDetail({ id, type }: Props) {
  const { fetchMyNFTs, fetchItems } = useItems();
  const [nft, setNft] = useState<GifticonNFT | null>(null);
  const [item, setItem] = useState<GifticonItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [myNFTs, items] = await Promise.all([
          fetchMyNFTs(),
          fetchItems({ categoryName: "전체" }),
        ]);

        const matchedNFT = myNFTs.find(
          (item) => item.tokenId?.toString() === id
        );
        setNft(matchedNFT ?? null);

        const matchedItem = items.find(
          (item: GifticonItem) => item.tokenId?.toString() === id
        );
        setItem(matchedItem ?? null);
        console.log("전체 상품 tokenId 목록:", items.map(i => String(i.tokenId)));
      } catch (error) {
        console.error("🚨 NFT 상세 조회 오류:", error);
        setNft(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetch();
  }, [id]);

  if (isLoading) return <LoadingOverlay />;
  if (!nft) {
    return (
      <div className="p-6 text-center text-gray-500">
        해당 NFT 상세 정보를 불러올 수 없습니다.
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center text-center">
      {/* 이미지 영역 */}
      {nft.image && (
        <div className="w-full bg-gray-100 p-4 flex justify-center">
          <img
            src={Array.isArray(nft.image) ? nft.image[0] : nft.image}
            alt="상품 이미지"
            className="rounded-xl max-w-md w-full object-cover border"
          />
        </div>
      )}

      {/* 정보 영역 */}
      <div className="p-6 space-y-3">
        <h1 className="text-xl font-bold">{nft.productName}</h1>
        <p className="text-sm text-gray-500">카테고리: {nft.categoryName}</p>
        <p className="text-sm text-gray-500">토큰 ID: {nft.tokenId.toString()}</p>
        <p className="text-sm text-gray-500">상태: {nft.status}</p>
        <p className="text-sm text-gray-500">
          유형: {type === "purchase" ? "구매한 NFT" : "등록한 NFT"}
        </p>
      </div>

      {type === "purchase" && (
        <div className="left-0 right-0 flex justify-center">
          <Button
            className="bg-blue-500 hover:bg-blue-600"
            onClick={() => {
              console.log("🔓 NFT 복호화 요청");
            }}
          >
            NFT 복호화
          </Button>
        </div>
      )}
    </div>
  );
}
