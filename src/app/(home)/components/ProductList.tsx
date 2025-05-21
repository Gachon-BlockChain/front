import React, { useMemo } from "react";
import ProductCard from "./ProductCard";
import { products } from "@/constant/constData";

// 더미 데이터

export default function ProductList() {
  // 상품 데이터 메모이제이션 (실제 API 호출 시에는 이 부분이 React Query 등으로 대체됨)
  const productData = useMemo(() => products, []);

  return (
    <div className="p-4 flex flex-col gap-4">
      {productData.map((product, index) => (
        <React.Fragment key={product.id}>
          {index > 0 && (
            <div className="border-t border-gray-100 w-full my-2"></div>
          )}
          <ProductCard product={product} />
        </React.Fragment>
      ))}
    </div>
  );
}
