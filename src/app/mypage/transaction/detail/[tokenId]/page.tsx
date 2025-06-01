"use client";

import React, { Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import StatusBar from "@/app/(home)/components/StatusBar";
import BottomNavigation from "@/app/(home)/components/BottomNavigation";
import DetailHeader from "./components/DetailHeader";
import TransactionDetail from "./components/TransactionDetail";

function TransactionDetailContent() {
  const params = useParams();
  const searchParams = useSearchParams();

  const id = params.tokenId as string; // ✅ 폴더명이 [tokenId]일 경우!
  const typeParam = searchParams.get("type");
  const type = typeParam === "sale" ? "sale" : "own";

  if (!id) {
    return (
      <div className="p-6 text-center text-red-500">
        잘못된 접근입니다. 유효한 NFT ID가 없습니다.
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col pb-20">
      <TransactionDetail id={id} type={type} />
    </div>
  );
}

export default function TransactionDetailPage() {
  return (
    <main className="flex flex-col min-h-screen bg-white">
      <StatusBar />

      <Suspense fallback={<div className="p-4 text-center">로딩 중...</div>}>
        <DetailHeader />
        <TransactionDetailContent />
      </Suspense>

      <BottomNavigation />
    </main>
  );
}
