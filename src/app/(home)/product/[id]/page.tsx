import React from "react";
import { products } from "@/constant/constData";
import ProductHeader from "@/app/(home)/product/[id]/components/ProductHeader";
import ProductImage from "@/app/(home)/product/[id]/components/ProductImage";
import ProductInfo from "@/app/(home)/product/[id]/components/ProductInfo";
import RelatedProducts from "@/app/(home)/product/[id]/components/RelatedProducts";
import RecommendedProducts from "@/app/(home)/product/[id]/components/RecommendedProducts";
import BottomPurchaseBar from "@/app/(home)/product/[id]/components/BottomPurchaseBar";
import { notFound } from "next/navigation";
import { Metadata } from "next";

type ParamsType = Promise<{ id: string }>;

// 동적 메타데이터 생성
export async function generateMetadata({
  params,
}: {
  params: ParamsType;
}): Promise<Metadata> {
  const { id } = await params;
  const productId = parseInt(id);
  const product = products.find((p) => p.id === productId);

  if (!product) {
    return {
      title: "상품을 찾을 수 없습니다",
      description: "요청하신 상품을 찾을 수 없습니다.",
    };
  }

  return {
    title: `${product.title} - 기프티콘 마켓`,
    description: `${product.category} 카테고리의 ${product.title}. ${product.seller} 판매. 가격: ${product.price}원`,
  };
}

export default async function ProductPage({ params }: { params: ParamsType }) {
  const { id } = await params;
  const productId = parseInt(id);

  // 상품 ID로 상품 정보 찾기
  const product = products.find((p) => p.id === productId);

  // 상품이 없을 경우 404 처리
  if (!product) {
    notFound();
  }

  // 같은 카테고리의 상품 찾기 (판매자의 다른 상품)
  const sellerOtherProducts = products
    .filter((p) => p.seller === product.seller && p.id !== productId)
    .slice(0, 2);

  // 함께 본 상품 (추천 상품)
  const recommendedProducts = products
    .filter((p) => p.category === product.category && p.id !== productId)
    .slice(0, 6);

  return (
    <main className="flex flex-col min-h-screen pb-16">
      <ProductHeader />
      <ProductImage image={product.image} />
      <ProductInfo product={product} />

      {sellerOtherProducts.length > 0 && (
        <RelatedProducts
          sellerName={product.seller}
          products={sellerOtherProducts}
        />
      )}

      {recommendedProducts.length > 0 && (
        <RecommendedProducts products={recommendedProducts} />
      )}

      <BottomPurchaseBar price={product.price} />
    </main>
  );
}
