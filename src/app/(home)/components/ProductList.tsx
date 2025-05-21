"use client";

import React, { useMemo, useState } from "react";
import ProductCard from "./ProductCard";
import { products } from "@/constant/constData";
import CategoryBar from "./CategoryBar";

// 더미 데이터

export default function ProductList() {
  const [selectedCategory, setSelectedCategory] = useState("전체");

  // 선택된 카테고리에 따라 상품 필터링
  const filteredProducts = useMemo(() => {
    if (selectedCategory === "전체") {
      return products;
    }
    return products.filter((product) => product.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <>
      <CategoryBar
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />
      <div className="p-4 flex flex-col gap-4">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            해당 카테고리의 상품이 없습니다.
          </div>
        ) : (
          filteredProducts.map((product, index) => (
            <React.Fragment key={product.id}>
              {index > 0 && (
                <div className="border-t border-gray-100 w-full my-2"></div>
              )}
              <ProductCard product={product} />
            </React.Fragment>
          ))
        )}
      </div>
    </>
  );
}
