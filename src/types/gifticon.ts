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
    categoryName: metadata.categoryName,
  };
};

export const convertToGifticonNFT = (
  tokenId: bigint,
  onchainData: any,
  metadata: any
): GifticonNFT => {
  return {
    tokenId,
    originalOwner: onchainData.originalOwner,
    depositAmount: Number(onchainData.depositAmount) / 1e18,
    status: ["Listed", "Redeemed", "Penalized"][
      onchainData.status
    ] as GifticonStatus,
    burnTimestamp: Number(onchainData.burnTimestamp),

    productName: metadata.productName,
    description: metadata.description,
    image: metadata.image,
    categoryName: metadata.categoryName,
  };
};
