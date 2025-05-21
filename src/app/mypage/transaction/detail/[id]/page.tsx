"use client";

import React from "react";
import { useParams, useSearchParams } from "next/navigation";
import StatusBar from "@/app/(home)/components/StatusBar";
import BottomNavigation from "@/app/(home)/components/BottomNavigation";
import DetailHeader from "./components/DetailHeader";
import TransactionDetail from "./components/TransactionDetail";

export default function TransactionDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params.id as string;
  const type = searchParams.get("type") || "purchase";

  return (
    <main className="flex flex-col min-h-screen">
      <StatusBar />
      <DetailHeader />

      <div className="flex-1 flex flex-col pb-20">
        <TransactionDetail
          id={id}
          type={type === "sale" ? "sale" : "purchase"}
        />
      </div>

      <BottomNavigation />
    </main>
  );
}
