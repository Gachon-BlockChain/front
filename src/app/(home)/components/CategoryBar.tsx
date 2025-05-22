import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { CATEGORY_LIST, CategoryName } from '@/types/gifticon';
import React from 'react';

interface CategoryBarProps {
	selectedCategory: CategoryName;
	onCategoryChange: (category: CategoryName) => void;
}

export default function CategoryBar({
	selectedCategory,
	onCategoryChange,
}: CategoryBarProps) {
	return (
		<div className="flex justify-between items-center p-3 border-b border-gray-100">
			<div className="flex items-center gap-1.5">
				<Select
					value={selectedCategory}
					onValueChange={onCategoryChange}
				>
					<SelectTrigger className="w-[120px]">
						<SelectValue placeholder="카테고리" />
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
			<div className="flex items-center"></div>
		</div>
	);
}
