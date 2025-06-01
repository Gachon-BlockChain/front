import { toast } from 'react-toastify';
import { useState } from 'react';
import { Contract, ethers } from 'ethers';
import { GifticonNFTABI, MarketplaceABI } from '@/context';
import {
	ContractContext,
	GifticonFormParams,
	GifticonNFTParams,
} from '@/types';
import {
	uploadFileToIPFS,
	uploadJSONToIPFS,
} from '@/lib/pinata';
import { encryptBarcode } from '@/lib/taco';

const MARKETPLACE_ADDRESS = process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS ?? '';
const GIFTICON_NFT_ADDRESS = process.env.NEXT_PUBLIC_GIFTICON_NFT_ADDRESS ?? '';

export default function useListItems() {
	const [isLoading, setIsLoading] = useState<boolean>(false);

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

	return { isLoading, listNewNFT, listNFT };
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
