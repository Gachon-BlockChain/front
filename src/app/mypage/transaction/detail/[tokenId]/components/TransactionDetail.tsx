'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

import { GifticonNFT } from '@/types';
import LoadingOverlay from '@/components/ui/loadingSpinner';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useItemStore } from '@/store/useItemStore';

interface Props {
	id: string;
	type: 'own' | 'sale';
}

export default function TransactionDetail({ id, type }: Props) {
	const [isLoading, setIsLoading] = useState(true);
	const { myItems, mySaleItems } = useItemStore();
	const [nft, setNft] = useState<GifticonNFT>();
	const router = useRouter();

	useEffect(() => {
		setIsLoading(true);
		try {
			// 판매 내역: 내가 민팅한 것 중 Listed 상태
			const items = type === 'sale' ? mySaleItems : myItems;
			const foundNFT = items.find((item) => item.tokenId.toString() === id);

			if (foundNFT) {
				setNft(foundNFT);
			} else {
				console.warn('해당 NFT를 찾을 수 없습니다.');
				setNft(undefined);
			}
		} catch (error) {
			console.error('NFT 상세 정보 조회 중 오류:', error);
			setNft(undefined);
		} finally {
			setIsLoading(false);
		}
	}, [id, myItems, mySaleItems, type]);

	const handleDecrypt = () => {
		console.log('🔓 NFT 복호화 요청');
	};

	if (isLoading) return <LoadingOverlay />;
	if (!nft) {
		return (
			<div className="p-6 text-center text-gray-500">
				해당 NFT 상세 정보를 불러올 수 없습니다.
			</div>
		);
	}

	return (
		<div className="flex flex-col items-center text-center">
			{/* 이미지 영역 */}
			{nft.image && (
				<div className="w-full bg-gray-100 p-4 flex justify-center">
					<Image
						src={Array.isArray(nft.image) ? nft.image[0] : nft.image}
						alt="상품 이미지"
						className="rounded-xl max-w-md w-full object-cover border"
						width={400}
						height={400}
						sizes="(max-width: 768px) 100vw, 400px"
					/>
				</div>
			)}

			{/* 정보 영역 */}
			<div className="p-6 space-y-3">
				<h1 className="text-xl font-bold">{nft.productName}</h1>
				<p className="text-sm text-gray-500">카테고리: {nft.categoryName}</p>
				<p className="text-sm text-gray-500">
					토큰 ID: {nft.tokenId.toString()}
				</p>
				<p className="text-sm text-gray-500">상태: {nft.status}</p>
				<p className="text-sm text-gray-500">
					유형: {type === 'own' ? '보유중인 NFT' : '판매한 NFT'}
				</p>
			</div>

			{type === 'own' && (
				<div className="left-0 right-0 flex justify-center">
					<Button
						className="bg-blue-500 hover:bg-blue-600"
						onClick={() => {
							// NFT 복호화 로직을 여기에 추가
							handleDecrypt();
						}}
					>
						NFT 복호화
					</Button>
					<Button
						className="bg-blue-500 hover:bg-blue-600"
						onClick={() => {
							router.push(`/resell?tokenId=${nft.tokenId}`);
						}}
					>
						재판매하기
					</Button>
				</div>
			)}
		</div>
	);
}
