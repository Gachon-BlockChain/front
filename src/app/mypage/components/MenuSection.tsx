'use client';

import React from 'react';
import { ShoppingBag, Package, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useItemStore } from '@/store/useItemStore';

type MenuItemProps = {
	href: string;
	icon: React.ReactNode;
	label: string;
	count?: number;
};

function MenuItem({ href, icon, label, count }: MenuItemProps) {
	return (
		<Link
			href={href}
			className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
		>
			<div className="flex items-center">
				{icon}
				<span className="ml-3">{label}</span>
				{count !== undefined && count > 0 && (
					<span className="ml-2 text-sm px-2 py-0.5 bg-[#4AC1DB] text-white rounded-full">
						{count}
					</span>
				)}
			</div>
			<ChevronRight
				size={18}
				className="text-gray-400"
			/>
		</Link>
	);
}

export default function MenuSection() {
	const { myItems, mySaleItems } = useItemStore();
	console.log('🚀 MenuSection - myItems:', myItems.length);

	return (
		<div className="bg-white rounded-lg shadow-sm">
			<div className="p-4">
				<h3 className="text-lg font-semibold mb-2">나의 거래</h3>
				<div className="flex flex-col">
					<MenuItem
						href="/mypage/transaction?type=own"
						icon={<ShoppingBag size={20} />}
						label="보유 중인 NFT"
						count={myItems.length}
					/>
					<MenuItem
						href="/mypage/transaction?type=sale"
						icon={<Package size={20} />}
						label="판매 내역"
						count={mySaleItems.length}
					/>
				</div>
			</div>
		</div>
	);
}
