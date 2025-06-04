'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

import ProductHeader from '@/app/(home)/product/[tokenId]/components/ProductHeader';
import ProductImage from '@/app/(home)/product/[tokenId]/components/ProductImage';
import ProductInfo from '@/app/(home)/product/[tokenId]/components/ProductInfo';
import BottomPurchaseBar from '@/app/(home)/product/[tokenId]/components/BottomPurchaseBar';
import LoadingOverlay from '@/components/ui/loadingSpinner';

import { GifticonItem } from '@/types';
import { useItemStore } from '@/store/useItemStore';
import { BigNumber } from 'ethers';

export default function ProductPage() {
	//props로 해당되는 nft 페이지만 보여주기기
	const params = useParams();
	const { items } = useItemStore();

	const tokenIdStr = params.tokenId?.toString();
	const tokenIdBigInt = tokenIdStr ? BigInt(tokenIdStr) : null;

	const [nft, setNft] = useState<GifticonItem>();
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const loadItem = async () => {
			try {
				const matchedItem = items.find((item) => {
					const tokenId = BigNumber.isBigNumber(item.tokenId)
						? item.tokenId.toBigInt()
						: item.tokenId;
					console.log('item.tokenId:', item.tokenId);
					console.log('tokenIdBigInt:', tokenIdBigInt);
					return tokenId === tokenIdBigInt;
				});
				console.log('🚀 matchedItem:', matchedItem);
				setNft(matchedItem);
			} catch (err) {
				console.error('🚨 NFT fetch error:', err);
			} finally {
				setIsLoading(false);
			}
		};
		if (tokenIdBigInt != undefined) loadItem();
	}, [items, params, tokenIdBigInt]);

	if (nft === undefined) {
		return (
			<div className="p-8 text-center text-gray-500">
				해당 NFT를 찾을 수 없습니다.
			</div>
		);
	}

	return isLoading ? (
		<LoadingOverlay />
	) : (
		<main className="flex flex-col min-h-screen pb-16">
			<ProductHeader />
			<ProductImage
				image={Array.isArray(nft.image) ? nft.image : [nft.image]}
			/>
			<ProductInfo product={nft} />

			<BottomPurchaseBar
				price={nft.price}
				tokenId={nft.tokenId}
				barcodeURI={nft.encryptImage}
				productName={nft.productName}
			/>
		</main>
	);
}
