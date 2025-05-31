'use client';

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import ProductHeader from "@/app/(home)/product/[tokenId]/components/ProductHeader";
import ProductImage from "@/app/(home)/product/[tokenId]/components/ProductImage";
import ProductInfo from "@/app/(home)/product/[tokenId]/components/ProductInfo";
import BottomPurchaseBar from "@/app/(home)/product/[tokenId]/components/BottomPurchaseBar";
import LoadingOverlay from "@/components/ui/loadingSpinner";

import { GifticonItem } from "@/types";
import useItems from "@/hooks/useItems";

export default function ProductPage() { //props로 해당되는 nft 페이지만 보여주기기
  const params = useParams();
  const { fetchItems } = useItems();

  const tokenIdStr = params.tokenId?.toString();
  const tokenIdBigInt = tokenIdStr ? BigInt(tokenIdStr) : null;

  const [nft, setNft] = useState<GifticonItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadItem = async () => {
      try {
        const allItems = await fetchItems({ categoryName: '전체' }); // 모든 판매중인 아이템
        const matchedItem = allItems.find(
          (item) => item.tokenId === tokenIdBigInt
        );
        setNft(matchedItem ?? null);
      } catch (err) {
        console.error("🚨 NFT fetch error:", err);
        setNft(null);
      } finally {
        setIsLoading(false);
      }
    };
    if (tokenIdBigInt) loadItem();
  }, [tokenIdBigInt]);

  if (isLoading) return <LoadingOverlay />;

  if (!nft) {
    return (
      <div className="p-8 text-center text-gray-500">
        해당 NFT를 찾을 수 없습니다.
      </div>
    );
  }

  return (
    <main className="flex flex-col min-h-screen pb-16">
      <ProductHeader />
      <ProductImage image={Array.isArray(nft.image) ? nft.image : [nft.image]} />
      <ProductInfo product={nft} />

      <BottomPurchaseBar price={nft.price} tokenId={nft.tokenId} />
    </main>
  );
}