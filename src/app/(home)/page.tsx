'use client'

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import ProductList from "./components/ProductList";
import SellButton from "./components/SellButton";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const checkMetaMaskConnection = async () => {
      const ethereum = (window as any).ethereum;

      if (!ethereum) {
        router.push("/login"); // 메타마스크 없음
        return;
      }

      try {
        const accounts = await ethereum.request({ method: "eth_accounts" });
        if (!accounts || accounts.length === 0) {
          router.push("/login"); // 계정이 연결되지 않은 경우
        }
      } catch (err) {
        console.error("MetaMask 계정 확인 실패:", err);
        router.push("/login"); // 예외 발생 시 로그인 페이지로
      }
    };

    checkMetaMaskConnection();
  }, [router]);

  return (
    <main className="flex flex-col min-h-screen">
      <section className="flex-grow pb-16">
        <ProductList />
      </section>
      <div className="fixed bottom-24 right-5">
        <SellButton />
      </div>
    </main>
  );
}
