import { toast } from 'react-toastify';
import { useCallback, useState } from 'react';
import { Contract, ethers, JsonRpcProvider, parseUnits } from 'ethers';
import { GifticonNFTABI, MarketplaceABI } from '@/context';
import {
	CategoryName,
	ContractContext,
	convertToGifticonItem,
	GifticonFormParams,
	GifticonItem,
} from '@/types';
import {
	fetchMetadataFromIPFS,
	uploadFileToIPFS,
	uploadJSONToIPFS,
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
				toast.error('요청 설정 중 문제가 발생했습니다.');
				return [];
			} finally {
				setIsLoading(false);
			}
		},
		[]
	);

	const listNFT = async (formParams: GifticonFormParams): Promise<boolean> => {
		setIsLoading(true);
		try {
			// 1. 이미지 업로드
			const imageUploadResult = await uploadFileToIPFS(formParams.image);
			const ipfsHash = imageUploadResult.ipfsHash;
			if (!ipfsHash || imageUploadResult.pinataURL === undefined) {
				throw new Error('이미지 업로드 실패');
			}
			console.log('IPFS Hash:', ipfsHash);
			console.log('Pinata URL:', imageUploadResult.pinataURL);
			// 2. 메타데이터 업로드
			const tokenURI = await uploadMetadataToIPFS(
				formParams,
				imageUploadResult.pinataURL
			);
			console.log('Token URI:', tokenURI);
			console.log('expiryDate:', formParams.expiryDate);

			// 3. NFT 등록
			const provider = new ethers.BrowserProvider(window.ethereum as any);
			const signer = await provider.getSigner();
			const nftContract = new Contract(
				GIFTICON_NFT_ADDRESS,
				GifticonNFTABI.abi,
				signer
			);
			const marketplaceContract = new Contract(
				MARKETPLACE_ADDRESS,
				MarketplaceABI.abi,
				signer
			);

			const context: ContractContext = {
				provider,
				signer,
				nftContract,
				marketplaceContract,
			};

			const tokenId = await registerGifticonOnChain(
				ipfsHash,
				tokenURI,
				formParams.expiryDate,
				context
			);
			console.log('Token ID:', tokenId);

			await registerNFTForSale(tokenId, formParams.price, context);

			toast.success('NFT 생성 및 등록 성공');
			return true;
		} catch (err: any) {
			console.error(err);
			toast.error(err.message || 'NFT 생성 실패');
			return false;
		} finally {
			setIsLoading(false);
		}
	};

	return { isLoading, fetchItems, listNFT };
}

async function uploadMetadataToIPFS(
	formParams: GifticonFormParams,
	pinataURL: string
): Promise<string> {
	if (
		!formParams.productName ||
		!formParams.expiryDate ||
		!formParams.price ||
		!formParams.categoryName ||
		!formParams.image
	) {
		throw new Error('모든 필드를 입력해주세요.');
	}
	const jsonBody = {
		productName: formParams.productName,
		description: formParams.description,
		categoryName: formParams.categoryName,
		image: pinataURL,
	};
	const response = await uploadJSONToIPFS(jsonBody);

	if (!response?.success) {
		throw new Error('메타데이터 업로드 실패');
	}

	return response.pinataURL!;
}

async function registerGifticonOnChain(
	ipfsHash: string,
	tokenURI: string,
	expiryDate: number,
	context: ContractContext
): Promise<bigint> {
	// DEPOSIT_AMOUNT는 0.1 ETH
	const DEPOSIT_AMOUNT = ethers.parseEther('0.1');
	const { nftContract } = context;

	// 🔍 실행 전 callStatic으로 시뮬레이션 (실제 트랜잭션 전)
	try {
		await nftContract.registerGifticon.staticCall(
			ipfsHash,
			tokenURI,
			expiryDate,
			{ value: DEPOSIT_AMOUNT }
		);
		console.log('registerGifticon staticCall: 시뮬레이션 통과 ✅');
	} catch (err) {
		console.error('callStatic: 사전 실행 실패 ❌', err);
		toast.error('컨트랙트 실행 조건 불일치. 등록 실패');
	}

	const tx = await nftContract.registerGifticon(
		ipfsHash,
		tokenURI,
		expiryDate,
		{
			value: DEPOSIT_AMOUNT,
			gasLimit: 3000000, // 가스 리밋 설정
		}
	);
	const receipt = await tx.wait();
	console.log('Transaction receipt:', receipt);
	for (const log of receipt.logs) {
		if (log.address.toLowerCase() !== GIFTICON_NFT_ADDRESS.toLowerCase())
			continue;
		try {
			const parsed = nftContract.interface.parseLog(log);
			if (parsed?.name === 'GifticonRegistered') {
				return parsed.args.tokenId;
			}
		} catch (_) {
			continue;
		}
	}

	// 🔴 이벤트 못 찾은 경우 명확한 에러 throw
	throw new Error('등록 이벤트를 찾을 수 없습니다. tokenId 추출 실패');
}

async function registerNFTForSale(
	tokenId: bigint,
	price: number,
	context: ContractContext
): Promise<void> {
	const { nftContract, marketplaceContract } = context;
	// 🔍 실행 전 callStatic으로 시뮬레이션 (실제 트랜잭션 전)
	try {
		await nftContract.approve.staticCall(MARKETPLACE_ADDRESS, tokenId);
		console.log('approve callStatic: 시뮬레이션 통과 ✅');
	} catch (err) {
		console.error('callStatic: 사전 실행 실패 ❌', err);
		toast.error('컨트랙트 실행 조건 불일치. 등록 실패');
	}

	await nftContract.approve(MARKETPLACE_ADDRESS, tokenId, {
		gasLimit: 3000000, // 가스 리밋 설정
	});

	const priceInEther = parseUnits(price.toString(), 'ether');
	console.log('priceInEther:', priceInEther);

	try {
		await marketplaceContract.listItem.staticCall(tokenId, priceInEther);
		console.log('listItem callStatic: 시뮬레이션 통과 ✅');
	} catch (err) {
		console.error('callStatic: 사전 실행 실패 ❌', err);
		toast.error('컨트랙트 실행 조건 불일치. 등록 실패');
	}
	await marketplaceContract.listItem(tokenId, priceInEther, {
		gasLimit: 3000000, // 가스 리밋 설정
	});
	console.log('✅ listItem 완료');
}
