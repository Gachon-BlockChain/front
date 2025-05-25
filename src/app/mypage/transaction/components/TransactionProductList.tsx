"use client";

import React, { useEffect, useState } from "react";
import TransactionProductCard from "./TransactionProductCard";
import { useSearchParams } from "next/navigation";
import useItems from "@/hooks/useItems";
import { GifticonNFT } from "@/types";
import LoadingOverlay from "@/components/ui/loadingSpinner";

export default function TransactionProductList() {
  const [myNFTs, setMyNFTs] = useState<GifticonNFT[]>([]);
  const searchParams = useSearchParams();
  const typeParam = searchParams.get("type") || "purchase";
  const type = typeParam === "sale" ? "sale" : "purchase";

  const { fetchMyNFTs, isLoading } = useItems();

  useEffect(() => {
    const fetch = async () => {
      const result = await fetchMyNFTs();
      setMyNFTs(result);
    };
    fetch();
  }, []);

  const filteredNFTs =
    type === "sale"
      ? myNFTs.filter((nft) => nft.status === "Listed")
      : myNFTs.filter((nft) => nft.status !== "Listed");

  if (isLoading) return <LoadingOverlay />;

  if (filteredNFTs.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        {type === "purchase"
          ? "구매 내역이 없습니다."
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
