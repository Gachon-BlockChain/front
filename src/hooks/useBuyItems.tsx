import { toast } from 'react-toastify';
import { useState } from 'react';
import { Contract, ethers } from 'ethers';
import { GifticonNFTABI, MarketplaceABI } from '@/context';
import { ContractContext } from '@/types';

const MARKETPLACE_ADDRESS = process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS ?? '';
const GIFTICON_NFT_ADDRESS = process.env.NEXT_PUBLIC_GIFTICON_NFT_ADDRESS ?? '';

export default function useBuyItems() {
	const [isLoading, setIsLoading] = useState<boolean>(false);

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

	return { isLoading, buyNFT };
}
