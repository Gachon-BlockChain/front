export type CategoryName =
  | "전체"
  | "편의점"
  | "카페"
  | "패스트푸드"
  | "베이커리";

export const CATEGORY_LIST: CategoryName[] = [
  "전체",
  "편의점",
  "카페",
  "패스트푸드",
  "베이커리",
];

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
