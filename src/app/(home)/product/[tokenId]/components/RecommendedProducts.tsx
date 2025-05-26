import React from "react";
import Image from "next/image";
import Link from "next/link";
import { GifticonNFT } from "@/types";
import { formatPrice } from "@/lib/utils";

interface RecommendedProductsProps {
  products: GifticonNFT[];
}

export default function RecommendedProducts({ products }: RecommendedProductsProps) {
  if (products.length === 0) return null;

  return (
    <div className="p-4 border-b border-gray-100">
      <h3 className="font-bold text-sm mb-4">이 글과 함께 봤어요</h3>

      <div className="flex flex-wrap gap-4">
        {products.map((product) => (
          <Link
            href={`/product/${product.tokenId.toString()}`}
            key={product.tokenId.toString()}
            className="w-[calc(50%-8px)] flex flex-col gap-2"
          >
            <div className="relative w-full h-[118px] rounded overflow-hidden">
              <Image
                src={Array.isArray(product.image) ? product.image[0] : product.image}
                alt={product.productName}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h4 className="text-sm line-clamp-2">{product.productName}</h4>
              <p className="font-bold text-[#366CFF] text-sm">
                {formatPrice(product.depositAmount)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}