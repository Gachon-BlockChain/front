import React from "react";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { GifticonItem } from "@/types/gifticon";

interface ProductCardProps {
  product: GifticonItem;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/product/${product.tokenId}`} className="flex gap-4">
      <div className="flex-shrink-0 relative w-[110px] h-[110px] border rounded overflow-hidden">
        <Image
          src={product.image[0]}
          alt={product.productName}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 110px, 110px"
          priority={product.tokenId <= 2}
          quality={80}
        />
      </div>
      <div className="flex flex-col justify-between py-1 flex-grow">
        <div>
          <h3 className="text-base font-normal line-clamp-2">
            {product.productName}
          </h3>
          <div className="flex gap-1 text-xs text-gray-500 mt-1">
            <span>{product.originalOwner}</span>
            <span>·</span>
            <span>{product.burnTimestamp}</span>
          </div>
        </div>
        <p className="text-[#366CFF] font-bold">{formatPrice(product.price)}</p>
      </div>
    </Link>
  );
}
