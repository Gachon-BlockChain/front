import { useCallback, useState } from 'react';
import { Contract, JsonRpcProvider } from 'ethers';
import { GifticonNFTABI, MarketplaceABI } from '@/context';
import {
	CategoryName,
	convertToGifticonItem,
	GifticonItem,
} from '@/types/gifticon';
import { fetchMetadataFromIPFS } from '@/lib/pinata';

const MARKETPLACE_ADDRESS = process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS ?? '';
const GIFTICON_NFT_ADDRESS = process.env.NEXT_PUBLIC_GIFTICON_NFT_ADDRESS ?? '';
const ALCHEMY_URL = process.env.NEXT_PUBLIC_ALCHEMY_URL ?? '';

export default function useItems() {
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const fetchItems = useCallback(
		async ({ categoryName }: { categoryName: CategoryName }) => {
			setIsLoading(true);
			try {
				console.log('Fetching items...');
				const provider = new JsonRpcProvider(ALCHEMY_URL);
				const marketplaceContract = new Contract(
					MARKETPLACE_ADDRESS,
					MarketplaceABI.abi,
					provider
				);
				const nftContract = new Contract(
					GIFTICON_NFT_ADDRESS,
					GifticonNFTABI.abi,
					provider
				);

				const tokenIds: number[] = await marketplaceContract.getListings();
				console.log('Token IDs:', tokenIds);
				const itemPromises = tokenIds.map(async (tokenId) => {
					const item = await nftContract.gifticons(tokenId); // IGifticonNFT 호출
					const tokenURI = await nftContract.tokenURI(tokenId); // 메타데이터
					const metadata = await fetchMetadataFromIPFS(tokenURI); // 여기서 사용
					const listing = await marketplaceContract.listings(tokenId); // ⬅️ 가격 읽기

					return convertToGifticonItem(tokenId, item, metadata, listing);
				});
				const allItems: GifticonItem[] = await Promise.all(itemPromises);

				// categoryName이 있으면 필터링
				if (categoryName !== '전체') {
					return allItems.filter((item) => item.categoryName === categoryName);
				}
				console.log('All items:', allItems);
				return allItems;
			} catch (error) {
				console.error('Error fetching items:', error);
				return [];
			} finally {
				setIsLoading(false);
			}
		},
		[]
	);

	return { isLoading, fetchItems };
}
