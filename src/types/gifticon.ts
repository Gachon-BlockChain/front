import { CategoryName } from "./category";

export type GifticonStatus = "Listed" | "Redeemed" | "Penalized";

export interface GifticonItem {
  // GifticonNFT
  tokenId: number;
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
  tokenId: number,
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

    price: listing.price,
    seller: listing.seller,

    productName: metadata.productName,
    description: metadata.description,
    image: metadata.image,
    categoryName: metadata.categoryName,
  };
};
