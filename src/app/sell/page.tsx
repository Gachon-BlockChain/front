"use client";

import Layout from "@/components/Layout";
import { useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/20/solid"; // 아이콘 사용을 위해 설치 필요

const categories = ["식품", "상품권", "가구", "카페", "편의점", "패션", "기타"];
const ETH_RATE = 4000000; // 1 ETH = 4,000,000원
const BTC_RATE = 95000000; // 1 BTC = 95,000,000원

export default function SellPage() {
  const [barcode, setBarcode] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("ETH");
  const [expiry, setExpiry] = useState("");

  const parsedAmount = parseFloat(amount);
  const chargeCrypto = isNaN(parsedAmount) ? 0 : parsedAmount * 1.1;
  const getRate = () => (currency === "ETH" ? ETH_RATE : BTC_RATE);
  const chargeKRW = Math.round(chargeCrypto * getRate());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = { barcode, title, category, amount, currency, expiry };
    console.log("등록 상품 정보:", data);
    alert("상품이 등록되었습니다 (더미 처리)");
  };

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-6">기프티콘 상품 등록</h1>
      <form
        onSubmit={handleSubmit}
        className="max-w-xl space-y-4 bg-white p-6 rounded shadow"
      >
        {/* 상품 바코드 */}
        <div>
          <label className="block mb-1 font-medium">상품 바코드</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            required
          />
        </div>

        {/* 상품명 */}
        <div>
          <label className="block mb-1 font-medium">상품명</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* 카테고리 드롭다운 */}
        <div>
          <label className="block mb-1 font-medium">카테고리</label>
          <div className="relative">
            <select
              className="appearance-none w-full border rounded px-3 py-2 pr-10 bg-white"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((cat, i) => (
                <option key={i} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <div className="absolute top-1/2 right-3 transform -translate-y-1/2 pointer-events-none">
              <ChevronDownIcon className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>

        {/* 상품 금액 */}
        <div>
          <label className="block mb-1 font-medium">상품 금액</label>
          <div className="flex gap-2">
            <input
              type="number"
              className="w-full border rounded px-3 py-2"
              placeholder="금액 입력"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
            <select
              className="border rounded px-3 py-2"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            >
              <option value="ETH">ETH</option>
              <option value="BTC">BTC</option>
            </select>
          </div>
        </div>

        {/* 유효기간 */}
        <div>
          <label className="block mb-1 font-medium">기프티콘 유효기간</label>
          <input
            type="date"
            className="w-full border rounded px-3 py-2"
            value={expiry}
            onChange={(e) => setExpiry(e.target.value)}
            required
          />
        </div>

        {/* 자동 계산 메시지 */}
        <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded border">
          이 상품이 판매될 때까지 상품 금액의{" "}
          <span className="font-semibold text-red-500">110%</span>인{" "}
          <span className="font-semibold">
            {chargeCrypto.toFixed(4)} {currency} ({chargeKRW.toLocaleString()}원)
          </span>{" "}
          이 지갑에서 차감됩니다.
        </div>

        {/* 등록 버튼 */}
        <button
          type="submit"
          className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
        >
          등록하기
        </button>

        {/* 환율 정보 */}
        <div className="text-sm text-gray-500 pt-6 border-t">
          📈 현재 환율 기준:
          <br />• 1 ETH ≈ {ETH_RATE.toLocaleString()}원
          <br />• 1 BTC ≈ {BTC_RATE.toLocaleString()}원
        </div>
      </form>
    </Layout>
  );
}