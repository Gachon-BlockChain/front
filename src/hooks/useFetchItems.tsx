import { toast } from 'react-toastify';
import { useCallback, useState } from 'react';
import { Contract, ethers } from 'ethers';
import { GifticonNFTABI, MarketplaceABI } from '@/context';
import {
	CategoryName,
	convertToGifticonItem,
	convertToGifticonNFT,
	GifticonItem,
	GifticonNFT,
} from '@/types';
import {
	fetchMetadataFromIPFS,
} from '@/lib/pinata';

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
				const alchemyProvider = new ethers.providers.JsonRpcProvider(
					ALCHEMY_URL
				);
				const marketplaceContract = new Contract(
					MARKETPLACE_ADDRESS,
					MarketplaceABI.abi,
					alchemyProvider
				);
				const nftContract = new Contract(
					GIFTICON_NFT_ADDRESS,
					GifticonNFTABI.abi,
					alchemyProvider
				);

				console.log(marketplaceContract);
				console.log(nftContract)
				const tokenIds: bigint[] = await marketplaceContract.getListings();
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
				toast.error('요청 설정 중 문제가 발생했습니다.');
				return [];
			} finally {
				setIsLoading(false);
			}
		},
		[]
	);

	const fetchMyNFTs = async (): Promise<GifticonNFT[]> => {
		setIsLoading(true);
		try {
			const provider = new ethers.providers.Web3Provider(
				window.ethereum as any
			);

			const signer = await provider.getSigner();
			const address = await signer.getAddress();

			const nftContract = new Contract(
				GIFTICON_NFT_ADDRESS,
				GifticonNFTABI.abi,
				signer
			);

			const result = await nftContract.gifticonsWithIdOfOwner(address);
			console.log('My NFTs:', result);

			const myNFTs = await Promise.all(
				result.map(async (entry: { tokenId: bigint; gifticon: any }) => {
					const tokenURI: string = await nftContract.tokenURI(entry.tokenId);
					const metadata = await fetchMetadataFromIPFS(tokenURI);

					return convertToGifticonNFT(entry.tokenId, entry.gifticon, metadata);
				})
			);
			console.log('My NFTs after conversion:', myNFTs);

			myNFTs.forEach((nft) => {
				if (
					!nft.image ||
					typeof nft.image !== 'string' ||
					nft.image.length < 5
				) {
					console.warn(
						`⚠️ 잘못된 이미지 경로: tokenId=${nft.tokenId}, image=${nft.image}`
					);
				} else {
					console.log(`✅ NFT tokenId=${nft.tokenId}, image=${nft.image}`);
				}
			});

			toast.success('NFT 등록 성공');
			return myNFTs;
		} catch (error) {
			console.error('Error fetching my NFTs:', error);
			toast.error('내 NFT를 가져오는 중 문제가 발생했습니다.');
			return [];
		} finally {
			setIsLoading(false);
		}
	};


	return { isLoading, fetchItems, fetchMyNFTs };
}