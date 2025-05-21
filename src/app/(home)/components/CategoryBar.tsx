import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { products } from "@/constant/constData";
import React from "react";

interface CategoryBarProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function CategoryBar({
  selectedCategory,
  onCategoryChange,
}: CategoryBarProps) {
  // 카테고리 중복 제거
  const uniqueCategories = [
    ...new Set(products.map((product) => product.category)),
  ];

  return (
    <div className="flex justify-between items-center p-3 border-b border-gray-100">
      <div className="flex items-center gap-1.5">
        <Select value={selectedCategory} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="카테고리" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="전체">전체</SelectItem>
            {uniqueCategories.map((category) => (
              <SelectItem key={category} value={category}>
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
