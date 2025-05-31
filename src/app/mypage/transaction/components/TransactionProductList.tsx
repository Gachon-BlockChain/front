"use client";

import React, { useEffect, useState } from "react";
import TransactionProductCard from "./TransactionProductCard";
import { useSearchParams } from "next/navigation";
import useItems from "@/hooks/useItems";
import { GifticonNFT } from "@/types";
import LoadingOverlay from "@/components/ui/loadingSpinner";
import { ethers } from "ethers";

export default function TransactionProductList() {
  const [saleNFTs, setSaleNFTs] = useState<GifticonNFT[]>([]);
  const [purchaseNFTs, setPurchaseNFTs] = useState<GifticonNFT[]>([]);
  const searchParams = useSearchParams();
  const typeParam = searchParams.get("type") || "purchase";
  const type = typeParam === "sale" ? "sale" : "purchase";

  const { fetchMyNFTs, isLoading } = useItems();

  useEffect(() => {
  const fetch = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum as any);
      const signer = await provider.getSigner();
      const currentAddress = (await signer.getAddress()).toLowerCase();

      const result = await fetchMyNFTs();

      // 판매 내역: 내가 민팅한 것 중 Listed 상태
      const sales = result.filter(
        (nft) =>
          nft.originalOwner?.toLowerCase() === currentAddress &&
          nft.status === "Listed"
      );

      // 구매 내역: 내가 민팅하지 않았지만 소유한 것 (tokenId 존재한다고 가정)
      const purchases = result.filter(
        (nft) =>
          nft.originalOwner?.toLowerCase() !== currentAddress &&
          nft.tokenId !== undefined
      );

      setSaleNFTs(sales);
      setPurchaseNFTs(purchases);
    } catch (err) {
      console.error("🚨 내 NFT 조회 중 오류:", err);
    }
  };

  fetch();
}, []);

  const filteredNFTs = type === "sale" ? saleNFTs : purchaseNFTs;

  if (isLoading) return <LoadingOverlay />;

  if (filteredNFTs.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        {type === "purchase"
          ? "보유 중인 NFT가 없습니다."
          : "판매 내역이 없습니다."}
      </div>
    );
  }

  return (
    <div className="p-4 flex flex-col gap-6">
      {filteredNFTs.map((nft, index) => (
        <React.Fragment key={nft.tokenId.toString()}>
          {index > 0 && <div className="border-t border-gray-100 w-full"></div>}
          <TransactionProductCard nft={nft} type={type} />
        </React.Fragment>
      ))}
    </div>
  );
}
