"use client";

import React, { Suspense } from "react";
import StatusBar from "@/app/(home)/components/StatusBar";
import BottomNavigation from "@/app/(home)/components/BottomNavigation";
import TransactionHeader from "./components/TransactionHeader";
import TransactionProductList from "./components/TransactionProductList";

function TransactionContainer() {
  return (
    <>
      <TransactionHeader />
      <div className="flex-1 flex flex-col pb-20">
        <TransactionProductList />
      </div>
    </>
  );
}

export default function TransactionPage() {
  return (
    <main className="flex flex-col min-h-screen">
      <StatusBar />

      <Suspense fallback={<div className="p-4 text-center">로딩 중...</div>}>
        <TransactionContainer />
      </Suspense>

      <BottomNavigation />
    </main>
  );
}
