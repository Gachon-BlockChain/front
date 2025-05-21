"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import StatusBar from "@/app/(home)/components/StatusBar";
import BottomNavigation from "@/app/(home)/components/BottomNavigation";
import TransactionHeader from "./components/TransactionHeader";
import TransactionProductList from "./components/TransactionProductList";

export default function TransactionPage() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type") || "purchase";

  return (
    <main className="flex flex-col min-h-screen">
      <StatusBar />
      <TransactionHeader />

      <div className="flex-1 flex flex-col pb-20">
        <TransactionProductList type={type === "sale" ? "sale" : "purchase"} />
      </div>

      <BottomNavigation />
    </main>
  );
}
