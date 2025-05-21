import React from "react";
import Link from "next/link";
import { ChevronLeft, Home, Share, MoreVertical } from "lucide-react";

export default function ProductHeader() {
  return (
    <div className="flex justify-between items-center p-4">
      <Link href="/" className="w-6 h-6">
        <div className="w-6 h-6 flex items-center justify-center">
          <ChevronLeft size={24} strokeWidth={2} />
        </div>
      </Link>

      <Link href="/" className="w-6 h-6 mx-2">
        <div className="w-6 h-6 flex items-center justify-center">
          <Home size={20} strokeWidth={2} />
        </div>
      </Link>

      <div className="flex gap-4 ml-auto">
        <button className="w-6 h-6 flex items-center justify-center">
          <Share size={20} strokeWidth={2} />
        </button>

        <button className="w-6 h-6 flex items-center justify-center">
          <MoreVertical size={20} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
