import { toast } from 'react-toastify';
import { useCallback, useState } from 'react';
import { Contract, ethers } from 'ethers';
import { GifticonNFTABI, MarketplaceABI } from '@/context';
import {
	CategoryName,
	ContractContext,
	convertToGifticonItem,
	convertToGifticonNFT,
	GifticonFormParams,
	GifticonItem,
	GifticonNFT,
	GifticonNFTParams,
} from '@/types';
import {
	fetchMetadataFromIPFS,
	uploadFileToIPFS,
	uploadJSONToIPFS,
} from '@/lib/pinata';
import { encryptBarcode } from '@/lib/taco';

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

	const listNewNFT = async (
		formParams: GifticonFormParams
	): Promise<boolean> => {
		setIsLoading(true);
		try {
			const provider = new ethers.providers.Web3Provider(
				window.ethereum as any
			);

			const signer = await provider.getSigner();

			// 🔐 1. 바코드 이미지 암호화
			const messageKit = await encryptBarcode(
				GIFTICON_NFT_ADDRESS,
				formParams.encryptImage,
				signer,
				provider
			);

			// 📦 2. 암호화된 데이터를 JSON으로 저장 → Blob → File
			const encryptedJSON = JSON.stringify(messageKit);
			const blob = new Blob([encryptedJSON], { type: 'application/json' });
			const encryptedFile = new File(
				[blob],
				`${formParams.productName}-encrypted.json`
			);

			// 3. 암호/일반 파일 업로드
			const encryptImageUploadResult = await uploadFileToIPFS(encryptedFile);
			const imageUploadResult = await uploadFileToIPFS(formParams.image);

			const ipfsHash = imageUploadResult.ipfsHash;
			if (
				!ipfsHash ||
				imageUploadResult.pinataURL === undefined ||
				encryptImageUploadResult.pinataURL === undefined
			) {
				throw new Error('이미지 업로드 실패');
			}
			console.log('IPFS Hash:', ipfsHash);
			console.log('Pinata URL:', imageUploadResult.pinataURL);
			// 2. 메타데이터 업로드
			const tokenURI = await uploadMetadataToIPFS(
				formParams,
				imageUploadResult.pinataURL,
				encryptImageUploadResult.pinataURL
			);
			console.log('Token URI:', tokenURI);
			console.log('expiryDate:', formParams.expiryDate);

			// 3. NFT 등록
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
				formParams.price,
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

	const listNFT = async (formParams: GifticonNFTParams): Promise<boolean> => {
		setIsLoading(true);
		try {
			const provider = new ethers.providers.Web3Provider(
				window.ethereum as any
			);

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

			const tokenId = formParams.tokenId;
			console.log('Token ID:', tokenId);

			await registerNFTForSale(tokenId, formParams.price, context);

			toast.success('NFT 등록 성공');
			return true;
		} catch (err: any) {
			console.error(err);
			toast.error(err.message || 'NFT 등록 실패');
			return false;
		} finally {
			setIsLoading(false);
		}
	};

	const buyNFT = async (tokenId: bigint, price: number): Promise<boolean> => {
		setIsLoading(true);
		try {
			const provider = new ethers.providers.Web3Provider(
				window.ethereum as any
			);

			const signer = await provider.getSigner(); // 메타마스크에서 로그인 한 사람이 누군지

			const nftContract = new Contract( // 기프티콘 nft라는 서버랑 연동하는 구간
				GIFTICON_NFT_ADDRESS,
				GifticonNFTABI.abi,
				signer
			);

			const marketplaceContract = new Contract( // 마켓플레이스 라는 서버랑 연동하는 구간
				MARKETPLACE_ADDRESS,
				MarketplaceABI.abi,
				signer
			);

			const context: ContractContext = {
				// 연결해 놓은 정보들을 context로 묶은 것
				provider,
				signer,
				nftContract,
				marketplaceContract,
			};

			const priceInEther = ethers.utils.parseUnits(price.toString(), 'ether');

			// optional: callStatic 확인
			try {
				await context.marketplaceContract.callStatic.buyItem(tokenId, {
					value: priceInEther,
				});
				console.log('✅ callStatic 통과');
			} catch (simError) {
				console.error('❌ 시뮬레이션 실패', simError);
				toast.error('컨트랙트 실행 조건을 만족하지 않습니다.');
			}

			const tx = await context.marketplaceContract.buyItem(tokenId, {
				value: priceInEther,
			});
			await tx.wait();

			toast.success('🎉 구매가 완료되었습니다!');
			return true;
		} catch (error: any) {
			console.error('🚨 구매 실패:', error);
			toast.error('구매 중 문제가 발생했습니다.');
			return false;
		} finally {
			setIsLoading(false);
		}
	};

	return { isLoading, fetchItems, fetchMyNFTs, listNewNFT, listNFT, buyNFT };
}

async function uploadMetadataToIPFS(
	formParams: GifticonFormParams,
	pinataURL: string,
	encryptPinataURL: string
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
		encryptImage: encryptPinataURL,
	};
	const response = await uploadJSONToIPFS(jsonBody, formParams.productName);

	if (!response?.success) {
		throw new Error('메타데이터 업로드 실패');
	}

	return response.pinataURL!;
}

async function registerGifticonOnChain(
	ipfsHash: string,
	tokenURI: string,
	expiryDate: number,
	depositAmount: number,
	context: ContractContext
): Promise<bigint> {
	const { nftContract } = context;
	const depositInEther = ethers.utils.parseUnits(
		depositAmount.toString(),
		'ether'
	);

	// 🔍 실행 전 callStatic으로 시뮬레이션 (실제 트랜잭션 전)
	try {
		await nftContract.callStatic.registerGifticon(
			ipfsHash,
			tokenURI,
			expiryDate,
			depositInEther,
			{ value: depositInEther }
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
		depositInEther,
		{
			value: depositInEther,
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
		await nftContract.callStatic.approve(MARKETPLACE_ADDRESS, tokenId);
		console.log('approve callStatic: 시뮬레이션 통과 ✅');
	} catch (err) {
		console.error('callStatic: 사전 실행 실패 ❌', err);
		toast.error('컨트랙트 실행 조건 불일치. 등록 실패');
	}

	await nftContract.approve(MARKETPLACE_ADDRESS, tokenId);

	const priceInEther = ethers.utils.parseUnits(price.toString(), 'ether');
	console.log('priceInEther:', priceInEther);

	try {
		await marketplaceContract.callStatic.listItem(tokenId, priceInEther);
		console.log('listItem callStatic: 시뮬레이션 통과 ✅');
	} catch (err) {
		console.error('callStatic: 사전 실행 실패 ❌', err);
		toast.error('컨트랙트 실행 조건 불일치. 등록 실패');
	}
	await marketplaceContract.listItem(tokenId, priceInEther);
	console.log('✅ listItem 완료');
}
