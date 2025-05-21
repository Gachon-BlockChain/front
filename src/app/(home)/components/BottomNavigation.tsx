import React from "react";
import Link from "next/link";

export default function BottomNavigation() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white">
      <div className="border-t border-gray-200 max-w-md mx-auto">
        <div className="flex justify-between items-center px-0">
          <Link href="/" className="flex flex-col items-center py-2 flex-1">
            <div className="w-6 h-6 flex items-center justify-center mb-1">
              <svg
                width="18"
                height="19.5"
                viewBox="0 0 18 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 8L9 1L17 8V19H1V8Z"
                  stroke="black"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="text-[10px] leading-[14px]">홈</span>
          </Link>

          <Link
            href="/mypage"
            className="flex flex-col items-center py-2 flex-1"
          >
            <div className="w-6 h-6 flex items-center justify-center mb-1">
              <svg
                width="18"
                height="20"
                viewBox="0 0 18 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 10C11.2091 10 13 8.20914 13 6C13 3.79086 11.2091 2 9 2C6.79086 2 5 3.79086 5 6C5 8.20914 6.79086 10 9 10Z"
                  stroke="black"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M17 18C17 14.134 13.4183 11 9 11C4.58172 11 1 14.134 1 18"
                  stroke="black"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="text-[10px] leading-[14px]">마이페이지</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
