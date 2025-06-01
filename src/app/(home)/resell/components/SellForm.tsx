'use client';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import PriceNotice from './PriceNotice';
import { CATEGORY_LIST, GifticonNFT } from '@/types';
import LoadingOverlay from '@/components/ui/loadingSpinner';
import { Calendar } from '@/components/ui/calendar';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import useFetchItems from '@/hooks/useFetchItems';
import useListItems from '@/hooks/useListItems';

export default function SellForm() {
	const router = useRouter();
	const [myNFTs, setMyNFTs] = useState<GifticonNFT[]>([]);
	const { fetchMyNFTs } = useFetchItems();
	const { isLoading, initWeb3, listNFT } = useListItems();

	const [formData, setFormData] = useState<GifticonNFT & { price: number }>({
		tokenId: BigInt(-1),
		originalOwner: '',
		depositAmount: 0,
		status: 'Listed',
		burnTimestamp: 0,
		productName: '',
		description: '',
		image: '',
		categoryName: '전체',
		price: 0,
	});

	useEffect(() => {
		initWeb3();
	}, []);

	const handleSubmit = async () => {
		if (!formData) {
			toast.error('모든 필드를 채워주세요.');
			return;
		}
		try {
			await listNFT({
				tokenId: formData.tokenId,
				price: formData.price,
			});
			toast.success('기프티콘이 성공적으로 등록되었습니다.');
			router.push('/');
		} catch (error) {
			toast.error('기프티콘 등록에 실패했습니다. 다시 시도해주세요.');
			console.error('Error listing NFT:', error);
			return;
		}
	};

	const handleFetchMyNFTs = async () => {
		const result = await fetchMyNFTs();
		setMyNFTs(result);
	};

	const handleSelectNFT = (nft: GifticonNFT) => {
		setFormData({
			...nft,
			price: nft.depositAmount,
		});
	};

	return (
		<>
			{isLoading && <LoadingOverlay />}
			<Card className="w-full">
				<CardHeader>
					<CardTitle>기프티콘 정보</CardTitle>
					<CardDescription>
						판매할 기프티콘의 정보를 입력해주세요.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					<Button
						className="w-full bg-green-500 hover:bg-green-600 text-white"
						onClick={handleFetchMyNFTs}
					>
						NFT 가져오기
					</Button>

					{myNFTs.length > 0 && (
						<div className="grid grid-cols-2 gap-2">
							{myNFTs.map((nft) => (
								<Card
									key={nft.tokenId}
									onClick={() => handleSelectNFT(nft)}
									className={
										formData.tokenId === nft.tokenId
											? 'border border-blue-500 bg-gray-100 opacity-70'
											: ''
									}
								>
									<CardContent className="p-2">
										<div className="relative w-full h-40 rounded border border-gray-200 overflow-hidden">
											<Image
												src={nft.image}
												alt={nft.productName}
												fill
												className="object-cover"
												sizes="100vw"
												quality={80}
											/>
										</div>

										<div>상품명: {nft.productName}</div>
										<div>담보: {nft.depositAmount} POL</div>
									</CardContent>
								</Card>
							))}
						</div>
					)}

					{formData.tokenId !== BigInt(-1) && (
						<>
							<div className="space-y-2">
								<Label htmlFor="title">상품명</Label>
								<Input
									id="title"
									value={formData.productName}
									readOnly
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="category">카테고리</Label>
								<Select
									disabled
									value={formData.categoryName}
								>
									<SelectTrigger>
										<SelectValue placeholder="카테고리 선택" />
									</SelectTrigger>
									<SelectContent>
										{CATEGORY_LIST.map((category) => (
											<SelectItem
												key={category}
												value={category}
											>
												{category}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-2">
								<Label htmlFor="price">가격</Label>
								<div className="relative">
									<Input
										id="price"
										type="number"
										placeholder="판매 가격을 입력하세요"
										className="pr-14"
										value={formData.price}
										onChange={(e) =>
											setFormData((prev) => ({
												...prev,
												price: Number(e.target.value),
											}))
										}
									/>
									<div className="absolute inset-y-0 right-4 flex items-center text-gray-500">
										POL
									</div>
								</div>
							</div>

							<div className="space-y-2">
								<Label>유효기간</Label>
								<div className="border rounded-md p-2">
									<Calendar
										mode="single"
										selected={new Date(formData.burnTimestamp * 1000)}
										disabled={(date) => date < new Date()}
										className="rounded-md border"
										onSelect={(date) =>
											date &&
											setFormData((prev) => ({
												...prev,
												expiryDate: Math.floor(date.getTime() / 1000),
											}))
										}
									/>
								</div>
							</div>
							{/* 상품 설명 */}
							<div className="space-y-2">
								<Label htmlFor="description">상품 설명</Label>
								<Input
									id="description"
									placeholder="상품에 대한 설명을 입력하세요"
									value={formData.description}
									onChange={(e) =>
										setFormData((prev) => ({
											...prev,
											description: e.target.value,
										}))
									}
								/>
							</div>
						</>
					)}
				</CardContent>
				<CardFooter className="flex flex-col items-start space-y-4">
					<PriceNotice price={formData.price.toString()} />
					{formData.tokenId !== BigInt(-1) && (
						<Button
							className="w-full bg-blue-500 hover:bg-blue-600"
							onClick={handleSubmit}
						>
							등록하기
						</Button>
					)}
				</CardFooter>
			</Card>
		</>
	);
}
