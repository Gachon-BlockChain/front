'use client';

import React, { useEffect } from 'react';
import TransactionProductCard from './TransactionProductCard';
import { useSearchParams } from 'next/navigation';
import { convertToGifticonNFT, GifticonNFT } from '@/types';
import LoadingOverlay from '@/components/ui/loadingSpinner';
import { useItemStore } from '@/store/useItemStore';
import { useAccount } from 'wagmi';
import useFetchItems from '@/hooks/useFetchItems';

export default function TransactionProductList() {
	const { address } = useAccount(); // ✅ 지갑 연결 상태 확인
	const { items, myItems, mySaleItems, setItems, setMyItems, setMySaleItems } =
		useItemStore();

	const searchParams = useSearchParams();
	const typeParam = searchParams.get('type') || 'own';
	const type = typeParam === 'sale' ? 'sale' : 'own';

	const { fetchItems, fetchMyNFTs, isLoading } = useFetchItems();

	useEffect(() => {
		const fetch = async () => {
			try {
				if (myItems.length == 0) {
					console.warn('🚨 내 아이템이 없습니다. 먼저 아이템을 불러오세요.');
					const myItems = await fetchMyNFTs();
					setMyItems(myItems);
				}

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

				setMySaleItems(mySales);
			} catch (err) {
				console.error('🚨 내 NFT 조회 중 오류:', err);
			}
		};

		fetch();
	}, []);

	const filteredNFTs = type === 'sale' ? mySaleItems : myItems;

	if (isLoading) return <LoadingOverlay />;

	if (filteredNFTs.length === 0) {
		return (
			<div className="p-8 text-center text-gray-500">
				{type === 'own' ? '보유 중인 NFT가 없습니다.' : '판매 내역이 없습니다.'}
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
