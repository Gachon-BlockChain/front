import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "상품 상세 - 기프티콘 마켓",
  description: "기프티콘 상세 정보",
};

export default function ProductLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="max-w-md mx-auto min-h-screen bg-white">{children}</div>
  );
}
