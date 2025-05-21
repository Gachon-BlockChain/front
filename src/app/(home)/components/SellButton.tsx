import React from "react";
import Link from "next/link";

export default function SellButton() {
  return (
    <Link href="/sell">
      <button className="w-12 h-12 bg-[#366CFF] rounded-full flex items-center justify-center shadow-[0px_4px_12px_rgba(0,0,0,0.12)]">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 5V19"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M5 12H19"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </Link>
  );
}
