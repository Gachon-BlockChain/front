import { toast } from 'react-toastify';
import { useState } from 'react';
import { Contract, ethers } from 'ethers';
import { GifticonNFTABI, MarketplaceABI } from '@/context';
import { ContractContext, GifticonNFT } from '@/types';
import { decryptBarcode, loadMessageKit } from '@/lib/taco';

const MARKETPLACE_ADDRESS = process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS ?? '';
const GIFTICON_NFT_ADDRESS = process.env.NEXT_PUBLIC_GIFTICON_NFT_ADDRESS ?? '';

export default function useRedeemItems() {
	const [isLoading, setIsLoading] = useState<boolean>(false);

    /**
     * 기프티콘 NFT를 복호화하고 제거하는 로직
     * NFT 등록시 에러가 너무 자주 발생해서, 일단 삭제 로직은 안넣음
     */ 
	const redeemNFT = async (nft: GifticonNFT): Promise<File> => {
		setIsLoading(true);

		try {
			if (nft.encryptImage === undefined) {
				setIsLoading(false);
				throw new Error('암호화된 이미지가 없습니다.');
			}
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

			const messageKit = await loadMessageKit(nft.encryptImage);
			const file = await decryptBarcode(
				messageKit,
				signer,
				provider,
				nft.productName
			);

			// File → Blob URL
			const url = URL.createObjectURL(file);

			// 새 탭에서 열기
			window.open(url, '_blank');

			toast.success('🎉 복호화가 완료되었습니다!');
			return file;
		} catch (error: any) {
			console.error('🚨 복호화 실패:', error);
			toast.error(error.message || '복호화 중 문제가 발생했습니다.');
			throw error; // 에러를 다시 던져서 호출한 곳에서 처리할 수 있도록 함
		} finally {
			setIsLoading(false);
		}
	};

	return { isLoading, redeemNFT };
}
