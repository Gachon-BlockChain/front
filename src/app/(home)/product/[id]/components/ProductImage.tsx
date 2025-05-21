"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { type CarouselApi } from "@/components/ui/carousel";

interface ProductImageProps {
  image: string[];
}

export default function ProductImage({ image }: ProductImageProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <div className="relative w-full">
      <Carousel setApi={setApi} className="w-full">
        <CarouselContent>
          {image.map((src, index) => (
            <CarouselItem key={index} className="relative h-[385px]">
              <Image
                src={src}
                alt={`상품 이미지 ${index + 1}`}
                fill
                className="object-cover"
                priority={index === 0}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* 이미지 인디케이터 */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center gap-2 z-10">
        {image.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-all ${
              current === index ? "bg-[#4AC1DB]" : "bg-[#888888] opacity-60"
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
}
