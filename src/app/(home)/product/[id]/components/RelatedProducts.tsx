import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "./types";
import { formatPrice } from "@/lib/utils";

interface RelatedProductsProps {
  sellerName: string;
  products: Product[];
}

export default function RelatedProducts({
  sellerName,
  products,
}: RelatedProductsProps) {
  if (products.length === 0) return null;

  return (
    <div className="p-4 border-b border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-sm">{sellerName}님의 판매 상품</h3>
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9 18L15 12L9 6"
            stroke="black"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div className="flex gap-4">
        {products.map((product) => (
          <Link
            href={`/product/${product.id}`}
            key={product.id}
            className="flex-1 flex flex-col gap-2"
          >
            <div className="relative w-full h-[118px] rounded overflow-hidden">
              <Image
                src={product.image[0]}
                alt={product.title}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h4 className="text-sm line-clamp-2">{product.title}</h4>
              <p className="font-bold text-[#366CFF] text-sm">
                {formatPrice(product.price)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
