'use client';

import React, { useEffect, useState } from 'react';
import TransactionProductCard from './TransactionProductCard';
import { useSearchParams } from 'next/navigation';
import useItems from '@/hooks/useItems';
import { convertToGifticonNFT, GifticonNFT } from '@/types';
import LoadingOverlay from '@/components/ui/loadingSpinner';
import { useItemStore } from '@/store/useItemStore';
import { useAccount } from 'wagmi';

export default function TransactionProductList() {
	const [mySaleNFTs, setMySaleNFTs] = useState<GifticonNFT[]>([]);
	const [myNFTs, setMyNFTs] = useState<GifticonNFT[]>([]);
	const { address } = useAccount(); // ✅ 지갑 연결 상태 확인
	const { items, setItems } = useItemStore();

	const searchParams = useSearchParams();
	const typeParam = searchParams.get('type') || 'own';
	const type = typeParam === 'sale' ? 'sale' : 'own';

	const { fetchItems, fetchMyNFTs, isLoading } = useItems();

	useEffect(() => {
		const fetch = async () => {
			try {
				const myNfts = await fetchMyNFTs();
				console.log(
					'nft.tokenIds:',
					myNfts.map((nft) => nft.tokenId)
				);
				console.log(
					'nft.tokenIds.toString():',
					myNfts.map((nft) => nft.tokenId.toString())
				);

				if (items.length === 0) {
					console.warn('🚨 아이템이 없습니다. 먼저 아이템을 불러오세요.');
					const items = await fetchItems({
						categoryName: '전체',
					});
					setItems(items);
				}

				// 판매 내역: 내가 민팅한 것 중 Listed 상태
				const mySales = items.reduce<GifticonNFT[]>((acc, item) => {
					if (item.seller === address && item.status === 'Listed') {
						acc.push(convertToGifticonNFT(item));
					}
					return acc;
				}, []);

				setMySaleNFTs(mySales);
				setMyNFTs(myNfts);
			} catch (err) {
				console.error('🚨 내 NFT 조회 중 오류:', err);
			}
		};

		fetch();
	}, []);

	const filteredNFTs = type === 'sale' ? mySaleNFTs : myNFTs;

	if (isLoading) return <LoadingOverlay />;

	if (filteredNFTs.length === 0) {
		return (
			<div className="p-8 text-center text-gray-500">
				{type === 'own'
					? '보유 중인 NFT가 없습니다.'
					: '판매 내역이 없습니다.'}
			</div>
		);
	}

	return (
		<div className="p-4 flex flex-col gap-6">
			{filteredNFTs.map((nft, index) => (
				<React.Fragment key={nft.tokenId}>
					{index > 0 && <div className="border-t border-gray-100 w-full"></div>}
					<TransactionProductCard
						nft={nft}
						type={type}
					/>
				</React.Fragment>
			))}
		</div>
	);
}
