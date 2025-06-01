'use client';

import React, { useEffect, useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
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
import ImageUploader from './ImageUploader';
import PriceNotice from './PriceNotice';
import { CATEGORY_LIST, CategoryName, GifticonFormParams } from '@/types';
import LoadingOverlay from '@/components/ui/loadingSpinner';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import useListItems from '@/hooks/useListItems';

export default function SellForm() {
	const router = useRouter();
	const [imagePreviews, setImagePreviews] = useState<string[]>([]);
	const [encryptImagePreviews, setEncryptImagePreviews] = useState<string[]>(
		[]
	);
	const [tokenId, setTokenId] = useState<bigint | null>(null);
	const [tokenURI, setTokenURI] = useState<string | null>(null);
	const [encryptIpfsHash, setEncryptIpfsHash] = useState<string | null>(null);

	const {
		initWeb3,
		registerGifticon,
		setMetadata,
		setTokenURIAndIpfsHash,
		isLoading,
		step,
	} = useListItems();

	useEffect(() => {
		initWeb3();
	}, []);

	const handleSubmit = async () => {
		try {
			if (step === 1) {
				const id = await registerGifticon(formData.expiryDate, formData.price);
				setTokenId(id);
			} else if (step === 2) {
				if (!tokenId) throw new Error('tokenId가 없습니다.');
				const { tokenURI, encryptIpfsHash } = await setMetadata(
					tokenId,
					formData
				);
				setTokenURI(tokenURI);
				setEncryptIpfsHash(encryptIpfsHash);
			} else if (step === 3) {
				if (!tokenId || !tokenURI || !encryptIpfsHash)
					throw new Error('필수 데이터가 누락되었습니다.');
				await setTokenURIAndIpfsHash(tokenId, tokenURI, encryptIpfsHash);
				toast.success('3단계 완료: NFT 최종 등록 완료');
				router.push('/resell');
			}
		} catch (err: any) {
			console.error(err);
			toast.error(err.message || `스텝 ${step} 처리 실패`);
		}
	};

	const [formData, setFormData] = useState<GifticonFormParams>({
		productName: '',
		categoryName: '전체',
		price: 0,
		expiryDate: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60,
		image: null as any, // 또는 undefined 후 타입 수정
		encryptImage: null as any, // 또는 undefined 후 타입 수정
		description: '',
	});

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
					{/* 공개 이미지 업로드 */}
					<ImageUploader
						imagePreviews={imagePreviews}
						setImagePreviews={setImagePreviews}
						setImages={(file) =>
							setFormData((prev) => ({ ...prev, image: file }))
						}
					/>
					{/* 비공개 이미지(바코드) 업로드 */}
					<ImageUploader
						imagePreviews={encryptImagePreviews}
						setImagePreviews={setEncryptImagePreviews}
						setImages={(file) =>
							setFormData((prev) => ({ ...prev, encryptImage: file }))
						}
						isPublic={false}
					/>
					{/* 상품명 */}
					<div className="space-y-2">
						<Label htmlFor="title">상품명</Label>
						<Input
							id="title"
							placeholder="판매할 기프티콘 이름을 입력하세요"
							onChange={(e) =>
								setFormData((prev) => ({
									...prev,
									productName: e.target.value,
								}))
							}
						/>
					</div>

					{/* 카테고리 */}
					<div className="space-y-2">
						<Label htmlFor="category">카테고리</Label>
						<Select
							onValueChange={(value) =>
								setFormData((prev) => ({
									...prev,
									categoryName: value as CategoryName,
								}))
							}
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

					{/* 가격 */}
					<div className="space-y-2">
						<Label htmlFor="price">가격</Label>
						<div className="relative">
							<Input
								id="price"
								type="number"
								step="any"
								min="0"
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

					{/* 유효기간 */}
					<div className="space-y-2">
						<Label>유효기간</Label>
						<div className="border rounded-md p-2">
							<Calendar
								mode="single"
								selected={new Date(formData.expiryDate * 1000)}
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
				</CardContent>
				<CardFooter className="flex flex-col items-start space-y-4">
					<PriceNotice price={formData.price.toString()} />
					<Button
						className="w-full bg-blue-500 hover:bg-blue-600"
						onClick={handleSubmit}
					>
						{step === 1 && '1단계: NFT 등록'}
						{step === 2 && '2단계: 메타데이터 업로드'}
						{step === 3 && '3단계: NFT - 메타데이터 연결'}
					</Button>
				</CardFooter>
			</Card>
		</>
	);
}
