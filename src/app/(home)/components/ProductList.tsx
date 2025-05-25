'use client';

import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import CategoryBar from './CategoryBar';
import useItems from '@/hooks/useItems'; // 직접 작성한 훅
import { CategoryName, GifticonItem } from '@/types';
import LoadingOverlay from '@/components/ui/loadingSpinner';

export default function ProductList() {
	const [selectedCategory, setSelectedCategory] =
		useState<CategoryName>('전체');
	const { isLoading, fetchItems } = useItems(); // 직접 작성한 훅 사용
	const [items, setItems] = useState<GifticonItem[]>([]);

	useEffect(() => {
		const loadItems = async () => {
			const items = await fetchItems({
				categoryName: selectedCategory,
			});
			setItems(items);
		};

		loadItems();
	}, [selectedCategory, fetchItems]);

	return (
		<>
			{isLoading && <LoadingOverlay />}
			{/* 카테고리 바 */}
			<CategoryBar
				selectedCategory={selectedCategory}
				onCategoryChange={setSelectedCategory}
			/>
			<div className="p-4 flex flex-col gap-4">
				{items.length === 0 ? (
					<div className="text-center py-8 text-gray-500">
						해당 카테고리의 상품이 없습니다.
					</div>
				) : (
					items.map((item, index) => (
						<React.Fragment key={item.tokenId}>
							{index > 0 && (
								<div className="border-t border-gray-100 w-full my-2"></div>
							)}
							<ProductCard product={item} />
						</React.Fragment>
					))
				)}
			</div>
		</>
	);
}
