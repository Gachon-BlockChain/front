import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { products } from "@/constant/constData";
import React from "react";

export default function CategoryBar() {
  // 카테고리 중복 제거
  const uniqueCategories = [
    ...new Set(products.map((product) => product.category)),
  ];

  return (
    <div className="flex justify-between items-center p-3 border-b border-gray-100">
      <div className="flex items-center gap-1.5">
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {uniqueCategories.map((category, index) => (
              <SelectItem key={index} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center"></div>
    </div>
  );
}
