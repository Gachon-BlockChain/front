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
  const id = params.id as string;
  const typeParam = searchParams.get("type") || "purchase";
  const type = typeParam === "sale" ? "sale" : "purchase";

  return (
    <div className="flex-1 flex flex-col pb-20">
      <TransactionDetail id={id} type={type} />
    </div>
  );
}

export default function TransactionDetailPage() {
  return (
    <main className="flex flex-col min-h-screen">
      <StatusBar />

      <Suspense fallback={<div className="p-4 text-center">로딩 중...</div>}>
        <DetailHeader />
        <TransactionDetailContent />
      </Suspense>

      <BottomNavigation />
    </main>
  );
}
