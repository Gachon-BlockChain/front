"use client";

import React from "react";
import Header from "./components/Header";
import SellForm from "./components/SellForm";

export default function SellPage() {
  return (
    <main className="flex flex-col min-h-screen pb-20">
      <Header />
      <div className="p-4">
        <SellForm />
      </div>
    </main>
  );
}
