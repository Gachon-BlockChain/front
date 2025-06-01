import { ethers } from "ethers";
import { CategoryName } from "./category";

export type GifticonStatus = "Listed" | "Redeemed" | "Penalized";

export interface GifticonNFT {
  tokenId: bigint;
  originalOwner: string;
  depositAmount: number;
  status: GifticonStatus;
  burnTimestamp: number;

  // IPFS 메타데이터
  productName: string;
  description?: string;
  image: string;
  encryptImage?: string;
  categoryName: CategoryName;
}

export interface GifticonNFTParams {
  tokenId: bigint;
  price: number;
}

export interface GifticonItem {
  // GifticonNFT
  tokenId: bigint;
  originalOwner: string;
  depositAmount: bigint;
  status: GifticonStatus;
  burnTimestamp: number;

  // Marketplace
  price: number;
  seller: string;

  // IPFS 메타데이터
  productName: string;
  description?: string;
  image: string;
  encryptImage?: string;
  categoryName: CategoryName;
}

export interface GifticonFormParams {
  expiryDate: number;

  // Marketplace
  price: number;

  // IFPS 메타데이터
  productName: string;
  description?: string;
  categoryName: CategoryName;
  image: File;
  encryptImage: File;
}

// 변환 함수
export const convertToGifticonItem = (
  tokenId: bigint,
  onchainData: any,
  metadata: any,
  listing: any
): GifticonItem => {
  return {
    tokenId,
    originalOwner: onchainData.originalOwner,
    depositAmount: onchainData.depositAmount,
    status: ["Listed", "Redeemed", "Penalized"][
      onchainData.status
    ] as GifticonStatus,
    burnTimestamp: Number(onchainData.burnTimestamp),

    price: Number(listing.price) / 1e18,
    seller: listing.seller,

    productName: metadata.productName,
    description: metadata.description,
    image: metadata.image,
    encryptImage: metadata.encryptImage,
    categoryName: metadata.categoryName,
  };
};

// 1. 오버로드 시그니처 정의
export function convertToGifticonNFT(
  tokenId: bigint,
  onchainData: any,
  metadata: any
): GifticonNFT;
export function convertToGifticonNFT(gifticonItem: GifticonItem): GifticonNFT;

// 2. 실제 구현
export function convertToGifticonNFT(
  arg1: bigint | GifticonItem,
  arg2?: any,
  arg3?: any
): GifticonNFT {
  if (typeof arg1 === "object" && "depositAmount" in arg1 && "status" in arg1) {
    // GifticonItem 방식
    const gifticonItem = arg1 as GifticonItem;
    return {
      tokenId: gifticonItem.tokenId,
      originalOwner: gifticonItem.originalOwner,
      // 권장 방식 (정확성 보장)
      depositAmount: Number(
        ethers.utils.formatUnits(gifticonItem.depositAmount, 18)
      ),
      status: gifticonItem.status,
      burnTimestamp: Number(gifticonItem.burnTimestamp),
      productName: gifticonItem.productName,
      description: gifticonItem.description,
      image: gifticonItem.image,
      encryptImage: gifticonItem.encryptImage,
      categoryName: gifticonItem.categoryName,
    };
  } else {
    // tokenId + onchainData + metadata 방식
    const tokenId = arg1 as bigint;
    const onchainData = arg2;
    const metadata = arg3;
    return {
      tokenId,
      originalOwner: onchainData.originalOwner,

      depositAmount: Number(
        ethers.utils.formatUnits(onchainData.depositAmount, 18)
      ),
      status: ["Listed", "Redeemed", "Penalized"][
        onchainData.status
      ] as GifticonStatus,
      burnTimestamp: Number(onchainData.burnTimestamp),
      productName: metadata.productName,
      description: metadata.description,
      image: metadata.image,
      encryptImage: metadata.encryptImage,
      categoryName: metadata.categoryName,
    };
  }
}
