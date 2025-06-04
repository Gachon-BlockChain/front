'use client';

import { formatPrice } from '@/lib/utils';
import useBuyItems from '@/hooks/useBuyItems';
import useRedeemItems from '@/hooks/useRedeemItems';
import { useItemStore } from '@/store/useItemStore';
import { GifticonNFT } from '@/types';

interface BottomPurchaseBarProps {
	price: number;
	tokenId: bigint;
	productName: string;
	barcodeURI?: string;
}

export default function BottomPurchaseBar({
	price,
	tokenId,
	barcodeURI,
  	productName,
}: BottomPurchaseBarProps) {
	const { buyNFT, isLoading } = useBuyItems();
	const { redeemNFT } = useRedeemItems();

	const handleDecrypt = async () => {
		const nft = {
			tokenId,
			productName,
			encryptImage: barcodeURI,
		} as unknown as GifticonNFT;

		console.log('✅ 복호화 시작...');
		const success = await redeemNFT(nft);
		if (!success) {
			console.log('❌ 복호화 실패: 스마트컨트랙트 거절');
		}
	};
	
	const handlePurchase = async () => {
		const success = await buyNFT(tokenId, price);
		if (!success) {
			console.warn('구매 실패 또는 취소됨');
		}
	};

	return (
		<div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50">
			<div className="flex justify-between items-center">
				<div className="flex flex-col ml-14">
					<span className="text-sm text-gray-500">상품 가격</span>
					<span className="text-lg font-bold">{formatPrice(price)}</span>
				</div>

				<div className="flex gap-2">
					{/* 🔐 복호화 버튼 */}
					<button
						className="px-4 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg transition-all hover:bg-gray-300 active:scale-95"
						onClick={handleDecrypt}
					>
						복호화
					</button>

					{/* 🛒 구매하기 버튼 */}
					<button
						className={`px-6 py-3 ${
							isLoading ? 'bg-blue-400' : 'bg-blue-500'
						} text-white font-semibold rounded-lg transition-all transform active:scale-95 ${
							isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-600'
						}`}
						onClick={handlePurchase}
						disabled={isLoading}
					>
						{isLoading ? (
							<span className="flex items-center gap-2">
								<svg
									className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
								>
									<circle
										className="opacity-25"
										cx="12"
										cy="12"
										r="10"
										stroke="currentColor"
										strokeWidth="4"
									></circle>
									<path
										className="opacity-75"
										fill="currentColor"
										d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
									></path>
								</svg>
								처리 중...
							</span>
						) : (
							'구매하기'
						)}
					</button>
				</div>
			</div>
		</div>
	);
}