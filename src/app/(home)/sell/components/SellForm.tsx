'use client';

import React, { useState } from 'react';
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
import useItems from '@/hooks/useItems';
import LoadingOverlay from '@/components/ui/loadingSpinner';

export default function SellForm() {
	const [imagePreviews, setImagePreviews] = useState<string[]>([]);
	const { listNFT, isLoading } = useItems();

	const [formData, setFormData] = useState<GifticonFormParams>({
		productName: '',
		categoryName: '전체',
		price: 0,
		expiryDate: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60,
		image: null as any, // 또는 undefined 후 타입 수정
	});

	const handleSubmit = async () => {
		await listNFT(formData);
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
					{/* 이미지 업로드 */}
					<ImageUploader
						imagePreviews={imagePreviews}
						setImagePreviews={setImagePreviews}
						setImages={(file) =>
							setFormData((prev) => ({ ...prev, image: file }))
						}
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
								placeholder="판매 가격을 입력하세요"
								value={formData.price}
								onChange={(e) =>
									setFormData((prev) => ({
										...prev,
										price: Number(e.target.value),
									}))
								}
							/>
							<div className="absolute inset-y-0 right-4 flex items-center text-gray-500">
								원
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
				</CardContent>
				<CardFooter className="flex flex-col items-start space-y-4">
					<PriceNotice price={formData.price.toString()} />
					<Button
						className="w-full bg-blue-500 hover:bg-blue-600"
						onClick={handleSubmit}
					>
						등록하기
					</Button>
				</CardFooter>
			</Card>
		</>
	);
}
