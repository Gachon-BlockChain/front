import React from "react";
import { User, ChevronRight } from "lucide-react";

export default function ProfileSection() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-center">
        <div className="relative w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
          {/* 프로필 이미지가 있으면 표시, 없으면 기본 아이콘 */}
          <User className="w-8 h-8 text-gray-400" />
          {/* <Image src="/images/profile.jpg" alt="프로필 이미지" fill className="object-cover" /> */}
        </div>

        <div className="ml-4 flex-1">
          <h3 className="text-lg font-semibold">사용자 이름</h3>
          <p className="text-sm text-gray-500">0x1234...5678</p>
        </div>

        <button className="flex items-center text-sm text-gray-500">
          프로필 수정
          <ChevronRight size={16} className="ml-1" />
        </button>
      </div>

      <div className="mt-4 flex justify-between">
        <div className="text-center flex-1">
          <p className="text-lg font-semibold">36.5°C</p>
          <p className="text-xs text-gray-500">매너온도</p>
        </div>
        <div className="w-px bg-gray-200 h-10 my-auto"></div>
        <div className="text-center flex-1">
          <p className="text-lg font-semibold">36</p>
          <p className="text-xs text-gray-500">거래 건수</p>
        </div>
      </div>
    </div>
  );
}
