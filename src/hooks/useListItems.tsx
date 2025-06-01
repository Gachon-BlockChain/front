import { toast } from 'react-toastify';
import { useState } from 'react';
import { Contract, ethers } from 'ethers';
import { GifticonNFTABI, MarketplaceABI } from '@/context';
import {
	ContractContext,
	GifticonFormParams,
	GifticonNFTParams,
} from '@/types';
import { uploadFileToIPFS, uploadJSONToIPFS } from '@/lib/pinata';
import { encryptBarcode } from '@/lib/taco';

const MARKETPLACE_ADDRESS = process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS ?? '';
const GIFTICON_NFT_ADDRESS = process.env.NEXT_PUBLIC_GIFTICON_NFT_ADDRESS ?? '';

export default function useListItems() {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [step, setStep] = useState<number>(1); // 현재 단계 관리
	const [context, setContext] = useState<ContractContext | null>(null);

	const initWeb3 = async () => {
		const web3Provider = new ethers.providers.Web3Provider(
			window.ethereum as any
		);
		const web3Signer = await web3Provider.getSigner();

		const nftContract = new Contract(
			GIFTICON_NFT_ADDRESS,
			GifticonNFTABI.abi,
			web3Signer
		);

		const marketplaceContract = new Contract(
			MARKETPLACE_ADDRESS,
			MarketplaceABI.abi,
			web3Signer
		);
		setContext({
			provider: web3Provider,
			signer: web3Signer,
			nftContract,
			marketplaceContract,
		});
	};

	const registerGifticon = async (
		expiryDate: number,
		price: number
	): Promise<bigint> => {
		if (!context) throw new Error('Web3 context가 초기화되지 않았습니다.');
		setIsLoading(true);
		try {
			const tokenId = await registerGifticonOnChain(expiryDate, price, context);
			setStep(2);
			return tokenId;
		} catch (error: any) {
			console.error('기프티콘 등록 중 오류 발생:', error);
			toast.error(error.message || '기프티콘 등록 실패');
			setStep(1);
			throw error;
		} finally {
			setIsLoading(false);
		}
	};

	const setMetadata = async (
		tokenId: bigint,
		formParams: GifticonFormParams
	): Promise<{ tokenURI: string; encryptIpfsHash: string }> => {
		if (!context) throw new Error('Web3 provider가 초기화되지 않았습니다.');
		setIsLoading(true);

		try {
			// 🔐 1. 바코드 이미지 암호화
			console.log('Encrypting barcode image...');
			const messageKit = await encryptBarcode(
				GIFTICON_NFT_ADDRESS,
				tokenId,
				formParams.encryptImage,
				context.signer,
				context.provider
			);

			// 📦 3. 암호화된 데이터를 JSON으로 저장 → Blob → File
			console.log('Serializing message kit...');
			const serialized = messageKit.toBytes(); // Uint8Array
			const blob = new Blob([serialized], { type: 'application/octet-stream' });
			const encryptedFile = new File(
				[blob],
				`${formParams.productName}-encrypted.json`
			);

			// 4. 암호/일반 파일 업로드
			console.log('Uploading files to IPFS...');
			const encryptImageUploadResult = await uploadFileToIPFS(encryptedFile);
			const imageUploadResult = await uploadFileToIPFS(formParams.image);

			if (
				imageUploadResult.pinataURL === undefined ||
				encryptImageUploadResult.pinataURL === undefined ||
				encryptImageUploadResult.ipfsHash === undefined
			) {
				throw new Error('이미지 업로드 실패');
			}
			const encryptIpfsHash = encryptImageUploadResult.ipfsHash; // 암호화된 이미지 IPFS 해시

			console.log('Pinata URL:', imageUploadResult.pinataURL);
			console.log('Pinata encrypt URL:', encryptImageUploadResult.pinataURL);

			// 5. 메타데이터 업로드
			console.log('Uploading metadata to IPFS...');
			const tokenURI = await uploadMetadataToIPFS(
				formParams,
				imageUploadResult.pinataURL,
				encryptImageUploadResult.pinataURL
			);
			console.log('Token URI:', tokenURI);
			console.log('expiryDate:', formParams.expiryDate);
			setStep(3); // 메타데이터 연결 단계로 이동

			return { tokenURI, encryptIpfsHash };
		} catch (error: any) {
			console.error('메타데이터 설정 중 오류 발생:', error);
			toast.error(error.message || '메타데이터 설정 실패');
			setStep(2);
			throw error; // 에러를 다시 던져서 호출한 곳에서 처리할 수 있도록 함
		} finally {
			setIsLoading(false);
		}
	};

	const setTokenURIAndIpfsHash = async (
		tokenId: bigint,
		tokenURI: string,
		ipfsHash: string
	): Promise<boolean> => {
		if (!context) throw new Error('Web3 provider가 초기화되지 않았습니다.');
		setStep(3); // 단계 업데이트
		setIsLoading(true);
		try {
			// 6. NFT에 메타데이터 설정
			console.log('Setting token URI...');
			await context.nftContract.callStatic.setTokenURIAndIpfsHash(
				tokenId,
				tokenURI,
				ipfsHash
			);
			await context.nftContract.setTokenURIAndIpfsHash(
				tokenId,
				tokenURI,
				ipfsHash
			);

			toast.success('NFT 생성 성공');
			setStep(4); // NFT 생성 완료 단계로 이동
			return true;
		} catch (err: any) {
			console.error(err);
			toast.error(err.message || 'NFT 생성 실패');
			setStep(3);
			throw err; // 에러를 다시 던져서 호출한 곳에서 처리할 수 있도록 함
		} finally {
			setIsLoading(false);
		}
	};

	const listNFT = async (formParams: GifticonNFTParams): Promise<boolean> => {
		if (!context) throw new Error('Web3 provider가 초기화되지 않았습니다.');
		setStep(4); // 단계 업데이트
		setIsLoading(true);
		try {
			const tokenId = formParams.tokenId;
			console.log('Token ID:', tokenId);

			await registerNFTForSale(tokenId, formParams.price, context);
			console.log('NFT 등록 완료');
			toast.success('NFT 등록 성공');
			setStep(5); // 등록 완료 단계로 이동
			return true;
		} catch (err: any) {
			console.error(err);
			toast.error(err.message || 'NFT 등록 실패');
			setStep(4);
			throw err; // 에러를 다시 던져서 호출한 곳에서 처리할 수 있도록 함
		} finally {
			setIsLoading(false);
		}
	};

	return {
		isLoading,
		step,
		initWeb3,
		registerGifticon,
		setMetadata,
		setTokenURIAndIpfsHash,
		listNFT,
	};
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
		!formParams.categoryName
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
		await nftContract.callStatic.registerGifticon(expiryDate, depositInEther, {
			value: depositInEther,
		});
		console.log('registerGifticon staticCall: 시뮬레이션 통과 ✅');
	} catch (err) {
		console.error('callStatic: 사전 실행 실패 ❌', err);
		toast.error('컨트랙트 실행 조건 불일치. 등록 실패');
	}

	const tx = await nftContract.registerGifticon(expiryDate, depositInEther, {
		value: depositInEther,
	});
	const receipt = await tx.wait();
	console.log('Transaction receipt:', receipt);

	for (const log of receipt.logs) {
		if (log.address.toLowerCase() !== GIFTICON_NFT_ADDRESS.toLowerCase())
			continue;

		try {
			const parsed = nftContract.interface.parseLog(log);
			if (parsed?.name === 'GifticonRegistered') {
				const tokenId = parsed.args.tokenId.toBigInt(); // 🔥 실제 bigint로 변환
				console.log('tokenId (bigint):', tokenId, 'type:', typeof tokenId); // 확인용
				return tokenId;
			}
		} catch (err) {
			console.error('이벤트 파싱 실패:', err);
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
