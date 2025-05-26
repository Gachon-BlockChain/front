'use client';

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import useItems from "@/hooks/useItems";
import ProductHeader from "@/app/(home)/product/[tokenId]/components/ProductHeader";
import ProductImage from "@/app/(home)/product/[tokenId]/components/ProductImage";
import ProductInfo from "@/app/(home)/product/[tokenId]/components/ProductInfo";
import RelatedProducts from "@/app/(home)/product/[tokenId]/components/RelatedProducts";
import RecommendedProducts from "@/app/(home)/product/[tokenId]/components/RecommendedProducts";
import BottomPurchaseBar from "@/app/(home)/product/[tokenId]/components/BottomPurchaseBar";
import LoadingOverlay from "@/components/ui/loadingSpinner";
import { GifticonNFT } from "@/types";

export default function ProductPage() {
  const { fetchMyNFTs } = useItems();
  const params = useParams();
  const tokenId = params.tokenId?.toString();

  const [nft, setNft] = useState<GifticonNFT | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [nfts, setNfts] = useState<GifticonNFT[]>([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const all = await fetchMyNFTs();
        const listed = all.filter((nft) => nft.status === "Listed");
        setNfts(listed);

        const matched = listed.find((nft) => nft.tokenId.toString() === tokenId);
        setNft(matched ?? null);
      } catch (err) {
        console.error("🚨 NFT fetch error:", err);
        setNft(null);
      } finally {
        setIsLoading(false);
      }
    };
    if (tokenId) fetch();
  }, [tokenId]);

  if (isLoading) return <LoadingOverlay />;

  if (!nft) {
    return (
      <div className="p-8 text-center text-gray-500">
        해당 NFT를 찾을 수 없습니다.
      </div>
    );
  }

  // 예시: 동일 판매자의 다른 상품
  const sellerOtherProducts = nfts
    .filter((p) => p.originalOwner === nft.originalOwner && p.tokenId !== nft.tokenId)
    .slice(0, 2);

  // 예시: 같은 카테고리 추천 상품
  const recommendedProducts = nfts
    .filter((p) => p.categoryName === nft.categoryName && p.tokenId !== nft.tokenId)
    .slice(0, 6);

  return (
    <main className="flex flex-col min-h-screen pb-16">
      <ProductHeader />
      <ProductImage image={Array.isArray(nft.image) ? nft.image : [nft.image]} />
      <ProductInfo product={nft} />

      {sellerOtherProducts.length > 0 && (
        <RelatedProducts
          sellerName={nft.originalOwner}
          products={sellerOtherProducts}
        />
      )}

      {recommendedProducts.length > 0 && (
        <RecommendedProducts products={recommendedProducts} />
      )}

      <BottomPurchaseBar price={nft.depositAmount} />
    </main>
  );
}